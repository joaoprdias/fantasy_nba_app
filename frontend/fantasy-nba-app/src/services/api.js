import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

// Instância do axios com URL base configurada
const api = axios.create({
  baseURL: BASE_URL,
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

// Função para adicionar jogador à equipe
export const addPlayerToTeam = async (teamId, playerIds) => {
  try {
    const response = await api.post(`/team/${teamId}/add_player/`, {
      player_ids: playerIds  // Envia a lista de IDs dos jogadores
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar jogador à equipe:', error.response || error);
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

// Função de login
export const login = async (username, password) => {
  try {
    const response = await api.post('/login/', { username, password });
    return response.data;  // Retorna a resposta, geralmente uma mensagem de sucesso
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;  // Lança o erro para ser tratado em outro lugar
  }
};

// Função de logout
export const logout = async () => {
  try {
    const response = await api.post('/logout/');
    return response.data;  // Retorna a resposta de sucesso do logout
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;  // Lança o erro para ser tratado em outro lugar
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

export const createTeam = async (userId, leagueId, teamName) => {
  try {
    console.log("Enviando user_id:", userId);  // Log para verificar se o user_id está correto

    const response = await api.post('/team/create/', {
      user_id: userId,  // ID do usuário
      league_id: leagueId,  // ID da liga
      team_name: teamName  // Nome da equipe
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao criar equipe:', error);
    if (error.response) {
      console.error('Detalhes do erro:', error.response.data);
      throw new Error(error.response.data.detail || 'Erro desconhecido');
    }
    throw error;
  }
};
