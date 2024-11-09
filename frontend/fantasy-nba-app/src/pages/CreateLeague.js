import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para navegação após criação
import { createLeague } from '../services/api'; // Importa a função de criação da liga
import './CreateLeague.css';

function CreateLeague() {
  const [leagueName, setLeagueName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação simples
    if (!leagueName || !description) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    try {
      // Dados da liga a serem enviados para o backend
      const leagueData = {
        league_name: leagueName,
        description: description,
      };

      // Chama a função para criar a liga
      await createLeague(leagueData);

      // Se a liga for criada com sucesso, redireciona para a lista de ligas
      navigate('/leagues');
    } catch (error) {
      console.error('Erro ao criar liga:', error);
      setError('Erro ao criar liga. Tente novamente.');
    }
  };

  return (
    <div className="create-league-page">
      <h2>Criar Nova Liga</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="leagueName">Nome da Liga:</label>
          <input
            type="text"
            id="leagueName"
            value={leagueName}
            onChange={(e) => setLeagueName(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="description">Descrição:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">Criar Liga</button>
      </form>
    </div>
  );
}

export default CreateLeague;