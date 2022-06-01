from django.contrib import admin

from authentication.models import User, UserFootballer, UserTradeLog


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'balance', 'week')


@admin.register(UserFootballer)
class UserFootballerAdmin(admin.ModelAdmin):
    list_display = ('user', 'footballer', 'amount',)


@admin.register(UserTradeLog)
class UserTradeLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'footballer', 'week', 'amount', 'buy_price', 'reward',)
