from rest_framework.serializers import (
    CharField,
    IntegerField,
    ModelSerializer,
    Serializer,
)

from stock.models import Footballer, FootballerWeeksData


class FootballerSerializer(ModelSerializer):

    class Meta:
        model = Footballer
        fields = ('name',)


class MarketFootballerSerializer(ModelSerializer):
    footballer = FootballerSerializer()

    class Meta:
        model = FootballerWeeksData
        fields = ('footballer', 'buy_price', 'sell_price',)


class BuyAndSellSerializer(Serializer):
    footballer = CharField()
    tokens = IntegerField()
