import os
import json
from datetime import datetime

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from .models import FitnessRecord
from .serializers import FitnessRecordSerializer
from userInfo.models import UserInfo

def load_hourly_json():
    json_path = os.path.join(os.path.dirname(__file__), "hourlyintensities_merged.json")
    if not os.path.exists(json_path):
        return None

    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)

class FitnessRecordListByUser(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        data = load_hourly_json()
        if data is None:
            return Response({"detail": "JSON file not found."}, status=500)

        records = [r for r in data if r.get("Id") == user_id]

        date_str = request.query_params.get("date")
        if date_str:
            try:
                target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
                def parse_hour(t):
                    for fmt in ("%m/%d/%Y %I:%M:%S %p", "%Y-%m-%d %H:%M:%S"):
                        try:
                            return datetime.strptime(t, fmt)
                        except:
                            continue
                    return None

                records = [
                    r for r in records
                    if parse_hour(r["ActivityHour"]) and parse_hour(r["ActivityHour"]).date() == target_date
                ]
            except ValueError:
                return Response({"error": "Invalid date format, use YYYY-MM-DD"}, status=400)

        # 排序
        def parse_hour(t):
            for fmt in ("%m/%d/%Y %I:%M:%S %p", "%Y-%m-%d %H:%M:%S"):
                try:
                    return datetime.strptime(t, fmt)
                except:
                    continue
            return None

        records.sort(key=lambda r: parse_hour(r["ActivityHour"]) or datetime.min)
        return Response(records, status=200)

class FitnessRecordCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = FitnessRecordSerializer(data=request.data)
        if serializer.is_valid():
            record = serializer.save()
            return Response(FitnessRecordSerializer(record).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
