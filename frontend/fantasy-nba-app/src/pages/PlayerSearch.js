import React, { useState } from 'react';
import { searchPlayers, getPlayerStats } from '../services/api';
import './PlayerSearch.css';

const PlayerSearch = ({ selectedPlayers, setSelectedPlayers }) => {
  const [query, setQuery] = useState('');
  const [players, setPlayers] = useState([]);
  const [selectedPlayerStats, setSelectedPlayerStats] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      alert('Por favor, digite o nome do jogador para buscar.');
      return;
    }

    const result = await searchPlayers(query);
    setPlayers(result);
  };

  const handlePlayerClick = async (player) => {
    console.log('Selecionando jogador:', player.name);

    try {
      const stats = await getPlayerStats(player.id);  // Chama a função para pegar as estatísticas do jogador
      console.log('Estatísticas recebidas para o jogador:', stats);

      if (stats) {
        setSelectedPlayerStats(stats);
      } else {
        alert('Não foi possível carregar as estatísticas do jogador.');
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas do jogador:', error);
      alert('Erro ao carregar as estatísticas. Tente novamente.');
    }
  };

  return (
    <div className="player-search-container">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Digite o nome do jogador"
      />
      <button onClick={handleSearch}>Buscar Jogadores</button>

      <div>
        <ul>
          {players.length > 0 ? (
            players.map((player) => (
              <li key={player.player_id}>
                <span className="player-name">{player.name}</span>
                <button onClick={() => handlePlayerClick(player)}>
                  Selecionar
                </button>
              </li>
            ))
          ) : (
            <li>Nenhum jogador encontrado.</li>
          )}
        </ul>
      </div>

      {selectedPlayerStats && (
        <div className="player-stats">
          <h3>Estatísticas de {selectedPlayerStats.name}</h3>
          <p>Total de pontos (PPG): {selectedPlayerStats.total_ppg}</p>
          <p>Total de rebotes (RPG): {selectedPlayerStats.total_rpg}</p>
          <p>Total de assistências (APG): {selectedPlayerStats.total_apg}</p>
        </div>
      )}

    </div>
  );
};

export default PlayerSearch;
