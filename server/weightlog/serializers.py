from rest_framework import serializers
from .models import WeightLog


class WeightLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeightLog
        fields = [
            "Id",
            "Date",
            "WeightKg",
            "WeightPounds",
            "Fat",
            "BMI",
        ]
