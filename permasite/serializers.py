from rest_framework import serializers
from .models import Vegetable

class VegetableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vegetable
        fields = '__all__'