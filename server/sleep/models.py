from django.conf import settings
from django.db import models


class SleepLog(models.Model):
    SOURCE_DEVICE = "device"
    SOURCE_MANUAL = "manual"
    SOURCE_CHOICES = (
        (SOURCE_DEVICE, "Device"),
        (SOURCE_MANUAL, "Manual"),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sleep_logs")
    device_user_id = models.BigIntegerField(null=True, blank=True)
    sleep_day = models.DateField()
    total_sleep_records = models.PositiveSmallIntegerField(default=1)
    total_minutes_asleep = models.PositiveIntegerField()
    total_time_in_bed = models.PositiveIntegerField()
    reported_hours = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    was_interrupted = models.BooleanField(default=False)
    interruptions = models.PositiveSmallIntegerField(default=0)
    interruption_minutes = models.PositiveIntegerField(default=0)
    notes = models.CharField(max_length=255, blank=True)
    source = models.CharField(max_length=10, choices=SOURCE_CHOICES, default=SOURCE_DEVICE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "sleep_day", "source")
        ordering = ["-sleep_day", "-created_at"]

    def __str__(self) -> str:
        return f"{self.user} - {self.sleep_day} ({self.source})"
