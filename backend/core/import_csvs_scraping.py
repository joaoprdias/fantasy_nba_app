import csv
import os
import django
import sys

# Defina o módulo de configurações do Django corretamente
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "fantasy_nba.settings")
django.setup()

from core.models import Player  # Importando o modelo Player do app 'core'

# Função para importar os dados
def import_players():
    # Caminho para o arquivo CSV gerado após o scraping
    csv_file_path = os.path.join('..', 'scraping', 'dailyleaders.csv')
    
    # Abra o arquivo CSV
    with open(csv_file_path, mode='r', encoding='utf-8') as file:
        # Crie um leitor de CSV
        reader = csv.DictReader(file)  # Assume que a primeira linha do CSV é o cabeçalho
        
        for row in reader:
            # Para cada linha no CSV, cria ou atualiza o modelo Player
            player, created = Player.objects.update_or_create(
                name=row['Player'],  # A chave 'Player' deve corresponder à coluna no CSV
                team=row['Tm'],
                ppg=row['PTS'],
                rpg=row['TRB'],
                apg=row['AST'],
                date=row['Date']
            )
            print(f"{'Criado' if created else 'Atualizado'}: {player.name}")

# Executa a função de importação
if __name__ == "__main__":
    import_players()
