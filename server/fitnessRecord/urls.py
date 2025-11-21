from django.urls import path
from .views import FitnessRecordListByUser, FitnessRecordCreateView

urlpatterns = [
    path("fitness/<uuid:user_id>/", FitnessRecordListByUser.as_view(), name="fitness-list"),
    path("fitness/add/", FitnessRecordCreateView.as_view(), name="fitness-add"),
]
