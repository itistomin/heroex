from decimal import Decimal
from rest_framework.serializers import (
    CharField,
    DecimalField,
    IntegerField,
    ModelSerializer,
    Serializer,
)

from authentication.models import UserFootballer
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


class TopWeekSerializer(ModelSerializer):
    footballer = FootballerSerializer()

    class Meta:
        model  = FootballerWeeksData
        fields = ('footballer', 'perfomance',)


class PortfolioSerializer(ModelSerializer):
    footballer = FootballerSerializer()
    buy_price = DecimalField(max_digits=10, decimal_places=2)
    sell_price = DecimalField(max_digits=10, decimal_places=2)
    pnl = DecimalField(max_digits=10, decimal_places=2)
    value = DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        model = UserFootballer
        fields = ('footballer', 'amount', 'reward', 'buy_price', 'sell_price',  'cost', 'value', 'pnl', 'trade_price',)
