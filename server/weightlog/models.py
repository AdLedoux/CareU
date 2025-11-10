from django.db import models
from userInfo.models import UserInfo

# Create your models here.
class WeightLog(models.Model):
    user = models.ForeignKey(UserInfo, on_delete=models.CASCADE, related_name="weight_logs")
    Date = models.DateTimeField()
    WeightKg = models.FloatField()
    WeightPounds = models.FloatField()
    Fat = models.FloatField(null=True, blank=True)
    BMI = models.FloatField(null=True, blank=True)
    LogId = models.BigIntegerField(unique=True)

    def __str__(self):
        return f"{self.user.username} - {self.WeightKg} kg ({self.Date.date()})"
    
#     e.g.
#       {
#     "Id": 1503960366,
#     "Date": "4/5/2016 11:59:59 PM",
#     "WeightKg": 53.2999992370605,
#     "WeightPounds": 117.506384062611,
#     "Fat": 22,
#     "BMI": 22.9699993133545,
#     "IsManualReport": "True",
#     "LogId": 1459900799000
#   },