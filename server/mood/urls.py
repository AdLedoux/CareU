from django.urls import path
from .views import MoodListView, MoodCreateView

urlpatterns = [
    path("moods/", MoodListView.as_view(), name="mood-list"),
    path("moods/", MoodCreateView.as_view(), name="mood-create"),
]
