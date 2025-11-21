from django.db import models

class Mood(models.Model):
    Id = models.BigIntegerField()
    mood_tag = models.CharField(max_length=50)
    mood_cause = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.Id} - {self.mood_tag} ({self.mood_cause})"
