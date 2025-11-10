from rest_framework import serializers
from .models import SleepRecord

class SleepRecordSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = SleepRecord
        fields = [
            'id',
            'username',
            'user',
            'SleepDay',
            'TotalSleepRecords',
            'TotalMinutesAsleep',
            'TotalTimeInBed'
        ]
        extra_kwargs = {
            'user': {'write_only': True} 
        }

    def create(self, validated_data):
        user = validated_data['user']
        sleep_day = validated_data['SleepDay']

        record, created = SleepRecord.objects.update_or_create(
            user=user,
            SleepDay=sleep_day,
            defaults={
                'TotalSleepRecords': validated_data['TotalSleepRecords'],
                'TotalMinutesAsleep': validated_data['TotalMinutesAsleep'],
                'TotalTimeInBed': validated_data['TotalTimeInBed']
            }
        )
        return record
