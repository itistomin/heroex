import decimal

from django.db import transaction
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView, Response
from drf_spectacular.utils import extend_schema

from authentication.models import  UserFootballer
from stock.models import (
    FootballerWeeksData,
    GameWeek
)
from stock.serializers import (
    BuyAndSellSerializer,
    MarketFootballerSerializer
)


USER_TOKENS_TAGS = ['User tokens']
STOCK_TAGS = ['Market']
PORTFOLIO_TAGS = ['Portfolio']


@extend_schema(tags=STOCK_TAGS)
class FootballersView(APIView):
    permission_classes = (IsAuthenticated,)
    
    @extend_schema(responses={200: MarketFootballerSerializer})
    def get(self, request):
        week = request.user.week or GameWeek.objects.get(number=0)
        footballers_data = FootballerWeeksData.objects.filter(week=week)
        return Response(MarketFootballerSerializer(footballers_data, many=True).data, 200)


@extend_schema(tags=PORTFOLIO_TAGS)
class UserTokenView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return Response({'detail': 'ok'}, 200)


@extend_schema(tags=USER_TOKENS_TAGS)
class UserTokenBuyView(APIView):
    permission_classes = (IsAuthenticated,)

    @extend_schema(request=BuyAndSellSerializer)
    def post(self, request):
        raw_data = BuyAndSellSerializer(data=request.data)
        if not raw_data.is_valid():
            return Response({'detail': 'Invalid payload'}, 422)
        
        data = raw_data.data
        
        footballer = FootballerWeeksData.objects.filter(
            footballer__name=data['footballer'],
            week=request.user.week or GameWeek.objects.get(number=0),
        ).first()

        if not footballer:
            return Response({'detail': 'This footballer does not exist.'}, 404)
        
        user = request.user
        if footballer.buy_price * data['tokens'] > user.balance or data['tokens'] < 1:
            return Response({'detail': 'Not enough balance'}, 422)
        
        user_footballer, _ = UserFootballer.objects.get_or_create(
            footballer=footballer.footballer, 
            user=user
        )
        user_footballer.amount += data['tokens']
        user.balance -= data['tokens'] * footballer.buy_price

        with transaction.atomic():
            user_footballer.save()
            user.save()

        return Response({'detail': 'ok'}, 201)


@extend_schema(tags=USER_TOKENS_TAGS)
class UserTokenSellView(APIView):
    permission_classes = (IsAuthenticated,)

    @extend_schema(request=BuyAndSellSerializer)
    def post(self, request):
        user = request.user
        raw_data = BuyAndSellSerializer(data=request.data)
        if not raw_data.is_valid():
            return Response({'detail': 'Invalid payload'}, 422)
        
        data = raw_data.data

        footballer_data = FootballerWeeksData.objects.filter(
            footballer__name=data['footballer'],
            week=user.week or GameWeek.objects.get(number=0)
        ).first()
        if not footballer_data:
            return Response({'detail': 'This footballer does not exist.'}, 404)
        
        user_footballer = UserFootballer.objects.filter(
            footballer=footballer_data.footballer,
            user=user
        ).first()
        if not user_footballer:
            return Response({'detail': 'You don\'t have this footballer'}, 404)
        
        if user_footballer.amount < data['tokens']:
            return Response({'detail': 'You don\'t have this amount of tokens.'}, 422)

        user_footballer.amount -= data['tokens']
        user.balance += decimal.Decimal(footballer_data.sell_price * data['tokens'])

        with transaction.atomic():
            user_footballer.save()
            user.save()
        
        return Response({'detail': 'ok'}, 201)

