import json
from datetime import datetime
from pathlib import Path

from django.conf import settings
from django.db.models import Avg, Case, IntegerField, Max, Sum, When
from rest_framework import generics, status
from rest_framework.parsers import JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import SleepLog
from .serializers import SleepImportSerializer, SleepLogSerializer


class SleepLogListCreateView(generics.ListCreateAPIView):
    serializer_class = SleepLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = SleepLog.objects.filter(user=self.request.user)
        start = self.request.query_params.get("start")
        end = self.request.query_params.get("end")
        was_interrupted = self.request.query_params.get("was_interrupted")
        if start:
            qs = qs.filter(sleep_day__gte=start)
        if end:
            qs = qs.filter(sleep_day__lte=end)
        if was_interrupted is not None:
            if was_interrupted.lower() in {"true", "1"}:
                qs = qs.filter(was_interrupted=True)
            elif was_interrupted.lower() in {"false", "0"}:
                qs = qs.filter(was_interrupted=False)
        return qs.order_by("-sleep_day")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SleepImportView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, JSONParser]

    def post(self, request):
        """Allow uploading JSON array or consuming the bundled sample file via ?use_sample=true"""
        use_sample = request.query_params.get("use_sample")
        payload = None

        try:
            if use_sample and use_sample.lower() in {"1", "true", "yes"}:
                sample_path = Path(settings.BASE_DIR) / "sample_data" / "sleepDay_merged.json"
                if not sample_path.exists():
                    # Fallback to relative to this file if project structure differs
                    alt_path = Path(__file__).resolve().parent.parent / "sample_data" / "sleepDay_merged.json"
                    sample_path = alt_path if alt_path.exists() else sample_path
                with open(sample_path, "r", encoding="utf-8") as fh:
                    payload = json.load(fh)
            elif request.FILES.get("file"):
                uploaded = request.FILES["file"]
                payload = json.load(uploaded)
            else:
                payload = request.data

            if not isinstance(payload, (list, tuple)):
                return Response({"detail": "Payload must be a JSON array of sleep rows."}, status=status.HTTP_400_BAD_REQUEST)

            serializer = SleepImportSerializer(data=payload, many=True, context={"request": request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({"detail": "Sleep data imported", "count": len(serializer.validated_data)}, status=status.HTTP_201_CREATED)
        except FileNotFoundError:
            return Response({"detail": "Sample file not found. Ensure server/sample_data/sleepDay_merged.json exists."}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError as exc:
            return Response({"detail": f"Invalid JSON: {exc}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:  # surfacing unexpected server errors to the client for easier debugging
            return Response({"detail": f"Import failed: {exc}"}, status=status.HTTP_400_BAD_REQUEST)


class SleepSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = SleepLog.objects.filter(user=request.user)
        start = request.query_params.get("start")
        end = request.query_params.get("end")
        if start:
            qs = qs.filter(sleep_day__gte=start)
        if end:
            qs = qs.filter(sleep_day__lte=end)

        summary = qs.aggregate(
            average_minutes_asleep=Avg("total_minutes_asleep"),
            longest_sleep_minutes=Max("total_minutes_asleep"),
            interrupted_days=Sum(Case(When(was_interrupted=True, then=1), default=0, output_field=IntegerField())),
        )
        total_days = qs.count()
        interrupted = summary.get("interrupted_days") or 0
        avg_minutes = summary.get("average_minutes_asleep") or 0
        longest = summary.get("longest_sleep_minutes") or 0
        timeseries = list(
            qs.values("sleep_day")
            .annotate(
                minutes=Avg("total_minutes_asleep"),
                interruptions=Sum("interruptions"),
                interruption_minutes=Sum("interruption_minutes"),
            )
            .order_by("sleep_day")
        )
        return Response(
            {
                "average_minutes_asleep": avg_minutes,
                "average_hours_asleep": round(avg_minutes / 60.0, 2) if avg_minutes else 0,
                "days_tracked": total_days,
                "interrupted_days": interrupted,
                "interruption_rate": round((interrupted / total_days) * 100, 2) if total_days else 0,
                "longest_sleep_minutes": longest,
                "timeseries": timeseries,
            }
        )
