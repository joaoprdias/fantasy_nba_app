from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from datetime import timedelta


# Modelo de Liga
class League(models.Model):
    league_id = models.AutoField(primary_key=True)
    league_name = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def get_leaderboard(self):
        # Definir o intervalo de 7 dias após a criação da liga
        start_date = self.created_at
        end_date = start_date + timedelta(days=7)
        
        # Filtrar as seleções de jogadores dentro desse período
        leaderboard = []
        for team in self.teams.all():
            total_points = 0
            for selection in team.player_selections.all():
                # Verificar se o jogo do jogador está dentro do intervalo de 7 dias
                if start_date <= selection.player.date <= end_date:
                    total_points += selection.player.calculate_fantasy_points()
            
            # Adicionar a pontuação do time
            leaderboard.append({'team_name': team.team_name, 'points': total_points})

        # Ordenar os times pela pontuação
        return sorted(leaderboard, key=lambda x: x['points'], reverse=True)

    def __str__(self):
        return self.league_name


# Modelo de Jogador
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


# Modelo de Equipa
class Team(models.Model):
    team_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, related_name="teams", on_delete=models.CASCADE)
    league = models.ForeignKey(League, related_name="teams", on_delete=models.CASCADE)
    team_name = models.CharField(max_length=255)
    points = models.IntegerField(default=0)  # Pontuação total da equipa
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'league', 'team_name')  # Restringe uma equipa por utilizador em cada liga

    def add_player_to_team(self, player, n=10):
        MAX_PLAYERS_PER_TEAM = n
        # Verifica se o número de jogadores na equipa já atingiu o limite
        if self.player_selections.count() >= MAX_PLAYERS_PER_TEAM:
            return "Limite de jogadores atingido para a equipa."
        # Verifica se o jogador já está na equipa
        if self.player_selections.filter(player=player).exists():
            return "Jogador já está na equipa."
        # Adiciona o jogador à equipa
        PlayerSelection.objects.create(team=self, player=player)
        # Atualiza os pontos da equipa
        self.update_team_points()        
        return "Jogador adicionado com sucesso."

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