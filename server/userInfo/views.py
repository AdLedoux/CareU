# userInfo/views.py
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import UserInfo
from .serializers import UserInfoSerializer
from uuid import UUID


class UserInfoView(generics.GenericAPIView):
    serializer_class = UserInfoSerializer
    permission_classes = [AllowAny]

    def get(self, request):
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response({"error": "user_id is required"}, status=400)

        try:
            user_uuid = UUID(user_id, version=4)
            user_info = UserInfo.objects.get(user_id=user_uuid)
        except ValueError:
            return Response({"error": "Invalid user_id format"}, status=400)
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
