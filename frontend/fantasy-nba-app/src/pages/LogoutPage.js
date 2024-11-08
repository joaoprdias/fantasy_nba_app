import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/api';  // Função de logout

const LogoutPage = () => {
  const navigate = useNavigate();  // Navegação após logout

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Chama a função de logout
        const response = await logout();

        // Limpa os tokens armazenados no localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // Redireciona para a página de login
        navigate('/login');
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
        // Em caso de erro, redireciona para a página de login também
        navigate('/login');
      }
    };

    // Realiza o logout ao carregar a página
    performLogout();
  }, [navigate]);

  return (
    <div className="logout-page">
      <h2>Logout</h2>
      <p>Você foi desconectado com sucesso. Redirecionando para a página de login...</p>
    </div>
  );
};

export default LogoutPage;
