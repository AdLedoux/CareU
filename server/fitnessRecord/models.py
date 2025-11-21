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
    TotalIntensity = models.IntegerField(default=0)
    AverageIntensity = models.FloatField(default=0.0)

    def __str__(self):
        return f"{self.user.user_id} - {self.ActivityHour.strftime('%Y-%m-%d %H:%M')} - Total:{self.TotalIntensity}, Avg:{self.AverageIntensity}"
