# fantasy_nba

Teste de funcionalidades no backend: 

python manage.py shell

from core.models import User, League, Player, Team, PlayerSelection
# Criação de um utilizador
user = User.objects.create(username="user1", email="user1@example.com", password_hash="hash123")
user.update_total_points()

# Criação de uma liga
league = League.objects.create(league_name="Olympics", description="melhores jogadores olimpicos", is_private=False)

# Criação de uma equipa
user = User.objects.get(username='user1')
get_leaderboard
team = Team.objects.create(user=user, league=league, team_name="my squad")

# Adicionar jogadores a uma equipa
player1 = Player.objects.get(name='Anthony Davis')
team.add_player_to_team(player1)
player2 = Player.objects.get(name='LeBron James')
team.add_player_to_team(player2)
player3 = Player.objects.get(name='Zion Williamson')
team.add_player_to_team(player3)
player4 = Player.objects.get(name='Jayson Tatum')
team.add_player_to_team(player4)
player5 = Player.objects.get(name='Shai Gilgeous-Alexander')
team.add_player_to_team(player5)
player6 = Player.objects.get(name='Jalen Suggs')
team.add_player_to_team(player6)
player7 = Player.objects.get(name='DeMar DeRozan')
team.add_player_to_team(player7)
player8 = Player.objects.get(name='Gradey Dick')
team.add_player_to_team(player8)
player9 = Player.objects.get(name='OG Anunoby')
team.add_player_to_team(player9)
player10 = Player.objects.get(name='Nikola Jokić')
team.add_player_to_team(player10)

# not possible (10 max)
player11 = Player.objects.get(name='Brandon Ingram')
team.add_player_to_team(player11)

# verificar os jogadores da equipa
team.get_players_names()