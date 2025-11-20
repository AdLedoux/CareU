from django.db import models

class SleepRecord(models.Model):
    Id = models.BigIntegerField()

    SleepDay = models.DateTimeField()
    TotalSleepRecords = models.PositiveIntegerField()
    TotalMinutesAsleep = models.PositiveIntegerField()
    TotalTimeInBed = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.Id} - {self.SleepDay.date()} ({self.TotalMinutesAsleep} min asleep)"

# e.g.
#   {
#     "Id": 1503960366,
#     "SleepDay": "4/12/2016 12:00:00 AM",
#     "TotalSleepRecords": 1,
#     "TotalMinutesAsleep": 327,
#     "TotalTimeInBed": 346
#   },