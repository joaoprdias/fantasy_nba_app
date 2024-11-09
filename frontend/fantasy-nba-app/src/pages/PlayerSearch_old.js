import React, { useState } from 'react';
import { searchPlayers } from '../services/api';  // Importe a função da API

const PlayerSearch = ({ selectedPlayers, setSelectedPlayers }) => {
  const [query, setQuery] = useState('');
  const [players, setPlayers] = useState([]);  // Inicializando com um array vazio

  // Função para buscar jogadores
  const handleSearch = async () => {
    const result = await searchPlayers(query);
    setPlayers(result);  // Armazena jogadores encontrados
  };

  const handleSelectPlayer = (player) => {
    if (selectedPlayers.length < 10) {
      setSelectedPlayers([...selectedPlayers, player]);  // Adiciona o jogador à lista de selecionados
    } else {
      alert('Você já selecionou 10 jogadores!');  // Alerta se o limite de jogadores for alcançado
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Digite o nome do jogador"
      />
      <button onClick={handleSearch}>Buscar Jogadores</button>

      <div>
        <h3>Jogadores Encontrados:</h3>
        <ul>
          {players.length > 0 ? (  // Verifica se há jogadores encontrados
            players.map((player) => (
              <li key={player.id}>
                {player.name}
                <button onClick={() => handleSelectPlayer(player)}>
                  Selecionar
                </button>
              </li>
            ))
          ) : (
            <li>Nenhum jogador encontrado</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PlayerSearch;
