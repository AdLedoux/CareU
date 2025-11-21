from rest_framework import serializers
from .models import UserInfo

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ["user_id", "username", "age", "gender", "height", "weight"]
        read_only_fields = ["user_id"]

    def create(self, validated_data):
        username = validated_data.get("username")
        user_info, created = UserInfo.objects.update_or_create(
            username=username, defaults=validated_data
        )
        return user_info
