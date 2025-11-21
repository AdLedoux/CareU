from django.urls import path
from .views import FitnessRecordListByUser, FitnessRecordCreateView

urlpatterns = [
    path("<int:user_id>/", FitnessRecordListByUser.as_view(), name="fitness-list"),  # 改成 int
    path("add/", FitnessRecordCreateView.as_view(), name="fitness-add"),
]
