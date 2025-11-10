from django.db import models
from userInfo.models import UserInfo

# Create your models here.
class HourlyCalories(models.Model):
    user = models.ForeignKey(UserInfo, on_delete=models.CASCADE, related_name="hourly_calories")
    ActivityHour = models.DateTimeField()
    Calories = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.user.username} - {self.Calories} cal at {self.ActivityHour}"
    
#     e.g.
#       {
#     "Id":1503960366,
#     "ActivityHour":"3\/12\/2016 12:00:00 AM",
#     "Calories":48
#   },