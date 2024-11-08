from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
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
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    # Autenticação do utilizador
    user = authenticate(request, username=username, password=password)
    
    if user is not None:
        login(request, user)
        return Response({
            "message": "Login realizado com sucesso",
            "user": {
                "id": user.id,
                "username": user.username
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            "error": "Credenciais inválidas"
        }, status=status.HTTP_400_BAD_REQUEST)
        
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
@api_view(['GET'])
def list_leagues(request):
    leagues = League.objects.all()
    serializer = LeagueSerializer(leagues, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def create_team(request):
    if request.method == 'POST':
        user_id = request.data.get('user_id')
        league_id = request.data.get('league_id')
        team_name = request.data.get('team_name')

        # Verifica se os dados necessários estão presentes
        if not user_id or not league_id or not team_name:
            return Response({"detail": "Campos obrigatórios estão faltando."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Verifica se o usuário e a liga existem
            user = User.objects.get(id=user_id)
            league = League.objects.get(id=league_id)
        except (User.DoesNotExist, League.DoesNotExist):
            return Response({"detail": "Usuário ou Liga não encontrados."}, status=status.HTTP_404_NOT_FOUND)

        # Cria a nova equipe
        team = Team.objects.create(user=user, league=league, team_name=team_name)

        # Retorna os dados da equipe criada
        return Response({
            "id": team.id,
            "user_id": team.user.id,
            "league_id": team.league.id,
            "team_name": team.team_name
        }, status=status.HTTP_201_CREATED)
    
# Adicionar jogador à equipa
@api_view(['POST'])
def add_player_to_team(request, team_id):
    # Garantir que o usuário está autenticado
    if not request.user.is_authenticated:
        return Response({'detail': 'Autenticação necessária.'}, status=401)
    
    try:
        team = Team.objects.get(team_id=team_id)
    except Team.DoesNotExist:
        return Response({'detail': 'Equipe não encontrada.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Verifica o prazo de 24 horas para adição de jogadores à liga
    league = team.league
    if timezone.now() > (league.created_at + timedelta(days=1)):
        return Response({'detail': 'Já passou o prazo para fazer alterações nesta liga. Prazo expirado.'}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    # Obtém os IDs dos jogadores enviados
    player_ids = request.data.get('player_ids')
    if not player_ids:
        return Response({'detail': 'Nenhum ID de jogador fornecido.'}, status=status.HTTP_400_BAD_REQUEST)

    players_added = []  # Lista para armazenar os jogadores adicionados com sucesso
    players_not_found = []  # Lista para armazenar os jogadores que não foram encontrados

    # Itera sobre os IDs dos jogadores e tenta adicioná-los
    for player_id in player_ids:
        try:
            player = Player.objects.get(player_id=player_id)
            # Verifica se o jogador já está na equipe
            if player in team.players.all():
                players_not_found.append(f'O jogador {player.name} já está na equipe.')
            else:
                team.players.add(player)
                players_added.append(player.name)
        except Player.DoesNotExist:
            players_not_found.append(f'O jogador com ID {player_id} não foi encontrado.')

    # Mensagem de retorno com os jogadores que foram adicionados e os erros
    if players_added:
        message = f'Jogadores adicionados: {", ".join(players_added)}'
    else:
        message = 'Nenhum jogador foi adicionado.'
    
    if players_not_found:
        message += f' Erros: {", ".join(players_not_found)}'
    
    return Response({'detail': message}, status=status.HTTP_200_OK)


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

@api_view(['GET'])
def list_players_and_team_points(request, team_id):
    try:
        team = Team.objects.get(team_id=team_id)
    except Team.DoesNotExist:
        return Response({'detail': 'Team not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Obter os jogadores associados à equipa
    players = team.player_selections.all()

    # Calcular os pontos de fantasy para cada jogador e somar os pontos da equipa
    total_points = 0
    player_data = []
    
    for selection in players:
        player = selection.player
        player_fantasy_points = player.calculate_fantasy_points()
        total_points += player_fantasy_points
        
        player_data.append({
            'player_name': player.name,
            'player_team': player.team,
            'fantasy_points': player_fantasy_points
        })

    # Adiciona a soma dos pontos totais da equipa
    team_info = {
        'team_name': team.team_name,
        'total_points': total_points,
        'players': player_data
    }

    return Response(team_info, status=status.HTTP_200_OK)

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

@api_view(['GET'])
def search_players(request):
    query = request.GET.get('query', '').strip()
    # Verifica se a pesquisa não está vazia
    if query:
        # Busca insensível ao caso (case-insensitive)
        players = Player.objects.filter(name__icontains=query)
    else:
        players = Player.objects.none()  # Retorna uma lista vazia se a consulta estiver vazia    

    # Formata a resposta com os jogadores encontrados
    players_list = [{'id': player.player_id, 'name': player.name} for player in players]  # Alterado para 'player_id'
    return Response(players_list)

################## PLAYER SELECTIONS
@api_view(['GET'])
def get_player_selections(request, team_id):
    selections = PlayerSelection.objects.filter(team__team_id=team_id)
    serializer = PlayerSelectionSerializer(selections, many=True)
    return Response(serializer.data)