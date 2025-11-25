from django.urls import path
from .views import AIChat, AIWeight, AIMood

urlpatterns = [
    path("chat/", AIChat.as_view()),
    path("weight/", AIWeight.as_view()),
    path("mood/", AIMood.as_view()),
    path("fitness/", AIMood.as_view())
]
