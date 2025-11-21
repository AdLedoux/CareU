from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Mood
from .serializers import MoodSerializer

class MoodListView(generics.ListAPIView):
    serializer_class = MoodSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.request.query_params.get("Id")
        if user_id:
            return Mood.objects.filter(user__user_id=user_id).order_by("-timestamp")
        return Mood.objects.all().order_by("-timestamp")


class MoodCreateView(generics.CreateAPIView):
    serializer_class = MoodSerializer
    permission_classes = [AllowAny]
    queryset = Mood.objects.all()
