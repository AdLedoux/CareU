from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import FitnessRecord
from .serializers import FitnessRecordSerializer
from userInfo.models import UserInfo


class FitnessRecordListByUser(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id=None):
        uid = user_id or request.query_params.get("Id")
        if not uid:
            return Response({"detail": "user id required"}, status=400)

        qs = FitnessRecord.objects.filter(user__user_id=uid).order_by("-created_at")

        date_str = request.query_params.get("date")
        if date_str:
            try:
                target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
                qs = qs.filter(created_at__date=target_date)
            except ValueError:
                return Response({"error": "Invalid date format, use YYYY-MM-DD"}, status=400)

        serializer = FitnessRecordSerializer(qs, many=True)
        return Response(serializer.data, status=200)


class FitnessRecordCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Expect: Id (user.user_id), activity_type, duration_minutes (optional)
        user_id = request.data.get("Id")
        if not user_id:
            return Response({"detail": "Id (user_id) is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = UserInfo.objects.get(user_id=user_id)
        except UserInfo.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        activity_type = request.data.get("activity_type", "")
        duration = request.data.get("duration_minutes")

        record = FitnessRecord.objects.create(
            user=user,
            activity_type=activity_type,
            duration_minutes=int(duration) if (duration is not None and str(duration) != "") else 0,
        )
        serializer = FitnessRecordSerializer(record)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
