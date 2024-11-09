import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

// Instância do axios com URL base configurada
const api = axios.create({
  baseURL: BASE_URL
});

// Função para listar as ligas
export const fetchLeagues = async () => {
  try {
    const response = await api.get('/leagues/');
    return response.data;
  } catch (error) {
    console.error("Erro ao carregar as ligas:", error);
    return [];
  }
};

// Função para obter a leaderboard de uma liga específica
export const fetchLeaderboard = async (league_id) => {
  try {
    const response = await api.get(`/league/${league_id}/leaderboard/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao carregar a leaderboard:", error);
    return [];
  }
};

// Função para pesquisar jogadores por nome
export const searchPlayers = async (query) => {
  try {
    const response = await api.get(`/players/search/`, {
      params: { query } 
    });
    return response.data;  
  } catch (error) {
    console.error('Erro ao pesquisar jogadores:', error);
    return [];  
  }
};

// Função para obter jogadores de uma equipa
export const getTeamPlayers = async (teamId) => {
  try {
    const response = await api.get(`/team/${teamId}/players/`);
    return response.data;
  } catch (error) {
    console.error('Erro ao carregar jogadores da equipa:', error);
    throw error;
  }
};

// Função para adicionar jogadores à equipa (recebe uma lista de IDs dos jogadores a registar e passa com o token e o ID da equipa)
export const addPlayerToTeam = async (teamId, playerIds, token) => {
  try {
    console.log("Team ID na requisição:", teamId);
    console.log("Player IDs na requisição:", playerIds);
    console.log("Token na requisição:", token);

    const response = await fetch(`http://localhost:8000/team/add_players/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Adiciona o token de autenticação
      },
      body: JSON.stringify({ team_id: teamId,
                            player_ids: playerIds,
       })
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.statusText}`);
    }

    const data = await response.json(); 
    console.log("Resposta da API:", data); 
    return data;
  } catch (error) {
    console.error("Erro ao adicionar jogador à equipa:", error);
    throw error;
  }
};


export const removePlayerFromTeam = async (teamId, playerId) => {
  try {
    const response = await api.post(`/team/${teamId}/remove_player/`, {
      player_id: playerId  
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao remover jogador da equipa:', error);
    throw error;
  }
};

// Função de registo de novos utilizadores
export const register = async (username, password, email) => {
  try {
    const response = await api.post('/register/', { username, password, email });
    return response.data;  
  } catch (error) {
    console.error('Erro ao registar o utilizador:', error);
    throw error;  
  }
};

// Função para criar equipas
export const createTeam = async (league_id, teamName, token) => {
  if (!token) {
    throw new Error('Autenticação necessária. Faça o login novamente.');
  }

  const response = await fetch('http://127.0.0.1:8000/team/create/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`, // Adiciona o token no cabeçalho
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      league_id,  // ID da liga
      team_name: teamName,  // Nome da equipa
    }),
  });

  const data = await response.json(); // Guardar a resposta JSON

  if (!response.ok) {
    // Se a resposta não for ok, lança um erro com a mensagem retornada do backend
    throw new Error(data.detail || 'Erro ao criar equipa');
  }

  return data; 
};

// Função para pesquisar equipas pelo nome e ID da liga
export const fetchTeamId = async (leagueId, teamName) => {
  try {
    const response = await fetch(`http://localhost:8000/team/${leagueId}/${teamName}/`);
    if (!response.ok) {
      throw new Error('Equipa não encontrada.');
    }
    const data = await response.json();
    console.log('Equipa encontrada:', data);
    return data.team_id; 
  } catch (error) {
    console.error('Erro ao pesquisar equipa:', error);
    alert('Erro ao pesquisar equipa. Tente novamente.');
  }
};

// Função para criar novas ligas
export const createLeague = async (leagueData) => {
  try {
    const response = await api.post('/league/create/', leagueData);
    return response.data;  
  } catch (error) {
    throw new Error('Erro ao criar a liga: ' + error.message);
  }
};

// Função para pesquisar as estatísticas de um jogador
export const getPlayerStats = async (playerId, startDate, endDate) => {
  // Divide as datas no formato esperado pelo backend
  const startDateArr = startDate.split('-');
  const endDateArr = endDate.split('-');

  try {
    // Realiza a requisição GET para o endpoint 
    const response = await api.get(`/players/${playerId}/stats/`, {
      params: {
        start_year: startDateArr[0],
        start_month: startDateArr[1],
        start_day: startDateArr[2],
        end_year: endDateArr[0],
        end_month: endDateArr[1],
        end_day: endDateArr[2],
      },
    });

    // Retorna os dados da resposta (estatísticas)
    return response.data;
  } catch (error) {
    console.error('Erro ao encontrar estatísticas:', error);
    throw error; 
  }
};


export { api };