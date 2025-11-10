from django.db import models
from userInfo.models import UserInfo

# Create your models here.
class FitnessRecord(models.Model):
    user = models.ForeignKey(UserInfo, on_delete=models.CASCADE, related_name="fitness_records")
    ActivityHour = models.DateTimeField()
    StepTotal = models.IntegerField()

    def __str__(self):
        return f"{self.user.username} - {self.ActivityHour.strftime('%Y-%m-%d %H:%M')} - {self.StepTotal} steps"
    
#     e.g.
#       {
#     "Id":1503960366,
#     "ActivityHour":"3\/12\/2016 12:00:00 AM",
#     "StepTotal":0
#   },