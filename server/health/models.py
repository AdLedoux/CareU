from django.db import models
from django.contrib.auth.models import User

class Glucose(models.Model):
    """Model for glucose entries."""

    user = models.ForeignKey(User, on_delete=models.CASCADE)    # User associated
    gvalue = models.FloatField()                                # Glucose value
    timestamp = models.DateTimeField(auto_now_add=True)         # Timestamp of the entry

    def __str__(self):
        return f"Glucose {self.gvalue} for {self.user.username} at {self.timestamp}"
    
class Medication(models.Model):
    """Model for medication entries."""

    user = models.ForeignKey(User, on_delete=models.CASCADE)    # User associated
    mname = models.CharField(max_length=100)                    # Medication name
    mdosage = models.CharField(max_length=50)                   # Dosage information
    timestamp = models.DateTimeField(auto_now_add=True)         # Timestamp of the entry

    def __str__(self):
        return f"Medication {self.mname} ({self.mdosage}) for {self.user.username} at {self.timestamp}"


class DoctorNote(models.Model):
    """Model for doctor notes."""

    user = models.ForeignKey(User, on_delete=models.CASCADE)    # User associated
    dnote_path = models.TextField(max_length=100)                             # Doctor's note path
    timestamp = models.DateTimeField(auto_now_add=True)         # Timestamp of the entry

    def __str__(self):
        return f"Doctor Note for {self.user.username} at {self.timestamp}"