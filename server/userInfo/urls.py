from django.urls import path
from .views import UserInfoView

urlpatterns = [
    path('profile/', UserInfoView.as_view(), name='user-basic-info-create'),
]
