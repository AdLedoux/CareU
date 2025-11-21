from django.urls import path
from .views import (
    WeightLogListById,
    DailyWeightByIdView,
    WeightLogCreateView,
)

urlpatterns = [
    # Use user_id (UUID) as the key to look up a user's weight logs
    path("weight/<uuid:user_id>/", WeightLogListById.as_view()),
    path("weight/<uuid:user_id>/daily/", DailyWeightByIdView.as_view()),
    path("weight/add/", WeightLogCreateView.as_view()),
]
