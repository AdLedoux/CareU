from django.db import models
import uuid

class UserInfo(models.Model):
    user_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    username = models.CharField(max_length=100, unique=True)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    height = models.IntegerField()
    weight = models.IntegerField()

    def __str__(self):
        return self.username
