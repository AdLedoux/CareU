from django.urls import path
<<<<<<< HEAD
from .views import AIChat, AIWeight, AIMood

urlpatterns = [
    path("chat/", AIChat.as_view()),
    path("weight/", AIWeight.as_view()),
    path("mood/", AIMood.as_view()),
    path("fitness/", AIMood.as_view())
=======
from .views import AITest

urlpatterns = [
    path("test/", AITest.as_view()),
>>>>>>> 106df68 (gemini ai agent intiial setup)
]
