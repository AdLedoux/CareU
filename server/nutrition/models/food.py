from django.db import models


class Food(models.Model):
    name = models.CharField(max_length=200)
    calories = models.FloatField(default=0, help_text="kcal per 100g")
    protein_g = models.FloatField(default=0)
    carbs_g = models.FloatField(default=0)
    fat_g = models.FloatField(default=0)
    fiber_g = models.FloatField(default=0)
    sugar_g = models.FloatField(default=0)
    sodium_mg = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:  # pragma: no cover
        return self.name