from django.urls import path
from .views import (
    HeartRateListById,
    HeartRateDailyByIdView,
    HeartRateCreateView,
)

urlpatterns = [
    path("heart/<int:id>/", HeartRateListById.as_view()),
    path("heart/<int:id>/daily/", HeartRateDailyByIdView.as_view()),
    path("heart/add/", HeartRateCreateView.as_view()),
]
