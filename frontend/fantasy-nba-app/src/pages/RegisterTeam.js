import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // Para capturar o parâmetro da URL
import { createTeam, searchPlayers, addPlayerToTeam, removePlayerFromTeam, getTeamPlayers } from '../services/api';

function RegisterTeam() {
  const { league_id } = useParams(); // Captura o league_id da URL
  const [teamName, setTeamName] = useState(''); // Nome da nova equipe
  const [team, setTeam] = useState(null); // Armazena a equipe criada
  const [players, setPlayers] = useState([]); // Lista de jogadores encontrados na pesquisa
  const [selectedPlayers, setSelectedPlayers] = useState([]); // Jogadores na equipe
  const [searchQuery, setSearchQuery] = useState(''); // Termo de pesquisa
  const userId = localStorage.getItem('user_id');
  

  // Função para criar uma nova equipe
  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      alert("Digite um nome para a equipe.");
      return;
    }

    if (!league_id) {
      alert("Selecione uma liga.");
      return;
    }

    try {
      const newTeam = await createTeam(userId, league_id, teamName);  // Passa o ID da liga e o userId
      setTeam(newTeam); // Define a nova equipe como a equipe atual
      alert("Equipe criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar equipe:", error);
      alert("Erro ao criar equipe. Verifique se a URL base está correta no serviço API.");
    }
  };

  // Carrega os jogadores da equipe criada
  useEffect(() => {
    if (team) {
      const loadTeamPlayers = async () => {
        try {
          const players = await getTeamPlayers(team.id);  // Obtém jogadores da equipe criada
          setSelectedPlayers(players);  // Atualiza os jogadores selecionados
        } catch (error) {
          console.error("Erro ao carregar jogadores da equipe:", error);
        }
      };
      loadTeamPlayers();
    }
  }, [team]);

  // Função de busca de jogadores com base no termo de pesquisa
  const handleSearchChange = async (event) => {
    setSearchQuery(event.target.value);
    if (event.target.value.trim() !== '') {
      try {
        const result = await searchPlayers(event.target.value);  // Pesquisa jogadores pela query
        setPlayers(result);  // Atualiza os jogadores encontrados
      } catch (error) {
        console.error("Erro ao buscar jogadores:", error);
      }
    } else {
      setPlayers([]);  // Limpa os resultados se a pesquisa estiver vazia
    }
  };

  // Função para adicionar jogador à equipe
  const handleSelectPlayer = async (player) => {
    if (!team) {
      alert("Crie uma equipe antes de adicionar jogadores.");
      return;
    }

    const isPlayerAlreadySelected = selectedPlayers.some((p) => p.id === player.id);
    if (isPlayerAlreadySelected) {
      alert("Este jogador já foi adicionado!");
      return;
    }

    try {
      await addPlayerToTeam(team.id, [player.id]);  // Adiciona jogador à equipe
      setSelectedPlayers((prev) => [...prev, player]);  // Atualiza os jogadores selecionados
    } catch (error) {
      console.error("Erro ao adicionar jogador à equipe:", error);
      alert("Erro ao adicionar jogador. Tente novamente.");
    }
  };

  // Função para remover jogador da equipe
  const handleRemovePlayer = async (player) => {
    if (!team) return;
    try {
      await removePlayerFromTeam(team.id, player.id);  // Remove jogador da equipe
      setSelectedPlayers((prev) => prev.filter((p) => p.id !== player.id));  // Atualiza os jogadores selecionados
    } catch (error) {
      console.error("Erro ao remover jogador da equipe:", error);
      alert("Erro ao remover jogador. Tente novamente.");
    }
  };

  return (
    <div>
      <h1>Registrar Equipe</h1>

      {/* Entrada para o nome da equipe */}
      {!team ? (
        <div>
          <input
            type="text"
            placeholder="Digite o nome da equipe"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}  // Atualiza o nome da equipe
          />

          {/* O ID da liga agora é capturado da URL (sem a necessidade de inseri-lo manualmente) */}
          <p>ID da Liga: {league_id}</p> {/* Exibe o ID da liga para confirmação */}

          <button onClick={handleCreateTeam}>Criar Equipe</button>
        </div>
      ) : (
        <div>
          <h2>Equipe: {team.team_name}</h2>  {/* Exibe o nome da equipe criada */}

          {/* Campo de busca para os jogadores */}
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Pesquisar jogadores..."
          />

          {/* Lista de jogadores encontrados */}
          <div>
            {players.length > 0 ? (
              <ul>
                {players.map((player) => (
                  <li key={player.id}>
                    {player.name}
                    <button onClick={() => handleSelectPlayer(player)}>Adicionar</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum jogador encontrado</p>
            )}
          </div>

          {/* Lista de jogadores selecionados */}
          <div>
            <h2>Jogadores Selecionados:</h2>
            <ul>
              {selectedPlayers.map((player) => (
                <li key={player.id}>
                  {player.name}
                  <button onClick={() => handleRemovePlayer(player)}>Remover</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterTeam;


