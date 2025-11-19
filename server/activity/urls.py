from django.urls import path
from .views import (
    DailyActivityByIdView,
    DailyCaloriesByIdView,
)

urlpatterns = [
    path("activity/<int:id>/daily/", DailyActivityByIdView.as_view()),
    path("calories/<int:id>/daily/", DailyCaloriesByIdView.as_view()),
]
