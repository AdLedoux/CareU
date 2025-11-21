from django.db import models
from userInfo.models import UserInfo

class Activity(models.Model):
    user = models.ForeignKey(
        UserInfo,
        to_field="user_id",
        on_delete=models.CASCADE,
        db_column="user_id",
    )
    ActivityDate = models.DateField()
    TotalSteps = models.PositiveIntegerField()
    TotalDistance = models.FloatField()
    Calories = models.PositiveIntegerField()

    def __str__(self):
        return str(self.user.user_id)
