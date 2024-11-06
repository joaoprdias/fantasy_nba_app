"""
URL configuration for fantasy_nba project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from core import views


urlpatterns = [
    # User Authentication
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register, name='register'),

    # League
    path('league/create/', views.create_league, name='create_league'),
    path('league/<int:league_id>/leaderboard/<int:year>/<int:week_number>/', views.get_league_leaderboard, name='get_league_weekly_leaderboard'),

    # Team
    path('team/create/', views.create_team, name='create_team'),
    path('team/<int:team_id>/add_player/', views.add_player_to_team, name='add_player_to_team'),
    path('team/<int:team_id>/remove_player/', views.remove_player_from_team, name='remove_player_from_team'),
    path('team/<int:team_id>/players/', views.list_players_in_team, name='list_players_in_team'),

    # Player
    path('player/create/', views.create_player, name='create_player'),
    path('player/<int:player_id>/', views.get_player, name='get_player'),

    # Player Selections
    path('team/<int:team_id>/player_selections/', views.get_player_selections, name='get_player_selections'),
]
