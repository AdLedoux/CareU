from rest_framework import serializers
from .models import SleepRecord

class SleepRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = SleepRecord
        fields = [
            'id',
            'Id',
            'SleepDay',
            'TotalSleepRecords',
            'TotalMinutesAsleep',
            'TotalTimeInBed'
        ]

    def create(self, validated_data):
        sleep_day = validated_data['SleepDay']

        record, created = SleepRecord.objects.update_or_create(
            Id=validated_data['Id'],
            SleepDay=sleep_day,
            defaults={
                'TotalSleepRecords': validated_data['TotalSleepRecords'],
                'TotalMinutesAsleep': validated_data['TotalMinutesAsleep'],
                'TotalTimeInBed': validated_data['TotalTimeInBed']
            }
        )
        return record
