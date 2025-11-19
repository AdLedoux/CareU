from django.db import models
from userInfo.models import UserInfo


# Create your models here.
class Activity(models.Model):
    Id = models.BigIntegerField(primary_key=True)
    ActivityDate = models.DateField()
    TotalSteps = models.PositiveIntegerField()
    TotalDistance = models.FloatField()
    Calories = models.PositiveIntegerField()

    def __str__(self):
        return self.user


# sample data
# {
#     "Id":1503960366,
#     "ActivityDate":"4\/12\/2016",
#     "TotalSteps":13162,
#     "TotalDistance":8.5,
#     "TrackerDistance":8.5,
#     "LoggedActivitiesDistance":0.0,
#     "VeryActiveDistance":1.8799999952,
#     "ModeratelyActiveDistance":0.5500000119,
#     "LightActiveDistance":6.0599999428,
#     "SedentaryActiveDistance":0.0,
#     "VeryActiveMinutes":25,
#     "FairlyActiveMinutes":13,
#     "LightlyActiveMinutes":328,
#     "SedentaryMinutes":728,
#     "Calories":1985
#   },
