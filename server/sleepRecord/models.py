from django.db import models
from userInfo.models import UserInfo

class SleepRecord(models.Model):
    user = models.ForeignKey(
        UserInfo,
        to_field="user_id",  # 关联 UserInfo 的 user_id
        on_delete=models.CASCADE,
        db_column="user_id",
    )
    SleepDay = models.DateTimeField()
    TotalSleepRecords = models.PositiveIntegerField()
    TotalMinutesAsleep = models.PositiveIntegerField()
    TotalTimeInBed = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.user.user_id} - {self.SleepDay.date()} ({self.TotalMinutesAsleep} min asleep)"
