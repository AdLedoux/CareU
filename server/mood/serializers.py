from rest_framework import serializers
from .models import Mood

class MoodSerializer(serializers.ModelSerializer):
    Id = serializers.UUIDField(source="user.user_id", read_only=True)

    class Meta:
        model = Mood
        fields = ["Id", "mood_tag", "mood_cause", "timestamp"]
