from django.urls import path
from .views import (
    ActivityByUsernameView,
    WeeklyActivitySummaryByUsername,
    MonthlyActivitySummaryByUsername,
    DailyCaloriesView,
    WeeklyCaloriesView,
)

urlpatterns = [
    path("user/<str:username>/activity/", ActivityByUsernameView.as_view()),
    path("user/<str:username>/activity/weekly/", WeeklyActivitySummaryByUsername.as_view()),
    path("user/<str:username>/activity/monthly/", MonthlyActivitySummaryByUsername.as_view()),
    path("user/<str:username>/calories/daily/", DailyCaloriesView.as_view()),
    path("user/<str:username>/calories/weekly/", WeeklyCaloriesView.as_view()),
]
