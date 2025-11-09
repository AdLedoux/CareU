from rest_framework import generics, permissions
from nutrition.models.food import Food
from nutrition.serializers.food import FoodSerializer


class FoodListCreateView(generics.ListCreateAPIView):
    serializer_class = FoodSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Food.objects.all()
        q = self.request.query_params.get("search")
        if q:
            qs = qs.filter(name__icontains=q)
        return qs.order_by("name")