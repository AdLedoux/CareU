import json
from pathlib import Path
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

DATA_FILE = Path(__file__).resolve().parent / "dailyActivity.cleaned.json"


def load_sample_data():
    with open(DATA_FILE, "r") as f:
        return json.load(f)


class ActivityByIdView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, id):
        data = load_sample_data()
        activity = next((a for a in data if a["Id"] == id), None)
        if not activity:
            return Response({"error": "Activity not found"}, status=404)
        return Response(activity)


class DailyCaloriesByIdView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, id):
        data = load_sample_data()
        activities = [a for a in data if a["Id"] == id]
        result = [
            {"date": a["ActivityDate"], "Calories": a["Calories"]} for a in activities
        ]
        return Response(result)


class DailyActivityByIdView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, id):
        data = load_sample_data()
        activities = [a for a in data if a["Id"] == id]
        result = [
            {
                "date": a["ActivityDate"],
                "Calories": a["Calories"],
                "TotalSteps": a["TotalSteps"],
                "TotalDistance": a["TotalDistance"],
            }
            for a in activities
        ]
        return Response(result)
