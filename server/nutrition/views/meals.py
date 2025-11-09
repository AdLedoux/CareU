from django.utils.dateparse import parse_date
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

from nutrition.models.meal import Meal
from nutrition.serializers.meal import MealSerializer, MealUpsertSerializer


class MealsByDateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        date_str = request.query_params.get("date")
        if not date_str:
            return Response({"detail": "date is required (YYYY-MM-DD)"}, status=status.HTTP_400_BAD_REQUEST)
        date = parse_date(date_str)
        if not date:
            return Response({"detail": "invalid date"}, status=status.HTTP_400_BAD_REQUEST)
        meals = Meal.objects.filter(user=request.user, date=date)
        data = MealSerializer(meals, many=True).data
        return Response(data, status=status.HTTP_200_OK)


class MealSaveView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = MealUpsertSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            meal = serializer.save()
            return Response(MealSerializer(meal).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        date_str = request.query_params.get("date")
        if not date_str:
            return Response({"detail": "date is required (YYYY-MM-DD)"}, status=status.HTTP_400_BAD_REQUEST)
        date = parse_date(date_str)
        if not date:
            return Response({"detail": "invalid date"}, status=status.HTTP_400_BAD_REQUEST)

        meals = Meal.objects.filter(user=request.user, date=date).prefetch_related("items", "items__food")
        totals = {
            "calories": 0.0,
            "protein_g": 0.0,
            "carbs_g": 0.0,
            "fat_g": 0.0,
            "fiber_g": 0.0,
            "sugar_g": 0.0,
            "sodium_mg": 0.0,
        }
        for meal in meals:
            for item in meal.items.all():
                factor = (item.quantity_g or 0) / 100.0
                food = item.food
                totals["calories"] += (food.calories or 0) * factor
                totals["protein_g"] += (food.protein_g or 0) * factor
                totals["carbs_g"] += (food.carbs_g or 0) * factor
                totals["fat_g"] += (food.fat_g or 0) * factor
                totals["fiber_g"] += (food.fiber_g or 0) * factor
                totals["sugar_g"] += (food.sugar_g or 0) * factor
                totals["sodium_mg"] += (food.sodium_mg or 0) * factor

        return Response(totals, status=status.HTTP_200_OK)
class MealsDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk: int):
        try:
            meal = Meal.objects.get(pk=pk, user=request.user)
        except Meal.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        meal.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
