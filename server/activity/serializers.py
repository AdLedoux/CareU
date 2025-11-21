from rest_framework import serializers
from .models import Activity

class ActivitySerializer(serializers.ModelSerializer):
    Id = serializers.UUIDField(source="user.user_id", read_only=True)

    class Meta:
        model = Activity
        fields = [
            "Id",
            "ActivityDate",
            "TotalSteps",
            "TotalDistance",
            "Calories",
        ]
