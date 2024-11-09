import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; 

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // Requisição para o backend Django
      const response = await fetch('http://localhost:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Dados do login
      });

      const data = await response.json(); // Resposta JSON

      if (response.ok) {
        // Se o login for bem-sucedido, armazena o token
        localStorage.setItem('token', data.token);
        console.log('Login bem-sucedido:', data.token);
        navigate('/welcome'); 
      } else {
        // Se houver um erro, mostra a mensagem de erro
        setErrorMessage(data.error || 'Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setErrorMessage('Erro no login. Tente mais tarde.');
    } finally {
      setLoading(false); // Finaliza o carregamento
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
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Carregando...' : 'Login'}
        </button>
      </form>
      <p className="signup-link">
        Não tem uma conta? <a href="/register">Registe-se aqui</a>
      </p>
    </div>
  );
};

export default LoginPage;
