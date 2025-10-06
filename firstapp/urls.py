from django.contrib import admin
from django.urls import path
from firstapp import views

urlpatterns = [

    path("login/", views.login_view, name="login"),
    path("success/", views.success_view, name="success"),
]




