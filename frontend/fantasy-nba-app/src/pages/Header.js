import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  // Função para verificar o estado de login
  const checkLoginStatus = () => {
    const token = localStorage.getItem('userToken');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername); // Atualiza o nome do usuário se estiver logado
    } else {
      setIsLoggedIn(false);
      setUsername('');
    }
  };

  // Verifica o estado do login na primeira renderização
  useEffect(() => {
    checkLoginStatus();

    // Adiciona um listener para monitorar mudanças no localStorage
    const handleStorageChange = () => checkLoginStatus();
    window.addEventListener('storage', handleStorageChange);

    // Remove o listener quando o componente é desmontado
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Logout: limpa os dados de login e redireciona
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    navigate('/'); // Redireciona para a página inicial após logout
  };

  return (
    <header style={headerStyle}>
      <div style={headerContentStyle}>
        {isLoggedIn && (
          <>
            {/* Nome de usuário com link para o perfil */}
            <Link to="/profile" style={usernameStyle}>{username}</Link>
            <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
          </>
        )}
      </div>
    </header>
  );
};

// Estilos
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '10px 20px',
  backgroundColor: '#333',
  color: 'white',
};

const headerContentStyle = {
  display: 'flex',
  alignItems: 'center',
};

const usernameStyle = {
  marginRight: '10px',
  fontSize: '1rem',
  color: 'white',
  textDecoration: 'none',
};

const logoutButtonStyle = {
  backgroundColor: '#ff4d4d',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  cursor: 'pointer',
};

export default Header;



