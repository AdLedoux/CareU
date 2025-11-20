import os
import json
from datetime import datetime

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from .models import HeartRate
from .serializers import HeartRateSerializer


def load_heart_json():
    json_path = os.path.join(os.path.dirname(__file__), "heartRateInfo.cleaned.json")
    if not os.path.exists(json_path):
        return None

    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)


class HeartRateListById(APIView):
    permission_classes = [AllowAny]
    def get(self, request, id):
        data = load_heart_json()
        if data is None:
            return Response({"detail": "JSON file not found."}, status=500)

        # filter by Id
        records = [r for r in data if r.get("Id") == id]

        # parse time
        def parse_time(t):
            for fmt in ("%Y-%m-%d %H:%M:%S", "%m/%d/%Y %I:%M:%S %p"):
                try:
                    return datetime.strptime(t, fmt)
                except:
                    continue
            return None

        records.sort(key=lambda r: parse_time(r["Time"]) or datetime.min)

        return Response(records)


class HeartRateDailyByIdView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, id):
        data = load_heart_json()
        if data is None:
            return Response({"detail": "JSON file not found."}, status=500)

        # filter by Id
        records = [r for r in data if r.get("Id") == id]

        def parse_time(t):
            for fmt in ("%Y-%m-%d %H:%M:%S", "%m/%d/%Y %I:%M:%S %p"):
                try:
                    return datetime.strptime(t, fmt)
                except:
                    continue
            return None

        # sort by time
        records.sort(key=lambda r: parse_time(r["Time"]) or datetime.min)

        # group by date (get last entry per day)
        daily = {}
        for r in records:
            dt = parse_time(r["Time"])
            if not dt:
                continue
            day = dt.strftime("%Y-%m-%d")
            daily[day] = {
                "date": day,
                "Value": r["Value"],
            }

        return Response(list(daily.values()))


class HeartRateCreateView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = HeartRateSerializer(data=request.data)

        if serializer.is_valid():
            record = serializer.save()
            return Response(
                HeartRateSerializer(record).data,
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
