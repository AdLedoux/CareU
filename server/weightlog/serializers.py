from rest_framework import serializers
from .models import WeightLog


class WeightLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = WeightLog
        fields = [
            "id",
            "username",
            "user",
            "Date",
            "WeightKg",
            "WeightPounds",
            "Fat",
            "BMI",
            "LogId",
        ]
        extra_kwargs = {"user": {"write_only": True}}

    def create(self, validated_data):
        log_id = validated_data["LogId"]

        record, created = WeightLog.objects.update_or_create(
            LogId=log_id,
            defaults={
                "user": validated_data["user"],
                "Date": validated_data["Date"],
                "WeightKg": validated_data["WeightKg"],
                "WeightPounds": validated_data["WeightPounds"],
                "Fat": validated_data.get("Fat"),
                "BMI": validated_data.get("BMI"),
            },
        )
        return record
