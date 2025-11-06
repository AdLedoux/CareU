from rest_framework import serializers
from .models import UserInfo

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ["username", "age", "gender", "height", "weight"]

    def create(self, validated_data):
        username = validated_data.get("username")

        user_info, created = UserInfo.objects.update_or_create(
            username=username, defaults=validated_data
        )
        return user_info
