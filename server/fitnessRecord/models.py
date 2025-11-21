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
    # store when the record was created and simple duration/activity
    # allow null for existing rows so migrations can run; new records will auto-fill
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    activity_type = models.CharField(max_length=100, default="")
    duration_minutes = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.user_id} - {self.created_at.strftime('%Y-%m-%d %H:%M')} - {self.activity_type} {self.duration_minutes}m"
