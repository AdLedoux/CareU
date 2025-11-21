from django.urls import path
from .views import FitnessRecordListByUser, FitnessRecordCreateView

urlpatterns = [
    path("<uuid:user_id>/", FitnessRecordListByUser.as_view(), name="fitness-list-by-user"),
    path("", FitnessRecordListByUser.as_view(), name="fitness-list"),
    path("add/", FitnessRecordCreateView.as_view(), name="fitness-add"),
]
