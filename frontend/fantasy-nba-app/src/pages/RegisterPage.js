import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';  
import './RegisterPage.css'; 

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();  

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const response = await register(username, password, email);
      console.log('Registo bem-sucedido:', response);
      alert("Registo efetuado com sucesso. Lets ball!");
      navigate('/login');  // Redireciona para a página de login após o registo
    } catch (error) {
      console.error('Erro ao registar o user:', error);
      setErrorMessage('Erro ao registar. Tente novamente.');
    }
  };

  return (
    <div className="register-page">
      <h2>Registar</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleRegister} className="register-form">
        <div className="input-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Digite o nome do utilizador"
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Digite o seu email"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Digite a sua password"
          />
        </div>
        <button type="submit" className="submit-button">Registar</button>
      </form>
      <p className="login-link">
        Já tem uma conta? <a href="/login">Faça login aqui</a>
      </p>
    </div>
  );
};

export default RegisterPage;
