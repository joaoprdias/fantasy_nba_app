from django.db import models
from django.utils import timezone

# Modelo de Utilizador
class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    total_points = models.IntegerField(default=0)

    def __str__(self):
        return self.username


# Modelo de Liga
class League(models.Model):
    league_id = models.AutoField(primary_key=True)
    league_name = models.CharField(max_length=255)
    description = models.TextField()
    is_private = models.BooleanField(default=True)  # Indica se a liga é privada ou pública
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.league_name


# Modelo de Equipa
class Team(models.Model):
    team_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, related_name="teams", on_delete=models.CASCADE)
    league = models.ForeignKey(League, related_name="teams", on_delete=models.CASCADE)
    team_name = models.CharField(max_length=255)
    points = models.IntegerField(default=0)  # Pontuação total da equipa
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.team_name


# Modelo de Jogador
class Player(models.Model):
    player_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    team = models.CharField(max_length=255)  # Equipa atual do jogador
    ppg = models.FloatField(default=0)  # Pontos por jogo
    rpg = models.FloatField(default=0)  # Ressaltos por jogo
    apg = models.FloatField(default=0)  # Assistências por jogo
    date = models.DateField(default=timezone.now) # Data do jogo

    def __str__(self):
        return self.name


# Modelo de Relação Jogador-Equipa (TeamPlayers)
class TeamPlayer(models.Model):
    team_player_id = models.AutoField(primary_key=True)
    team = models.ForeignKey(Team, related_name="players", on_delete=models.CASCADE)
    player = models.ForeignKey(Player, related_name="teams", on_delete=models.CASCADE)
    draft_position = models.IntegerField()  # Posição em que o jogador foi selecionado no draft

    def __str__(self):
        return f"{self.team.team_name} - {self.player.name}"


# Modelo de Jogo
class Game(models.Model):
    game_id = models.AutoField(primary_key=True)
    date = models.DateTimeField()
    home_team = models.CharField(max_length=255)  # Nome da equipa da casa
    away_team = models.CharField(max_length=255)  # Nome da equipa visitante
    final_score = models.CharField(max_length=50)  # Resultado final do jogo (ex: "120-110")

    def __str__(self):
        return f"{self.home_team} vs {self.away_team} - {self.final_score}"
