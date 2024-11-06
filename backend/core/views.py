from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model
from django.http import HttpResponse
from django.contrib.auth.models import User
from .models import Player, League, Team, PlayerSelection
from .serializers import UserSerializer, LeagueSerializer, TeamSerializer, PlayerSerializer, PlayerSelectionSerializer
from django.utils import timezone
from datetime import timedelta

# Home simples
def home(request):
    return HttpResponse("Bem-vindo à página inicial!")

###################### USERS
# login / logout / register
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
    View para registar um novo usuário.
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

##################### LIGAS
# Criar uma nova liga
@api_view(['POST'])
def create_league(request):
    if request.method == 'POST':
        serializer = LeagueSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Obter a classificação de uma liga
@api_view(['GET'])
def get_league_leaderboard(request, league_id, year, week_number):
    try:
        league = League.objects.get(league_id=league_id)
    except League.DoesNotExist:
        return Response({'detail': 'League not found.'}, status=status.HTTP_404_NOT_FOUND)

    leaderboard = []
    
    # Iterar por todas as equipas na liga
    for team in league.teams.all():
        team_points = 0
        
        # Para cada jogador da equipa, calcular os pontos baseados nos jogos da semana
        for player_selection in team.player_selections.all():
            player = player_selection.player
            # Verifica se o jogo ocorreu na semana solicitada
            if player.date.isocalendar()[1] == week_number and player.date.year == year:
                team_points += player.calculate_fantasy_points()
        
        leaderboard.append({'team_name': team.team_name, 'points': team_points})

    # Ordena a leaderboard pela pontuação, em ordem decrescente
    leaderboard = sorted(leaderboard, key=lambda x: x['points'], reverse=True)
    return Response(leaderboard)

##################### EQUIPAS
# Criar uma nova equipa
@api_view(['POST'])
def create_team(request):
    if request.method == 'POST':
        serializer = TeamSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Adicionar jogador à equipa
@api_view(['POST'])
def add_player_to_team(request, team_id):
    try:
        team = Team.objects.get(team_id=team_id)
    except Team.DoesNotExist:
        return Response({'detail': 'Team not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Verifica o prazo de 24 horas para adição de jogador à liga
    league = team.league
    if timezone.now() > (league.created_at + timedelta(days=1)):
        return Response({'detail': 'It is too late to make changes to this league. The deadline has passed.'}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    player_id = request.data.get('player_id')
    try:
        player = Player.objects.get(player_id=player_id)
    except Player.DoesNotExist:
        return Response({'detail': 'Player not found.'}, status=status.HTTP_404_NOT_FOUND)

    message = team.add_player_to_team(player)
    return Response({'detail': message})

# Remover jogador da equipa
@api_view(['POST'])
def remove_player_from_team(request, team_id):
    try:
        team = Team.objects.get(team_id=team_id)
    except Team.DoesNotExist:
        return Response({'detail': 'Team not found.'}, status=status.HTTP_404_NOT_FOUND)

    player_id = request.data.get('player_id')
    try:
        player = Player.objects.get(player_id=player_id)
    except Player.DoesNotExist:
        return Response({'detail': 'Player not found.'}, status=status.HTTP_404_NOT_FOUND)

    message = team.remove_player_from_team(player)
    return Response({'detail': message})

@api_view(['GET'])
def list_players_in_team(request, team_id):
    try:
        team = Team.objects.get(team_id=team_id)
    except Team.DoesNotExist:
        return Response({'detail': 'Team not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Obter os jogadores associados à equipa através das seleções
    players = team.player_selections.all()
    
    # Formatar dados para enviar como resposta, incluindo os pontos de fantasia
    player_data = [{
        'player_name': selection.player.name,
        'player_team': selection.player.team,
        'fantasy_points': selection.player.calculate_fantasy_points()  # Calculando os pontos de fantasia
    } for selection in players]
    
    return Response(player_data)

################ PLAYERS
# Criar um novo jogador
@api_view(['POST'])
def create_player(request):
    if request.method == 'POST':
        serializer = PlayerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Visualizar um jogador (por ID)
@api_view(['GET'])
def get_player(request, player_id):
    try:
        player = Player.objects.get(player_id=player_id)
    except Player.DoesNotExist:
        return Response({'detail': 'Player not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = PlayerSerializer(player)
    return Response(serializer.data)

################## PLAYER SELECTIONS
@api_view(['GET'])
def get_player_selections(request, team_id):
    selections = PlayerSelection.objects.filter(team__team_id=team_id)
    serializer = PlayerSelectionSerializer(selections, many=True)
    return Response(serializer.data)