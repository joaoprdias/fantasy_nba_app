import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchLeaderboard } from '../services/api';  // Importa a função

const LeagueDetails = () => {
  const { league_id } = useParams();  // Obtém o id da liga da URL
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Ano e semana fictícios para exemplo
  const year = 2024;
  const week_number = 1;

  // Carregar a leaderboard da liga
  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const leaderboardData = await fetchLeaderboard(league_id, year, week_number);  // Carrega a leaderboard
        setLeaderboard(leaderboardData);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar a leaderboard:", error);
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [league_id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="league-details">
      <h2>Leaderboard da Liga</h2>
      <table>
        <thead>
          <tr>
            <th>Posição</th>
            <th>Nome da Equipa</th>
            <th>Pontos</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((team, index) => (
            <tr key={team.team_id}>
              <td>{index + 1}</td>
              <td>{team.team_name}</td>
              <td>{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeagueDetails;
