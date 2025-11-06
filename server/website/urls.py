
from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    # main entreance to api app
    path('api/', include('api.urls')),
    path("api-auth/", include("rest_framework.urls")),
]



