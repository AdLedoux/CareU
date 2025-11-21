from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Mood
from .serializers import MoodSerializer
from userInfo.models import UserInfo


class MoodListView(generics.ListAPIView):
    serializer_class = MoodSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        # try path kwarg first (moods/<uuid:user_id>/), then fallback to query param ?Id=
        user_id = self.kwargs.get("user_id") or self.request.query_params.get("Id")
        if user_id:
            return Mood.objects.filter(user__user_id=user_id).order_by("-timestamp")
        return Mood.objects.all().order_by("-timestamp")


class MoodCreateView(generics.CreateAPIView):
    serializer_class = MoodSerializer
    permission_classes = [AllowAny]
    queryset = Mood.objects.all()

    def create(self, request, *args, **kwargs):
        # Expect payload to include 'Id' (UserInfo.user_id UUID string), 'mood_tag', 'mood_cause'
        user_id = request.data.get("Id")
        mood_tag = request.data.get("mood_tag")
        mood_cause = request.data.get("mood_cause")

        if not user_id:
            return Response({"detail": "Id (user_id) is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = UserInfo.objects.get(user_id=user_id)
        except UserInfo.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if not mood_tag:
            return Response({"detail": "mood_tag is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Create Mood record
        mood = Mood.objects.create(user=user, mood_tag=mood_tag, mood_cause=(mood_cause or ""))
        serializer = self.get_serializer(mood)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
