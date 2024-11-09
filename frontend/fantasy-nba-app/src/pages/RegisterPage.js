import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';  // Função de registro
import './RegisterPage.css';  // Estilo CSS para registro

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();  // Navegação após o registro

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const response = await register(username, password, email);
      console.log('Registro bem-sucedido:', response);
      alert("Registo efetuado com sucesso. Lets ball!");
      navigate('/login');  // Redireciona para a página de login após o registro
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      setErrorMessage('Erro ao registrar. Tente novamente.');
    }
  };

  return (
    <div className="register-page">
      <h2>Registrar</h2>
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
            placeholder="Digite seu nome de usuário"
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
            placeholder="Digite seu email"
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
        <button type="submit" className="submit-button">Registrar</button>
      </form>
      <p className="login-link">
        Já tem uma conta? <a href="/login">Faça login aqui</a>
      </p>
    </div>
  );
};

export default RegisterPage;
