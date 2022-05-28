import decimal

from django.db import transaction
from django.db.models import F, OuterRef, Subquery, Sum
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView, Response
from drf_spectacular.utils import extend_schema

from authentication.models import  UserFootballer
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


def get_top_week(week):
    return FootballerWeeksData.objects.filter(week=week).order_by('-perfomance')[:3]


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
        footballers = FootballerWeeksData.objects.filter(week=user.week or GameWeek.objects.get(number=0))
        portfolio = (
            UserFootballer.objects.filter(amount__gt=0)
            .filter(user=user)
            .annotate(
                buy_price=Subquery(
                    footballers.filter(footballer__id=OuterRef('footballer__id')).values('hix')
                )
            )
            .annotate(sell_price=F('buy_price') * decimal.Decimal(0.95))
            .annotate(value=F('buy_price') * F('amount'))
        )

        return Response(PortfolioSerializer(portfolio, many=True).data, 200)


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
        user_footballer.trade_price += footballer.buy_price
        if not created:
            user_footballer.trade_price /= 2

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


@extend_schema(tags=STOCK_TAGS)
class TopOfWeekView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        week = request.user.week
        if not week:
            return Response([], 200)
        
        top_week = get_top_week(week)
        return Response(TopWeekSerializer(top_week, many=True).data, 200)


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
