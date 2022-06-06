import decimal

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView, Response
from drf_spectacular.utils import extend_schema

from authentication.models import  UserFootballer, UserTradeLog
from stock.models import GameWeek
from stock.views import get_footballer_reward


WEEK_TAGS = ['Week']

@extend_schema(tags=WEEK_TAGS)
class NextWeekView(APIView):
    permission_classes = (IsAuthenticated,)
    
    def post(self, request):
        user = request.user
        week = user.week or GameWeek.objects.get(number=0)
        if week.number == 8:
            return Response({'detail': 'You reached maximum of the game week',}, 422)
        
        user.week = GameWeek.objects.get(number=week.number + 1)
        reward = 0
        for footballer in UserFootballer.objects.filter(user=user):
            reward += get_footballer_reward(user.week, footballer.footballer) * footballer.amount
        user.reward += decimal.Decimal(reward)
        user.save()
        return Response({'detail': 'ok'}, 200)


@extend_schema(tags=WEEK_TAGS)
class ResetWeekView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user = request.user
        
        UserFootballer.objects.filter(user=user).delete()
        UserTradeLog.objects.filter(user=user).delete()
        
        user.week = GameWeek.objects.get(number=0)
        user.balance = 500
        user.game_number += 1
        user.reward = 0
        user.save()
        
        return Response({'detail': 'ok'}, 200)
