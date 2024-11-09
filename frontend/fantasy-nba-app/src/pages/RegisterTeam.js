import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { createTeam, searchPlayers, addPlayerToTeam, fetchTeamId } from '../services/api';
import './RegisterTeam.css'

function RegisterTeam() {
  const { league_id } = useParams(); 
  const [teamName, setTeamName] = useState(''); 
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]); 
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState(null); 
  const navigate = useNavigate();


  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user')); // Recuperar os dados do utilizador da localStorage
    if (userData) {
      setUser(userData); // Se o utilizador estiver conectado, guarda os dados no estado
    } else {
      setError('Deve estar conectado para criar uma equipa.');
    }
  }, []);

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      alert("Digite um nome para a equipa.");
      return;
    }

    if (!league_id) {
      alert("Selecione uma liga.");
      return;
    }

    setLoading(true); 
    setError(null); 

    try {
      // Recuperar o token do localStorage
      const token = localStorage.getItem('token');
      
      // Verificar se o token existe
      if (!token) {
        alert('Deve estar conectado.');
        return;
      }

      // Realizar a criação da equipa com o token no cabeçalho
      const newTeam = await createTeam(league_id, teamName, token); // Passa o token com o request
      setTeam(newTeam); // Define a nova equipa como a equipa atual
      alert("Equipa criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar a equipa:", error);
      setError("Erro ao criar a equipa.");
    } finally {
      setLoading(false); 
    }
  };

  // Função de pesquisa de jogadores com base no termo de pesquisa
  const handleSearchChange = async (event) => {
    setSearchQuery(event.target.value);
    if (event.target.value.trim() !== '') {
      try {
        const result = await searchPlayers(event.target.value);
  
        // Filtra jogadores para apresentar apenas um por nome
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

  // Função para remover o jogador da lista de seleções
  const handleRemovePlayer = (player) => {
    setSelectedPlayers((prev) => prev.filter((p) => p.name !== player.name));
  };

  // Função para submeter todos os jogadores selecionados
  const handleSubmitSelections = async () => {
    if (!team) {
      alert("Crie uma equipa antes de submeter as seleções.");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Precisa de estar conectado.');
      return;
    }

    try {
      // Obtém o team_id a partir do nome da equipa e do league_id
      const teamId = await fetchTeamId(league_id, team.team_name);

      // Imprimir os dados dos jogadores selecionados antes de enviar (para debugging)
      console.log("Jogadores selecionados para envio:", selectedPlayers);

      // Obter todos os IDs dos jogadores selecionados
      const playerIds = selectedPlayers.map((player) => player.id);

      // Fazer um único POST request para adicionar todos os jogadores à equipa
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
      <h1>Registar Equipa</h1>

      {!team ? (
        <div className="team-form">
          <input
            type="text"
            placeholder="Digite o nome da equipe"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <p>ID da Liga: {league_id}</p>
          <button onClick={handleCreateTeam}>Criar Equipa</button>
        </div>
      ) : (
        <div className="team-details">
          <h2>Equipa: {team.team_name}</h2>

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