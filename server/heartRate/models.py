from django.db import models
from userInfo.models import UserInfo

# Create your models here.
class HeartRate(models.Model):
    user = models.ForeignKey(UserInfo, on_delete=models.CASCADE, related_name="heartrates")
    Time = models.DateTimeField()
    Value = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.user.username} - {self.Value} bpm at {self.Time}"
    
    
#     e.g.
#       {
#     "Id":2022484408,
#     "Time":"4\/1\/2016 7:54:00 AM",
#     "Value":93
#   },