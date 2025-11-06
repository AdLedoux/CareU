from django.urls import path
from .views import UserInfoView

urlpatterns = [
    path('basic/', UserInfoView.as_view(), name='user-basic-info-create'),
]
