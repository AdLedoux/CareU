from rest_framework import generics
from .models import Mood
from .serializers import MoodSerializer

class MoodListView(generics.ListAPIView):
    serializer_class = MoodSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get("Id")
        if user_id:
            return Mood.objects.filter(user__user_id=user_id).order_by("-timestamp")
        return Mood.objects.all().order_by("-timestamp")
