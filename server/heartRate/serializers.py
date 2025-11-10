from rest_framework import serializers
from .models import HeartRate

class HeartRateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = HeartRate
        fields = ['id', 'username', 'user', 'Time', 'Value']
        extra_kwargs = {
            'user': {'write_only': True}
        }

    def create(self, validated_data):
        user = validated_data['user']
        time = validated_data['Time']

        record, created = HeartRate.objects.update_or_create(
            user=user,
            Time=time,
            defaults={'Value': validated_data['Value']}
        )
        return record
