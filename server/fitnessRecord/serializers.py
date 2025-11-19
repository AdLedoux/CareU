from rest_framework import serializers
from .models import FitnessRecord

class FitnessRecordSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = FitnessRecord
        fields = ['id', 'username', 'user', 'ActivityHour', 'StepTotal']
        extra_kwargs = {
            'user': {'write_only': True}
        }

    def create(self, validated_data):
        user = validated_data['user']
        activity_hour = validated_data['ActivityHour']

        record, created = FitnessRecord.objects.update_or_create(
            user=user,
            ActivityHour=activity_hour,
            defaults={'StepTotal': validated_data['StepTotal']}
        )
        return record

from rest_framework import serializers
from .models import FitnessRecord


class FitnessRecordSerializer(serializers.ModelSerializer):
    Id = serializers.CharField(source='user.user_id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = FitnessRecord
        fields = [
            'Id',
            'username',
            'user',
            'created_at',
            'activity_type',
            'duration_minutes',
        ]
        extra_kwargs = {'user': {'write_only': True}}

    def create(self, validated_data):
        user = validated_data.get('user')
        record = FitnessRecord.objects.create(
            user=user,
            activity_type=validated_data.get('activity_type', ""),
            duration_minutes=validated_data.get('duration_minutes', 0),
        )
        return record
