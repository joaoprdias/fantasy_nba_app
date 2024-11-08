import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api'; // Função de login
import './LoginPage.css';  // Estilo CSS para login

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();  // Navegação após login

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await login(username, password);
      console.log('Login bem-sucedido:', response);
      navigate('/leagues');  // Redireciona para as ligas após o login
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setErrorMessage('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleLogin} className="login-form">
        <div className="input-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Digite seu nome de usuário"
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
            placeholder="Digite sua senha"
          />
        </div>
        <button type="submit" className="submit-button">Login</button>
      </form>
      <p className="signup-link">
        Não tem uma conta? <a href="/register">Registre-se aqui</a>
      </p>
    </div>
  );
};

export default LoginPage;
