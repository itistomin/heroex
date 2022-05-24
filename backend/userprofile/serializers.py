from rest_framework.serializers import ModelSerializer

from authentication.models import User
from stock.models import GameWeek


class CreateUserSerializer(ModelSerializer):
    
    class Meta:
        model = User
        fields = ('email', 'password',)


class GameWeekSerializer(ModelSerializer):

    class Meta:
        model = GameWeek
        fields = ('number',)


class UserSerializer(ModelSerializer):
    week = GameWeekSerializer()

    class Meta:
        model = User
        fields = ('email', 'username', 'balance', 'week',)
