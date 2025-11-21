"""
WeightLog views: switch from JSON-file-backed dev endpoints to DB-backed endpoints.

Endpoints now expect a `user_id` (UUID) path parameter for list/daily views.
Create endpoint accepts a payload with `Id` (user_id) or can be called with a body containing the user's UUID.

Behavior:
- GET /weight/<uuid:user_id>/       -> returns all WeightLog objects for that user (serialized)
- GET /weight/<uuid:user_id>/daily/ -> returns one entry per day (last recorded of that day)
- POST /weight/add/                 -> creates a WeightLog record in DB for the provided `Id` (user_id) and returns the created record

"""

from datetime import datetime

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from django.shortcuts import get_object_or_404

from .models import WeightLog
from .serializers import WeightLogSerializer
from userInfo.models import UserInfo


class WeightLogListById(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        # user_id is a UUID (path converter)
        qs = WeightLog.objects.filter(user__user_id=user_id).order_by("Date")
        data = WeightLogSerializer(qs, many=True).data
        return Response(data, status=200)


class DailyWeightByIdView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        qs = WeightLog.objects.filter(user__user_id=user_id).order_by("Date")

        # Build a dict keyed by date -> keep last entry of the day
        daily = {}
        for rec in qs:
            day = rec.Date.date().isoformat()
            # overwrite so the last record for the day remains
            daily[day] = {
                "date": day,
                "WeightKg": rec.WeightKg,
                "WeightPounds": rec.WeightPounds,
                "Fat": rec.Fat,
                "BMI": rec.BMI,
            }

        # Return as sorted list by date
        items = [daily[d] for d in sorted(daily.keys())]
        return Response(items, status=200)


class WeightLogCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Expect the payload to include user id in `Id` (UUID) or `user_id`.
        user_id = request.data.get("Id") or request.data.get("user_id")
        if not user_id:
            return Response({"detail": "Missing user Id."}, status=status.HTTP_400_BAD_REQUEST)

        # Find UserInfo by user_id
        try:
            user = UserInfo.objects.get(user_id=user_id)
        except UserInfo.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_400_BAD_REQUEST)

        # Parse fields
        date_str = request.data.get("Date")
        dt = None
        if date_str:
            try:
                # expect 'YYYY-MM-DD HH:MM:SS'
                dt = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
            except Exception:
                try:
                    dt = datetime.fromisoformat(date_str.replace("Z", ""))
                except Exception:
                    dt = None

        try:
            weight = float(request.data.get("WeightKg")) if request.data.get("WeightKg") is not None else None
        except Exception:
            weight = None
        try:
            pounds = float(request.data.get("WeightPounds")) if request.data.get("WeightPounds") is not None else None
        except Exception:
            pounds = None
        try:
            fat = float(request.data.get("Fat")) if request.data.get("Fat") not in (None, "") else None
        except Exception:
            fat = None
        try:
            bmi = float(request.data.get("BMI")) if request.data.get("BMI") not in (None, "") else None
        except Exception:
            bmi = None

        if dt is None:
            return Response({"detail": "Invalid or missing Date format."}, status=status.HTTP_400_BAD_REQUEST)

        # Create DB record
        try:
            rec = WeightLog.objects.create(
                user=user,
                Date=dt,
                WeightKg=weight,
                WeightPounds=pounds,
                Fat=fat,
                BMI=bmi,
            )
            resp = WeightLogSerializer(rec).data
            resp.update({"db_saved": True})
            return Response(resp, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"detail": f"Failed to create record: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

