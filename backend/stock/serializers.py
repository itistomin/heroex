from rest_framework.serializers import (
    CharField,
    IntegerField,
    ModelSerializer,
    Serializer,
)

from stock.models import (
    Footballer, 
    FootballerPosition, 
    FootballerTeam,
    FootballerWeeksData, 
)


class TeamSerializer(ModelSerializer):
    
    class Meta:
        model = FootballerTeam
        fields = ('name',)


class PositionSerializer(ModelSerializer):
    
    class Meta:
        model = FootballerPosition
        fields = ('name',)


class FootballerSerializer(ModelSerializer):
    team = TeamSerializer()
    position = PositionSerializer()

    class Meta:
        model = Footballer
        fields = ('name', 'team', 'position', 'price_dynamic',)


class MarketFootballerSerializer(ModelSerializer):
    footballer = FootballerSerializer()

    class Meta:
        model = FootballerWeeksData
        fields = ('footballer', 'buy_price', 'sell_price',)


class BuyAndSellSerializer(Serializer):
    footballer = CharField()
    tokens = IntegerField()
