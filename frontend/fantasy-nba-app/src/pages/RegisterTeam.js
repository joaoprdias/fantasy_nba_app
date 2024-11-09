import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { createTeam, searchPlayers, addPlayerToTeam, fetchTeamId } from '../services/api';
import './RegisterTeam.css'

function RegisterTeam() {
  const { league_id } = useParams(); // Captura o league_id da URL
  const [teamName, setTeamName] = useState(''); // Nome da nova equipe
  const [team, setTeam] = useState(null); // Armazena a equipe criada
  const [players, setPlayers] = useState([]); // Lista de jogadores encontrados na pesquisa
  const [selectedPlayers, setSelectedPlayers] = useState([]); // Jogadores na equipe
  const [searchQuery, setSearchQuery] = useState(''); // Termo de pesquisa
  const [user, setUser] = useState(null); // Armazena os dados do usuário
  const [loading, setLoading] = useState(false);  // Estado de carregamento
  const [error, setError] = useState(null);  // Estado para exibir mensagens de erro
  const navigate = useNavigate();


  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user')); // Recupera os dados do usuário da localStorage
    if (userData) {
      setUser(userData); // Se o usuário estiver logado, salva os dados no estado
    } else {
      setError('Você precisa estar logado para criar uma equipe.');
    }
  }, []);

  // Função para criar a equipe
  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      alert("Digite um nome para a equipe.");
      return;
    }

    if (!league_id) {
      alert("Selecione uma liga.");
      return;
    }

    setLoading(true); // Inicia o carregamento
    setError(null); // Limpa mensagens de erro

    try {
      // Recuperar o token do localStorage
      const token = localStorage.getItem('token');
      
      // Verificar se o token existe
      if (!token) {
        alert('Você precisa estar logado.');
        return;
      }

      // Realizar a criação da equipe com o token no cabeçalho
      const newTeam = await createTeam(league_id, teamName, token); // Passa o token junto na requisição
      setTeam(newTeam); // Define a nova equipe como a equipe atual
      alert("Equipe criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar equipe:", error);
      setError("Erro ao criar equipe. Verifique se a URL base está correta no serviço API.");
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  // Função de busca de jogadores com base no termo de pesquisa
  const handleSearchChange = async (event) => {
    setSearchQuery(event.target.value);
    if (event.target.value.trim() !== '') {
      try {
        const result = await searchPlayers(event.target.value);
  
        // Filtrando jogadores para exibir apenas um por nome
        const uniquePlayers = [];
        const seenNames = new Set();
  
        result.forEach((player) => {
          if (!seenNames.has(player.name)) {
            uniquePlayers.push(player);
            seenNames.add(player.name);  // Marca o nome como já visto
          }
        });
  
        setPlayers(uniquePlayers);
      } catch (error) {
        console.error("Erro ao buscar jogadores:", error);
      }
    } else {
      setPlayers([]);
    }
  };

  // Função para adicionar jogador à lista de seleções
  const handleSelectPlayer = (player) => {
    // Verificar se o jogador já foi selecionado pelo nome
    const isPlayerAlreadySelected = selectedPlayers.some((p) => p.name === player.name);
    if (isPlayerAlreadySelected) {
      alert("Este jogador já foi adicionado!");
      return;
    }
    setSelectedPlayers((prev) => [...prev, player]);
  };

  // Função para remover jogador da lista de seleções
  const handleRemovePlayer = (player) => {
    setSelectedPlayers((prev) => prev.filter((p) => p.name !== player.name));
  };

  // Função para submeter todos os jogadores selecionados
  const handleSubmitSelections = async () => {
    if (!team) {
      alert("Crie uma equipe antes de submeter as seleções.");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar logado.');
      return;
    }

    try {
      // Obtém o team_id a partir do nome da equipe e do league_id
      const teamId = await fetchTeamId(league_id, team.team_name);

      // Imprimir os dados dos jogadores selecionados antes de enviar
      console.log("Jogadores selecionados para envio:", selectedPlayers);

      // Obter todos os IDs dos jogadores selecionados
      const playerIds = selectedPlayers.map((player) => player.id);

      // Fazer uma única requisição POST para adicionar todos os jogadores à equipe
      await addPlayerToTeam(teamId, playerIds, token);

      alert("Jogadores adicionados com sucesso!");
      setSelectedPlayers([]); // Limpa a lista após a submissão

      navigate('/leagues');

    } catch (error) {
      console.error("Erro ao adicionar jogadores:", error);
      alert("Erro ao adicionar jogadores. Tente novamente.");
    }
  };

  return (
    <div className="register-team-container">
      <h1>Registrar Equipe</h1>

      {!team ? (
        <div className="team-form">
          <input
            type="text"
            placeholder="Digite o nome da equipe"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <p>ID da Liga: {league_id}</p>
          <button onClick={handleCreateTeam}>Criar Equipe</button>
        </div>
      ) : (
        <div className="team-details">
          <h2>Equipe: {team.team_name}</h2>

          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Pesquisar jogadores..."
          />

          <div className="players-list">
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

          <div className="selected-players-list">
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

          <button className="submit-button" onClick={handleSubmitSelections}>Submeter Seleções</button>
        </div>
      )}
    </div>
  );
}

export default RegisterTeam;