from django.db import models

class HeartRate(models.Model):
    Id = models.BigIntegerField()
    Time = models.DateTimeField()
    Value = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.Id} - {self.Value} bpm at {self.Time}"


#     e.g.
#       {
#     "Id":2022484408,
#     "Time":"4\/1\/2016 7:54:00 AM",
#     "Value":93
#   },
