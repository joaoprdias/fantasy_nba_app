from rest_framework import serializers
from .models import League, Team, Player, PlayerSelection
from django.contrib.auth.models import User

# Serializer para User
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email']

# Serializer para League
class LeagueSerializer(serializers.ModelSerializer):
    class Meta:
        model = League
        fields = ['league_id', 'league_name', 'description', 'created_at']

# Serializer para Team
class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['team_id', 'user', 'league', 'team_name', 'points', 'created_at']

# Serializer para Player
class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['player_id', 'name', 'team', 'ppg', 'rpg', 'apg', 'date']

# Serializer para PlayerSelection
class PlayerSelectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerSelection
        fields = ['player', 'team', 'date_selected']