from django.contrib import admin
from .models import League, Player, Team, PlayerSelection

admin.site.register(League)
admin.site.register(Player)
admin.site.register(Team)
admin.site.register(PlayerSelection)
