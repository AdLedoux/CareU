from django.db import models
from django.conf import settings
from .food import Food


class Meal(models.Model):
    MEAL_CHOICES = [
        ("Breakfast", "Breakfast"),
        ("Lunch", "Lunch"),
        ("Dinner", "Dinner"),
        ("Snack", "Snack"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField()
    name = models.CharField(max_length=32, choices=MEAL_CHOICES, default="Breakfast")

    class Meta:
        unique_together = ("user", "date", "name")
        ordering = ["-date", "name"]

    def __str__(self) -> str:  # pragma: no cover
        return f"{self.user} {self.date} {self.name}"


class MealItem(models.Model):
    meal = models.ForeignKey(Meal, related_name="items", on_delete=models.CASCADE)
    food = models.ForeignKey(Food, on_delete=models.PROTECT)
    quantity_g = models.FloatField(help_text="quantity in grams")

    def __str__(self) -> str:  # pragma: no cover
        return f"{self.food} {self.quantity_g}g"

    @property
    def calories(self) -> float:
        return (self.food.calories or 0) * (self.quantity_g / 100.0)

    @property
    def protein_g_total(self) -> float:
        return (self.food.protein_g or 0) * (self.quantity_g / 100.0)

    @property
    def carbs_g_total(self) -> float:
        return (self.food.carbs_g or 0) * (self.quantity_g / 100.0)

    @property
    def fat_g_total(self) -> float:
        return (self.food.fat_g or 0) * (self.quantity_g / 100.0)