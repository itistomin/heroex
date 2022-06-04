from django.contrib import admin

from authentication.models import User, UserFootballer, UserTradeLog, GameResultsLog


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'balance', 'week')


@admin.register(UserFootballer)
class UserFootballerAdmin(admin.ModelAdmin):
    list_display = ('user', 'footballer', 'amount',)


@admin.register(UserTradeLog)
class UserTradeLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'footballer', 'week', 'amount', 'buy_price', 'reward',)


@admin.register(GameResultsLog)
class GameResultsLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_pnl', 'total_rewards', 'total_return', 'game_number',)