from django.db import models
from userInfo.models import UserInfo

class FitnessRecord(models.Model):
    user = models.ForeignKey(
        UserInfo,
        to_field="user_id",
        on_delete=models.CASCADE,
        related_name="fitness_records",
        db_column="user_id",
    )
    ActivityHour = models.DateTimeField()
    StepTotal = models.IntegerField()

    def __str__(self):
        return f"{self.user.user_id} - {self.ActivityHour.strftime('%Y-%m-%d %H:%M')} - {self.StepTotal} steps"
