from datetime import datetime
from typing import Any, Dict

from django.utils.dateparse import parse_date
from rest_framework import serializers

from .models import SleepLog


class SleepLogSerializer(serializers.ModelSerializer):
    hours_slept = serializers.DecimalField(
        max_digits=4,
        decimal_places=2,
        required=False,
        allow_null=True,
        help_text="Number of hours slept, used for manual entries.",
    )

    class Meta:
        model = SleepLog
        fields = [
            "id",
            "sleep_day",
            "total_sleep_records",
            "total_minutes_asleep",
            "total_time_in_bed",
            "reported_hours",
            "hours_slept",
            "was_interrupted",
            "interruptions",
            "interruption_minutes",
            "notes",
            "source",
            "device_user_id",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["source", "reported_hours", "device_user_id", "created_at", "updated_at"]
        extra_kwargs = {
            "total_minutes_asleep": {"required": False},
            "total_time_in_bed": {"required": False},
            "total_sleep_records": {"required": False},
            "interruptions": {"required": False},
            "interruption_minutes": {"required": False},
        }

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        hours = attrs.get("hours_slept")
        total_minutes = attrs.get("total_minutes_asleep")
        if hours is None and total_minutes is None:
            raise serializers.ValidationError("Provide either hours_slept or total_minutes_asleep.")
        attrs.setdefault("total_sleep_records", 1)
        attrs.setdefault("interruptions", 0)
        attrs.setdefault("interruption_minutes", 0)
        return attrs

    def create(self, validated_data: Dict[str, Any]) -> SleepLog:
        hours = validated_data.pop("hours_slept", None)
        # prefer explicit user passed via serializer.save(user=...), else request user
        user = validated_data.pop("user", None) or self.context["request"].user
        # Convert manual hour input to minutes and tag the source
        if hours is not None:
            minutes = int(round(float(hours) * 60))
            validated_data["total_minutes_asleep"] = validated_data.get("total_minutes_asleep", minutes)
            validated_data["total_time_in_bed"] = validated_data.get(
                "total_time_in_bed", minutes + validated_data.get("interruption_minutes", 0)
            )
            validated_data["reported_hours"] = hours
            validated_data["source"] = SleepLog.SOURCE_MANUAL
        else:
            validated_data["source"] = validated_data.get("source", SleepLog.SOURCE_MANUAL)

        return SleepLog.objects.create(user=user, **validated_data)


class SleepImportSerializer(serializers.Serializer):
    Id = serializers.IntegerField(required=False, allow_null=True)
    SleepDay = serializers.CharField()
    TotalSleepRecords = serializers.IntegerField()
    TotalMinutesAsleep = serializers.IntegerField()
    TotalTimeInBed = serializers.IntegerField()

    def validate_SleepDay(self, value: str) -> str:
        # Example format: "4/12/2016 12:00:00 AM"
        try:
            datetime.strptime(value, "%m/%d/%Y %I:%M:%S %p")
        except ValueError as exc:
            raise serializers.ValidationError("SleepDay must match M/D/YYYY HH:MM:SS AM/PM") from exc
        return value

    def create(self, validated_data: Dict[str, Any]) -> SleepLog:
        sleep_day_str = validated_data["SleepDay"]
        day = datetime.strptime(sleep_day_str, "%m/%d/%Y %I:%M:%S %p").date()
        user = self.context["request"].user
        defaults = {
            "total_sleep_records": validated_data["TotalSleepRecords"],
            "total_minutes_asleep": validated_data["TotalMinutesAsleep"],
            "total_time_in_bed": validated_data["TotalTimeInBed"],
            "device_user_id": validated_data.get("Id"),
            "source": SleepLog.SOURCE_DEVICE,
        }
        obj, _ = SleepLog.objects.update_or_create(
            user=user, sleep_day=day, source=SleepLog.SOURCE_DEVICE, defaults=defaults
        )
        return obj


class SleepSummarySerializer(serializers.Serializer):
    average_minutes_asleep = serializers.FloatField()
    average_hours_asleep = serializers.FloatField()
    days_tracked = serializers.IntegerField()
    interrupted_days = serializers.IntegerField()
    interruption_rate = serializers.FloatField()
    longest_sleep_minutes = serializers.IntegerField()
    timeseries = serializers.ListField()
