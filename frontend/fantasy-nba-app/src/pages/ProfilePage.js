import React, { useState, useEffect } from 'react';
import { fetchUserTeams } from '../services/api';  // Importe a função de API

const ProfilePage = () => {
  const [userTeams, setUserTeams] = useState([]);  // Equipas do utilizador
  const [loading, setLoading] = useState(true);  // Estado de carregamento

  // Função para buscar as equipas do utilizador
  const getUserTeams = async () => {
    try {
      const teams = await fetchUserTeams();  // Chama a função da API
      setUserTeams(teams);  // Armazena as equipas no estado
    } catch (error) {
      console.error('Erro ao buscar as equipas do utilizador:', error);
    } finally {
      setLoading(false);  // Finaliza o estado de carregamento
    }
  };

  useEffect(() => {
    getUserTeams();  // Chama a função para buscar as equipas ao carregar o componente
  }, []);

  if (loading) {
    return <div>Loading...</div>;  // Exibe uma mensagem de carregamento enquanto os dados não chegam
  }

  return (
    <div>
      <h1>Perfil do Utilizador</h1>
      <h2>Equipas</h2>
      {userTeams.length === 0 ? (
        <p>Você não tem equipas ainda.</p>
      ) : (
        userTeams.map((team) => (
          <div key={team.id} className="team">
            <h3>{team.team_name}</h3>
            <p>Total de pontos: {team.total_points}</p>

            <h4>Jogadores:</h4>
            <ul>
              {team.players.map((player) => (
                <li key={player.player_name}>
                  {player.player_name} ({player.player_team}) - {player.fantasy_points} pontos
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default ProfilePage;
