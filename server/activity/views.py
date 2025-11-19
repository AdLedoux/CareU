from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.response import Response
import datetime

from .models import Activity
from .serializers import ActivitySerializer
from userInfo.models import UserInfo


class ActivityByUsernameView(APIView):
    def get(self, request, username):
        try:
            user = UserInfo.objects.get(username=username)
        except UserInfo.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        activities = Activity.objects.filter(user=user).order_by("ActivityDate")
        serializer = ActivitySerializer(activities, many=True)
        return Response(serializer.data)


class WeeklyActivitySummaryByUsername(APIView):
    def get(self, request, username):
        try:
            user = UserInfo.objects.get(username=username)
        except UserInfo.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        year = int(request.GET.get("year"))
        week = int(request.GET.get("week"))

        first_day = datetime.datetime.strptime(f"{year}-W{week}-1", "%Y-W%W-%w").date()
        last_day = first_day + datetime.timedelta(days=6)

        data = Activity.objects.filter(
            user=user, ActivityDate__range=[first_day, last_day]
        ).aggregate(
            TotalSteps=Sum("TotalSteps"),
            TotalDistance=Sum("TotalDistance"),
            Calories=Sum("Calories"),
        )

        return Response(
            {
                "username": username,
                "year": year,
                "week": week,
                "TotalSteps": data["TotalSteps"] or 0,
                "TotalDistance": data["TotalDistance"] or 0,
                "Calories": data["Calories"] or 0,
            }
        )


class MonthlyActivitySummaryByUsername(APIView):
    def get(self, request, username):
        try:
            user = UserInfo.objects.get(username=username)
        except UserInfo.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        year = int(request.GET.get("year"))
        month = int(request.GET.get("month"))

        data = Activity.objects.filter(
            user=user, ActivityDate__year=year, ActivityDate__month=month
        ).aggregate(
            TotalSteps=Sum("TotalSteps"),
            TotalDistance=Sum("TotalDistance"),
            Calories=Sum("Calories"),
        )

        return Response(
            {
                "username": username,
                "year": year,
                "month": month,
                "TotalSteps": data["TotalSteps"] or 0,
                "TotalDistance": data["TotalDistance"] or 0,
                "Calories": data["Calories"] or 0,
            }
        )


class DailyCaloriesView(APIView):
    def get(self, request, username):
        try:
            user = UserInfo.objects.get(username=username)
        except UserInfo.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        activities = Activity.objects.filter(user=user).order_by("ActivityDate")
        result = [{"date": a.ActivityDate, "Calories": a.Calories} for a in activities]
        return Response(result)


class WeeklyCaloriesView(APIView):
    def get(self, request, username):
        try:
            user = UserInfo.objects.get(username=username)
        except UserInfo.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        year = int(request.GET.get("year"))
        week = int(request.GET.get("week"))

        first_day = datetime.datetime.strptime(f"{year}-W{week}-1", "%Y-W%W-%w").date()
        last_day = first_day + datetime.timedelta(days=6)

        activities = Activity.objects.filter(
            user=user, ActivityDate__range=[first_day, last_day]
        ).order_by("ActivityDate")

        calories_per_day = []
        for i in range(7):
            day = first_day + datetime.timedelta(days=i)
            day_activity = next((a for a in activities if a.ActivityDate == day), None)
            calories_per_day.append(
                {"date": day, "Calories": day_activity.Calories if day_activity else 0}
            )

        return Response(
            {
                "username": username,
                "year": year,
                "week": week,
                "daily_calories": calories_per_day,
            }
        )
