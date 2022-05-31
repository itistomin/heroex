import decimal

from django.db import transaction
from django.db.models import F, OuterRef, Subquery, Sum
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView, Response
from drf_spectacular.utils import extend_schema

from authentication.models import  UserFootballer, UserTradeLog
from stock.models import (
    Footballer,
    FootballerWeeksData,
    GameWeek
)
from stock.serializers import (
    BuyAndSellSerializer,
    MarketFootballerSerializer,
    PortfolioSerializer,
    TopWeekSerializer,
)


STOCK_TAGS = ['Market']
USER_TOKENS_TAGS = STOCK_TAGS
PORTFOLIO_TAGS = STOCK_TAGS


def create_user_portfolio(user):
    user_footballers = user.footballers.all()
    return user_footballers


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
        user = request.user

        week = week=user.week or GameWeek.objects.get(number=0)
        footballers = FootballerWeeksData.objects.filter(week=week)
        data = list(FootballerWeeksData.objects.filter(week=week).order_by('-perfomance').values_list('footballer', flat=True)[:3])

        portfolio = []
        trade_data = UserTradeLog.objects.filter(user=user)
        for footballer_data in UserFootballer.objects.filter(amount__gt=0).filter(user=user):
            trade_logs = trade_data.filter(footballer=footballer_data.footballer)
            
            average_sum = 0
            average_amount = 0
            for trade in trade_logs:
                average_sum += trade.buy_price * trade.amount
                average_amount += trade.amount
            average_buy_price = average_sum / average_amount

            footballer_price = footballers.get(footballer=footballer_data.footballer)
            portfolio.append({
                'name': footballer_data.footballer.name,
                'amount': footballer_data.amount,
                'reward': (5 - data.index(footballer_data.footballer.id)) / 10 if footballer_data.footballer.id in data else 0,
                'trade_price': average_buy_price,
                'cost': average_amount * average_buy_price,
                'value': average_amount * footballer_price.sell_price,
                'buy_price': footballer_price.buy_price,
                'sell_price': footballer_price.sell_price,
                'pnl': average_amount * float(footballer_price.sell_price) - float(average_buy_price * average_amount),
            })

        return Response(portfolio, 200)


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

        user_footballer, created = UserFootballer.objects.get_or_create(
            footballer=footballer.footballer, 
            user=user
        )
        user_footballer.amount += data['tokens']

        user.balance -= data['tokens'] * footballer.buy_price

        with transaction.atomic():
            user_footballer.save()
            user.save()

        logs, created = UserTradeLog.objects.get_or_create(
            user=user,
            week=user.week,
            footballer=user_footballer.footballer,
            defaults={'amount': data['tokens'], 'buy_price': footballer.buy_price}
        )

        if not created:
            logs.amount += data['tokens']
            logs.save()

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


@extend_schema(tags=STOCK_TAGS)
class TopOfWeekView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        week = request.user.week or GameWeek.objects.get(number=0)
        data = FootballerWeeksData.objects.filter(week=week).order_by('-perfomance')[:3]
        return Response(TopWeekSerializer(data, many=True).data, 200)


@extend_schema(tags=STOCK_TAGS)
class MatchPointsView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        week = user.week or GameWeek.objects.get(number=0)
        previous_week = GameWeek.objects.filter(number=week.number-1).first() or week

        # TODO fix bottleneck, thats a huge query
        data = {}
        for footballer in Footballer.objects.all():
            current_week_data = FootballerWeeksData.objects.filter(week=week, footballer=footballer).first()
            data[footballer.name] = {
                'previous_score': FootballerWeeksData.objects.filter(week=previous_week, footballer=footballer).first().perfomance,
                'current_score': current_week_data.perfomance,
                'total_score': FootballerWeeksData.objects.filter(week__number__lte=week.number, footballer=footballer).aggregate(total=Sum('perfomance'))['total'],
                'buy_price': current_week_data.buy_price,
                'sell_price': current_week_data.sell_price,
            }
        return Response(data, 200)
