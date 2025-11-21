from rest_framework import serializers
from .models import FitnessRecord

class FitnessRecordSerializer(serializers.ModelSerializer):
    Id = serializers.UUIDField(source='user.user_id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = FitnessRecord
        fields = ['Id', 'username', 'user', 'ActivityHour', 'StepTotal']
        extra_kwargs = {'user': {'write_only': True}}

    def create(self, validated_data):
        user = validated_data['user']
        activity_hour = validated_data['ActivityHour']

        record, created = FitnessRecord.objects.update_or_create(
            user=user,
            ActivityHour=activity_hour,
            defaults={'StepTotal': validated_data['StepTotal']}
        )
        return record
