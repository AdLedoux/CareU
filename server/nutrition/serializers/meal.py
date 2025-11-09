from rest_framework import serializers
from nutrition.models.meal import Meal, MealItem
from nutrition.models.food import Food
from nutrition.serializers.food import FoodSerializer


class MealItemWriteSerializer(serializers.ModelSerializer):
    food_id = serializers.PrimaryKeyRelatedField(source="food", queryset=Food.objects.all(), write_only=True)

    class Meta:
        model = MealItem
        fields = ["food_id", "quantity_g"]


class MealItemReadSerializer(serializers.ModelSerializer):
    food = FoodSerializer()
    calories = serializers.FloatField(read_only=True)

    class Meta:
        model = MealItem
        fields = ["id", "food", "quantity_g", "calories"]


class MealSerializer(serializers.ModelSerializer):
    items = MealItemReadSerializer(many=True, read_only=True)

    class Meta:
        model = Meal
        fields = ["id", "date", "name", "items"]


class MealUpsertSerializer(serializers.Serializer):
    date = serializers.DateField()
    name = serializers.CharField(max_length=32)
    items = MealItemWriteSerializer(many=True)

    def create(self, validated_data):
        user = self.context["request"].user
        items_data = validated_data.pop("items", [])
        meal, _ = Meal.objects.get_or_create(user=user, **validated_data)
        meal.items.all().delete()
        for item in items_data:
            MealItem.objects.create(
                meal=meal,
                food=item["food"],
                quantity_g=item["quantity_g"],
            )
        return meal