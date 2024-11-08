import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Leagues from './pages/Leagues';
import LeagueDetails from './pages/LeagueDetails';
import RegisterTeam from './pages/RegisterTeam';
import LoginPage from './pages/LoginPage';  // Página de login
import RegisterPage from './pages/RegisterPage';  // Página de registro
import HomePage from './pages/HomePage';  // Importa a nova HomePage
import './App.css';
import { fetchLeagues } from './services/api';  // Função para buscar ligas
import Header from './pages/Header';

function App() {
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [teamId, setTeamId] = useState(1);  // ID da equipe, ajustar conforme necessário
  const [leagues, setLeagues] = useState([]);  // Estado para armazenar as ligas

  useEffect(() => {
    const loadLeagues = async () => {
      const fetchedLeagues = await fetchLeagues();
      setLeagues(fetchedLeagues);  // Atualiza o estado com as ligas
    };
    loadLeagues();
  }, []);

  return (
    <Router>
      <Header /> {/* Exibe o cabeçalho em todas as páginas */}
      <Routes>
        {/* Página principal que lista as ligas */}
        <Route path="/" element={<HomePage />} />  {/* A página inicial é HomePage */}

        {/* Página de login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Página de registro */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Página de registro */}
        <Route path="/leagues" element={<Leagues />} />

        {/* Detalhes da liga e leaderboard */}
        <Route
          path="/league/:league_id/leaderboard/:year/:week_number"
          element={<LeagueDetails />}
        />

        {/* Registro de equipe para uma liga */}
        <Route
          path="/league/:league_id/register-team"
          element={
            <RegisterTeam
              selectedPlayers={selectedPlayers}
              setSelectedPlayers={setSelectedPlayers}
              teamId={teamId}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;