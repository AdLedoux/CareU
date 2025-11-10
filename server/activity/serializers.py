from rest_framework import serializers
from .models import Activity


class ActivitySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Activity
        fields = [
            "id",
            "username",
            "user",
            "ActivityDate",
            "TotalSteps",
            "TotalDistance",
            "Calories",
        ]
        extra_kwargs = {"user": {"write_only": True}}

    def create(self, validated_data):
        user = validated_data["user"]
        activity_date = validated_data["ActivityDate"]

        activity, created = Activity.objects.update_or_create(
            user=user,
            ActivityDate=activity_date,
            defaults={
                "TotalSteps": validated_data["TotalSteps"],
                "TotalDistance": validated_data["TotalDistance"],
                "Calories": validated_data["Calories"],
            },
        )
        return activity
