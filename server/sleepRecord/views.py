import os
import json
from datetime import datetime

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from .models import SleepRecord
from .serializers import SleepRecordSerializer


def load_sleep_json():
    json_path = os.path.join(os.path.dirname(__file__), "sleepDaily.cleaned.json")
    if not os.path.exists(json_path):
        return None

    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)

class SleepRecordListById(APIView):
    permission_classes = [AllowAny]

    def get(self, request, id):
        data = load_sleep_json()
        if data is None:
            return Response({"detail": "sleepDaily.cleaned.json not found"}, status=500)

        records = [r for r in data if r.get("Id") == id]

        def parse_time(t):
            for fmt in ("%m/%d/%Y %I:%M:%S %p", "%Y-%m-%d %H:%M:%S"):
                try:
                    return datetime.strptime(t, fmt)
                except:
                    continue
            return None

        date_str = request.query_params.get("date")
        if date_str:
            try:
                target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
                records = [
                    r for r in records
                    if parse_time(r["SleepDay"]) and parse_time(r["SleepDay"]).date() == target_date
                ]
            except ValueError:
                pass

        # Sort by date
        records.sort(key=lambda r: parse_time(r["SleepDay"]) or datetime.min)

        return Response(records)


class SleepRecordCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SleepRecordSerializer(data=request.data)

        if serializer.is_valid():
            record = serializer.save()
            return Response(
                SleepRecordSerializer(record).data,
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
