from rest_framework import serializers
from .models import HeartRate


class HeartRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeartRate
        fields = ["id", "Id", "Time", "Value"]
