from django.urls import path
from .views import AITest

urlpatterns = [
    path("test/", AITest.as_view()),
]
