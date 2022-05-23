from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView, Response
from drf_spectacular.utils import extend_schema

from authentication.models import User
from stock.models import Footballer, FootballerWeeksData, GameWeek
from stock.serializers import MarketFootballerSerializer


USER_TOKENS_TAGS = ['User tokens']
STOCK_TAGS = ['Stock']


@extend_schema(tags=STOCK_TAGS)
class FootballersView(APIView):
    permission_classes = (IsAuthenticated,)
    
    @extend_schema(responses={200: MarketFootballerSerializer})
    def get(self, request):
        week = request.user.week or GameWeek.objects.get(number=0)
        footballers_data = FootballerWeeksData.objects.filter(week=week)
        return Response(MarketFootballerSerializer(footballers_data, many=True).data, 200)


@extend_schema(tags=USER_TOKENS_TAGS)
class UserTokenView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return Response({'detail': 'ok'}, 200)


@extend_schema(tags=USER_TOKENS_TAGS)
class UserTokenBuyView(APIView):
    permission_classes = (IsAuthenticated,)

    @extend_schema(request={})
    def post(self, request):
        return Response({'details': 'Success'}, 201)


@extend_schema(tags=USER_TOKENS_TAGS)
class UserTokenSellView(APIView):
    permission_classes = (IsAuthenticated,)

    @extend_schema(request={})
    def post(self, request):
        return Response({'details': 'Success'}, 201)
