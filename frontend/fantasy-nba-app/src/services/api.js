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
export const fetchLeaderboard = async (league_id, year, week_number) => {
  try {
    const response = await api.get(`/league/${league_id}/leaderboard/${year}/${week_number}/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao carregar a leaderboard:", error);
    return [];
  }
};

// Função para buscar jogadores por nome
export const searchPlayers = async (query) => {
  try {
    const response = await api.get(`/players/search/`, {
      params: { query }  // Envia o parâmetro query na URL
    });
    return response.data;  // Retorna os dados dos jogadores encontrados
  } catch (error) {
    console.error('Erro ao buscar jogadores:', error);
    return [];  // Retorna um array vazio em caso de erro
  }
};


// Função para obter jogadores de uma equipe
export const getTeamPlayers = async (teamId) => {
  try {
    const response = await api.get(`/team/${teamId}/players/`);
    return response.data;
  } catch (error) {
    console.error('Erro ao carregar jogadores da equipe:', error);
    throw error;
  }
};

export const addPlayerToTeam = async (teamId, playerIds, token) => {
  try {
    // Imprimir os dados para depuração
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

    // Verificar a resposta da API
    if (!response.ok) {
      throw new Error(`Erro: ${response.statusText}`);
    }

    const data = await response.json(); // Espera JSON na resposta
    console.log("Resposta da API:", data); // Imprime a resposta da API
    return data;
  } catch (error) {
    console.error("Erro ao adicionar jogador à equipe:", error);
    throw error;
  }
};

// Função para remover um jogador da equipe
export const removePlayerFromTeam = async (teamId, playerId) => {
  try {
    const response = await api.post(`/team/${teamId}/remove_player/`, {
      player_id: playerId  // Envia o ID do jogador
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao remover jogador da equipe:', error);
    throw error;
  }
};

// Função de registro de usuário
export const register = async (username, password, email) => {
  try {
    const response = await api.post('/register/', { username, password, email });
    return response.data;  // Retorna a resposta, geralmente uma mensagem de sucesso
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    throw error;  // Lança o erro para ser tratado em outro lugar
  }
};

// Função para obter as equipas do utilizador com os jogadores e seus pontos de fantasy
export const fetchUserTeams = async () => {
  try {
    const response = await api.get('/user/teams/');
    return response.data;  // Retorna os dados das equipas com jogadores e pontos de fantasy
  } catch (error) {
    console.error('Erro ao carregar as equipas do utilizador:', error);
    throw error;  // Lança o erro para ser tratado em outro lugar
  }
};

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
      team_name: teamName,  // Nome da equipe
    }),
  });

  const data = await response.json(); // Pega a resposta JSON

  if (!response.ok) {
    // Se a resposta não for ok, lança um erro com a mensagem retornada do backend
    throw new Error(data.detail || 'Erro ao criar equipe');
  }

  return data; // Retorna os dados da nova equipe criada
};

// Função para buscar a equipe pelo nome e ID da liga
export const fetchTeamId = async (leagueId, teamName) => {
  try {
    const response = await fetch(`http://localhost:8000/team/${leagueId}/${teamName}/`);
    if (!response.ok) {
      throw new Error('Equipe não encontrada.');
    }
    const data = await response.json();
    console.log('Equipe encontrada:', data);
    return data.team_id; // Retorna o ID da equipe
  } catch (error) {
    console.error('Erro ao buscar equipe:', error);
    alert('Erro ao buscar equipe. Tente novamente.');
  }
};

export { api };
