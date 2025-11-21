from rest_framework import serializers
from .models import HeartRate

class HeartRateSerializer(serializers.ModelSerializer):
    Id = serializers.UUIDField(source="user.user_id", read_only=True)

    class Meta:
        model = HeartRate
        fields = ["Id", "Time", "Value"]
