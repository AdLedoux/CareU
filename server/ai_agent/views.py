from rest_framework.views import APIView
from rest_framework.response import Response
from .ai_service import simple_test


class AITest(APIView):
    def get(self, request):
        result = simple_test()
        print("get result:", result)
        return Response({"result": result})

    def post(self, request):
        result = simple_test()
        print("post result:", result)
        return Response({"result": result})
