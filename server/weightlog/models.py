from django.db import models
from userInfo.models import UserInfo

class WeightLog(models.Model):
    user = models.ForeignKey(
        UserInfo,
        to_field="user_id",
        on_delete=models.CASCADE,
        db_column="user_id",
    )
    Date = models.DateTimeField()
    WeightKg = models.FloatField()
    WeightPounds = models.FloatField()
    Fat = models.FloatField(null=True, blank=True)
    BMI = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.user_id} - {self.WeightKg} kg ({self.Date.date()})"
