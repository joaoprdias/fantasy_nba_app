import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'; // Importa as rotas
import Leagues from './pages/Leagues'; // Importa páginas da aplicação
import LeagueDetails from './pages/LeagueDetails';
import RegisterTeam from './pages/RegisterTeam';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CreateLeague from './pages/CreateLeague';
import WelcomePage from './pages/WelcomePage';
import PlayerStats from './pages/PlayerStats';
import './App.css';
import { fetchLeagues } from './services/api';

function App() {
  const [selectedPlayers, setSelectedPlayers] = useState([]); // Estado para os jogadores selecionados
  const [teamId, setTeamId] = useState(1); // Estado para o ID do time
  const [leagues, setLeagues] = useState([]); // Estado para as ligas

  useEffect(() => {
    const loadLeagues = async () => {
      const fetchedLeagues = await fetchLeagues();
      setLeagues(fetchedLeagues);
    };
    loadLeagues();
  }, []);

  const location = useLocation(); // Pega a localização atual da rota
  const navigate = useNavigate(); // Hook para navegar entre páginas

  // Definir se está em uma página de autenticação
  const isAuthPage = location.pathname === '/login' || location.pathname === '/welcome' || location.pathname === '/';

  // Função de logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      {/* Exibe o botão de logout apenas se não estiver em uma página de autenticação */}
      {!isAuthPage && (
        <div style={{ position: 'fixed', top: 10, right: 10 }}>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/leagues" element={<Leagues />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/league/:league_id/leaderboard/:year/:week_number" element={<LeagueDetails />} />
        <Route
          path="/league/:league_id/register-team"
          element={<RegisterTeam selectedPlayers={selectedPlayers} setSelectedPlayers={setSelectedPlayers} teamId={teamId} />}
        />
        <Route path="/players/:playerId/stats" element={<PlayerStats />} />
        <Route path="/create-league" element={<CreateLeague />} />
      </Routes>
    </div>
  );
}

export default App;