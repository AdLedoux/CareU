from django.db import models
from userInfo.models import UserInfo

class Mood(models.Model):
    user = models.ForeignKey(
        UserInfo,
        to_field="user_id",
        on_delete=models.CASCADE,
        db_column="user_id",
    )
    mood_tag = models.CharField(max_length=50)
    mood_cause = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.user_id} - {self.mood_tag} ({self.mood_cause})"
