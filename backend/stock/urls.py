from  django.urls import path, include

from stock.views import (
    FootballersView,
    MatchPointsView,
    TopOfWeekView,
    UserTokenView,
    UserTokenBuyView,
    UserTokenSellView,
)


stock_urlpatterns = [
    path('', FootballersView.as_view(), name='footballers'),
    path('topweek/', TopOfWeekView.as_view(), name='top_of_week'),
    path('match/', MatchPointsView.as_view(), name='match_points'),
]


user_stock_urlpatterns = [
    path('', UserTokenView.as_view(), name='user_tokens'),
    path('buy/', UserTokenBuyView.as_view(), name='buy_tokens'),
    path('sell/', UserTokenSellView.as_view(), name='sell_tokens'),
]


urlpatterns = [
    path('', include(stock_urlpatterns)),
    path('user/', include(user_stock_urlpatterns)),
]
