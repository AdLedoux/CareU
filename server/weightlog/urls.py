from django.urls import path
from .views import (
    WeightLogListById,
    DailyWeightByIdView,
    WeightLogCreateView,
)

urlpatterns = [
    path("weight/<int:id>/", WeightLogListById.as_view()),      
    path("weight/<int:id>/daily/", DailyWeightByIdView.as_view()),  
    path("weight/add/", WeightLogCreateView.as_view()), 
]
