import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';  // Certifique-se de importar o arquivo CSS

const WelcomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);  // Controle de carregamento

  useEffect(() => {
    // Redireciona para a página de ligas após 5 segundos
    const timer = setTimeout(() => {
      setLoading(false);  // Atualiza o estado de carregamento
      navigate('/leagues');  // Redireciona para a página de ligas
    }, 5000);

    return () => clearTimeout(timer);  // Limpa o timer caso o componente seja desmontado
  }, [navigate]);

  return (
    <div className="welcome-page">
      {/* Caixa de texto com sobreposição escura */}
      <div className="content">
        <h1>Bem-vindo à ISCTE Fantasy Hoops!</h1>
        <p>Aguarde um momento. Estamos a preparar as Ligas para si...</p>

        {/* Barra de carregamento */}
        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
