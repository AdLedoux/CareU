from django.contrib import admin
from django.urls import include, path
from api.views import CreateUserView, LogoutView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path("admin/", admin.site.urls),
    
    # authentication endpoints
    path("user/register/", CreateUserView.as_view(), name="register"),
    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("token/logout/", LogoutView.as_view(), name="logout"),
    
    # user info endpoints
    path("userInfo/", include("userInfo.urls")),
    path("activity/", include("activity.urls")),
]




