from django.urls import path
from .views import MoodListView, MoodCreateView

urlpatterns = [
    # list by user_id (uuid) - similar to weight endpoints
    path("moods/<uuid:user_id>/", MoodListView.as_view(), name="mood-list-by-user"),
    # fallback: list all or by query param ?Id=
    path("moods/", MoodListView.as_view(), name="mood-list"),
    path("moods/add/", MoodCreateView.as_view(), name="mood-create"),
]
