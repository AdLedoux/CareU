from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import UserInfo
from .serializers import UserInfoSerializer
from uuid import UUID, uuid4

class UserInfoView(generics.GenericAPIView):
    serializer_class = UserInfoSerializer
    permission_classes = [AllowAny]

    def get(self, request):
        user_id = request.query_params.get("user_id")
        username = request.query_params.get("username")

        if user_id:
            try:
                user_uuid = UUID(user_id, version=4)
                user_info = UserInfo.objects.get(user_id=user_uuid)
            except ValueError:
                return Response({"error": "Invalid user_id format"}, status=400)
            except UserInfo.DoesNotExist:
                return Response({"error": "User info not found"}, status=404)

        elif username:
            try:
                user_info = UserInfo.objects.get(username=username)
            except UserInfo.DoesNotExist:
                return Response({"error": "User info not found"}, status=404)
        else:
            return Response({"error": "user_id or username is required"}, status=400)

        serializer = self.get_serializer(user_info)
        return Response(serializer.data, status=200)

    def post(self, request):
        data = request.data.copy()
        if not data.get("user_id"):
            data["user_id"] = str(uuid4())

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            instance = serializer.save()
            return Response(self.get_serializer(instance).data, status=201)
        return Response(serializer.errors, status=400)
