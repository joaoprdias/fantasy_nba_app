import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchLeaderboard } from '../services/api';  
import './LeagueDetails.css'

const LeagueDetails = () => {
  const { league_id } = useParams();  
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  // Carregar a leaderboard da liga
  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const leaderboardData = await fetchLeaderboard(league_id);  
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
    <div className="app-container">
      <h2>Leaderboard da Liga</h2>
      <div className="leaderboard-table-container">
        <table className="leaderboard-table">
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

      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate('/leagues')}>Voltar às Ligas</button>
      </div>
    </div>
  );
};

export default LeagueDetails;
