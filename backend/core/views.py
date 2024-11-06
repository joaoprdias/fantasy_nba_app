from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model
from django.http import HttpResponse
from .models import Player, League, Team

# Se for retornar uma resposta simples
def home(request):
    return HttpResponse("Bem-vindo à página inicial!")

@api_view(['POST', 'GET'])
def login_view(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return Response({"message": "Logged in successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST)
    
    # GET method: verifica se o usuário está autenticado
    elif request.method == 'GET':
        if request.user.is_authenticated:
            return Response({"message": "User is already logged in"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Login"}, status=status.HTTP_200_OK)

@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)

@api_view(['POST'])
def register(request):
    """
    View para registrar um novo usuário.
    """
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if username and password and email:
            user = get_user_model().objects.create_user(username=username, password=password, email=email)
            return Response({"message": "User created successfully!"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "All fields are required!"}, status=status.HTTP_400_BAD_REQUEST)

# para testar na interface gráfica do Django é preciso submeter os dados em formato json:
# {
#    "username": "admin",
#    "password": "admin",
#    "email": "admin@lcd.pt"
#}

@api_view(['GET'])
def list_players(request):
    players = Player.objects.all()
    data = [{"player_id": player.player_id, "name": player.name, "team": player.team} for player in players]
    return Response(data)

@api_view(['POST'])
def create_team(request):
    user = request.user  # Supondo que o usuário esteja autenticado
    league_id = request.data.get('league_id')
    team_name = request.data.get('team_name')
    
    try:
        league = League.objects.get(league_id=league_id)
        team = Team.objects.create(user=user, league=league, team_name=team_name)
        return Response({"message": f"Team {team_name} created in league {league.league_name}."}, status=status.HTTP_201_CREATED)
    except League.DoesNotExist:
        return Response({"error": "League not found."}, status=status.HTTP_400_BAD_REQUEST)