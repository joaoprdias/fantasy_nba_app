import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Para usar o Link do React Router
import { fetchLeagues } from '../services/api'; // Certifique-se de que a função fetchLeagues está exportada corretamente
import '../App.css'; // Importando o CSS global

function Leagues() {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLeagues = async () => {
      const data = await fetchLeagues();
      setLeagues(data);
      setLoading(false);
    };

    getLeagues();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app-container">
      <h1 className="page-title">Ligas Disponíveis</h1>

      <div className="button-container">
      {/* Botão para criar uma nova liga */}
      <Link to="/create-league">
        <button className="create-league-button">Criar Nova Liga</button>
      </Link>

      {/* Botão para aceder às stats dos jogadores */}
      <Link to="/players/:playerId/stats">
        <button className="stats-button">Estatísticas do Jogadores</button>
      </Link>
      </div>
      
      <div className="leagues-list">
        {leagues.map((league) => (
          <div key={league.league_id} className="league-card">
            <h2>{league.league_name}</h2>
            <p>{league.description}</p>
            <div>
              {/* Link para o Leaderboard da liga, usando o league_id */}
              <Link to={`/league/${league.league_id}/leaderboard/2024/1`}>
                <button className="details-button">Leaderboard</button>
              </Link>

              <Link to={`/league/${league.league_id}/register-team`}>
                <button className="register-button">Registar Equipa</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leagues;


