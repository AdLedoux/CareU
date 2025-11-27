from django.urls import path
from nutrition.views.foods import FoodListCreateView
from nutrition.views.meals import MealsByDateView, MealSaveView, SummaryView, MealsDetailView

urlpatterns = [
    path("foods/", FoodListCreateView.as_view(), name="nutrition-foods"),
    path("meals/", MealsByDateView.as_view(), name="nutrition-meals-by-date"),
    path("meals/save/", MealSaveView.as_view(), name="nutrition-meal-save"),
    path("summary/", SummaryView.as_view(), name="nutrition-summary"),
    path('meals/<int:pk>/', MealsDetailView.as_view(), name='nutrition-meal-detail'),
]
