from rest_framework.serializers import ModelSerializer

from authentication.models import User, UserFootballer
from stock.models import GameWeek
from stock.serializers import FootballerSerializer



class CreateUserSerializer(ModelSerializer):
    
    class Meta:
        model = User
        fields = ('email', 'password',)


class GameWeekSerializer(ModelSerializer):

    class Meta:
        model = GameWeek
        fields = ('number',)


class UserFootballerSerializer(ModelSerializer):
    footballer = FootballerSerializer()

    class Meta:
        model = UserFootballer
        fields = ('footballer',  'amount')


class UserSerializer(ModelSerializer):
    footballers = UserFootballerSerializer(source='userfootballer_set', many=True)
    week = GameWeekSerializer()

    class Meta:
        model = User
        fields = ('email', 'username', 'balance', 'week', 'footballers', 'reward')
