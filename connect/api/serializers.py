from rest_framework import serializers
from mods.models import Mod

class ModSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mod
        fields = '__all__'