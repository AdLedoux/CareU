from rest_framework import serializers
from .models import WeightLog

class WeightLogSerializer(serializers.ModelSerializer):
    Id = serializers.UUIDField(source="user.user_id", read_only=True)

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

    def create(self, validated_data):
        user = validated_data['user']
        date = validated_data['Date']

        record, created = WeightLog.objects.update_or_create(
            user=user,
            Date=date,
            defaults={
                "WeightKg": validated_data["WeightKg"],
                "WeightPounds": validated_data["WeightPounds"],
                "Fat": validated_data.get("Fat"),
                "BMI": validated_data.get("BMI"),
            },
        )
        return record
