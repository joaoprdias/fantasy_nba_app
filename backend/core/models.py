from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from datetime import timedelta


# Modelo da Liga
class League(models.Model):
    league_id = models.AutoField(primary_key=True)
    league_name = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.league_name

# Modelo do Jogador
class Player(models.Model):
    player_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    team = models.CharField(max_length=255)  # Equipa atual do jogador
    ppg = models.FloatField(default=0)  # Pontos por jogo
    rpg = models.FloatField(default=0)  # Ressaltos por jogo
    apg = models.FloatField(default=0)  # Assistências por jogo
    date = models.DateField(default=timezone.now) # Data do jogo
    
    def calculate_fantasy_points(self):
        # Calcula a pontuação fantasy com base nos multiplicadores fornecidos
        fantasy_points = (self.ppg * 2) + (self.rpg * 1) + (self.apg * 1.5)
        return fantasy_points
    
    def __str__(self):
        return self.name


# Modelo da Equipa
class Team(models.Model):
    team_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, related_name="teams", on_delete=models.CASCADE)
    league = models.ForeignKey(League, related_name="teams", on_delete=models.CASCADE)
    team_name = models.CharField(max_length=255)
    points = models.IntegerField(default=0)  # Pontuação total da equipa
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'league', 'team_name')  # Restringe uma equipa por utilizador em cada liga (por nome)

    def remove_player_from_team(self, player):
        selection = self.player_selections.filter(player=player).first()
        if selection:
            selection.delete()
            self.update_team_points()
            return "Jogador removido com sucesso."
        return "Jogador não encontrado na equipa."
    
    def update_team_points(self):
        # Atualiza a pontuação total da equipa com base nos jogadores selecionados
        self.points = sum([selection.player.calculate_fantasy_points() for selection in self.player_selections.all()])
        self.save()

    def __str__(self):
        return self.team_name


class PlayerSelection(models.Model):
    player = models.ForeignKey(Player, related_name="selections", on_delete=models.CASCADE)
    team = models.ForeignKey(Team, related_name="player_selections", on_delete=models.CASCADE)
    date_selected = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('player', 'team')  # Restringe que um jogador só possa ser selecionado uma vez por equipa

    def __str__(self):
        return f"{self.player.name} - {self.team.team_name}"