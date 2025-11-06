# userInfo/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import UserInfo
from .serializers import UserInfoSerializer

class UserInfoView(generics.GenericAPIView):
    serializer_class = UserInfoSerializer
    permission_classes = [AllowAny]

    def get(self, request):
        username = request.query_params.get("username")
        if not username:
            return Response({"error": "username is required"}, status=400)

        try:
            user_info = UserInfo.objects.get(username=username)
        except UserInfo.DoesNotExist:
            return Response({"error": "User info not found"}, status=404)

        serializer = self.get_serializer(user_info)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            return Response(self.get_serializer(instance).data, status=201)
        return Response(serializer.errors, status=400)
