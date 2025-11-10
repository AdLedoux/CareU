from rest_framework import serializers
from .models import HourlyCalories

class HourlyCaloriesSerializer(serializers.ModelSerializer):
    # 返回用户名而不是 user id
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = HourlyCalories
        fields = ['id', 'username', 'user', 'ActivityHour', 'Calories']
        extra_kwargs = {
            'user': {'write_only': True}
        }

    def create(self, validated_data):
        user = validated_data['user']
        activity_hour = validated_data['ActivityHour']

        record, created = HourlyCalories.objects.update_or_create(
            user=user,
            ActivityHour=activity_hour,
            defaults={'Calories': validated_data['Calories']}
        )
        return record
