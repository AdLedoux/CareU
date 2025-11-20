from django.urls import path
from .views import SleepRecordListById, SleepRecordCreateView

urlpatterns = [
    path("sleep/<int:id>/", SleepRecordListById.as_view(), name="sleep-by-id"),
    path("sleep/create/", SleepRecordCreateView.as_view(), name="sleep-create"),
]
