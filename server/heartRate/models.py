from django.db import models

class HeartRate(models.Model):
    user = models.ForeignKey(
        UserInfo,
        to_field="user_id",
        on_delete=models.CASCADE,
        db_column="user_id",
    )
    Time = models.DateTimeField()
    Value = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.user.user_id} - {self.Value} bpm at {self.Time}"
