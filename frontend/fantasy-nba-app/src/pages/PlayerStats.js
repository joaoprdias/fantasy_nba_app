import React, { useState, useEffect } from 'react';
import { getPlayerStats, searchPlayers } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './PlayerStats.css'

const PlayerStats = () => {
  const [players, setPlayers] = useState([]); // Lista de jogadores para pesquisa
  const [selectedPlayer, setSelectedPlayer] = useState(null); // Jogador selecionado
  const [stats, setStats] = useState(null); // Estatísticas do jogador
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // "Texto de pesquisa"
  const navigate = useNavigate();

  // Função de procura de jogadores com base no termo de pesquisa
  const handleSearch = async (event) => {
    setSearchQuery(event.target.value);
    if (event.target.value.trim() !== '') {
      try {
        const result = await searchPlayers(event.target.value);
  
        // Filtrar jogadores para apresentar apenas um por nome (existem varios registos do mesmo jogador, visto que joga em multiplos dias)
        const uniquePlayers = [];
        const seenNames = new Set();
  
        result.forEach((player) => {
          if (!seenNames.has(player.name)) {
            uniquePlayers.push(player);
            seenNames.add(player.name);  // Marca o nome como "já visto"
          }
        });
  
        setPlayers(uniquePlayers);
      } catch (error) {
        console.error("Erro ao procurar pelos jogadores:", error);
      }
    } else {
      setPlayers([]);
    }
  };

  // Função para guardar as estatísticas do jogador selecionado
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPlayer) {
      setError('Por favor, selecione um jogador.');
      return;
    }

    try {
      const data = await getPlayerStats(selectedPlayer.id, startDate, endDate);
      setStats(data); 
      setError(null); 
    } catch (err) {
      setError('Erro na procura das estatísticas. Tente novamente.');
    }
  };

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player);
    setSearchQuery(''); // Limpa a pesquisa quando o jogador é selecionado
    setPlayers([]);     // Limpa a lista de resultados
  };

  return (
    <div className="player-stats-page">
      <h1>Estatísticas do Jogador</h1>

      {/* Botão de Voltar às Ligas */}
      <button className="back-button" onClick={() => navigate('/leagues')}>
        Voltar às Ligas
      </button>

      {/* Campo de pesquisa de jogador */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Pesquisar jogador..."
          value={searchQuery}
          onChange={handleSearch} // Chama a função de pesquisa ao digitar
          className="search-input"
        />
        {searchQuery && (
          <ul className="search-results">
            {players.length > 0 ? (
              players.map((player) => (
                <li
                  key={player.id}
                  onClick={() => handlePlayerSelect(player)} // Seleciona o jogador e limpa os resultados
                  className="search-item"
                >
                  {player.name}
                </li>
              ))
            ) : (
              <li className="no-results">Nenhum jogador encontrado</li>
            )}
          </ul>
        )}
      </div>

      {/* Apresenta o jogador selecionado */}
      {selectedPlayer && (
        <div className="selected-player">
          <h2>Jogador Selecionado: {selectedPlayer.name}</h2>
        </div>
      )}

      {/* Formulário para selecionar as datas e procurar estatísticas */}
      <form onSubmit={handleSubmit} className="stats-form">
        <div>
          <label>Data de Início:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-input"
          />
        </div>
        <div>
          <label>Data de Fim:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="date-input"
          />
        </div>
        <button type="submit" className="submit-button">Procurar Estatísticas</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {/* Apresentar estatísticas do jogador */}
      {stats && (
        <div className="stats-display">
          <h3>Média de Estatísticas</h3>
          <p>Pontos Médios: {stats.avg_points}</p>
          <p>Ressaltos Médios: {stats.avg_rebounds}</p>
          <p>Assistências Médias: {stats.avg_assists}</p>
        </div>
      )}
    </div>
  );
};

export default PlayerStats;