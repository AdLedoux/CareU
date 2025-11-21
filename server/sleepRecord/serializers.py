from rest_framework import serializers
from .models import SleepRecord

class SleepRecordSerializer(serializers.ModelSerializer):
    Id = serializers.UUIDField(source="user.user_id", read_only=True)

    class Meta:
        model = SleepRecord
        fields = [
            "Id",
            "SleepDay",
            "TotalSleepRecords",
            "TotalMinutesAsleep",
            "TotalTimeInBed"
        ]

    def create(self, validated_data):
        sleep_day = validated_data['SleepDay']
        user = validated_data['user']

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
