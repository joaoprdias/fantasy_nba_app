import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';  

const WelcomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);  
      navigate('/leagues');  
    }, 5000);

    return () => clearTimeout(timer);  
  }, [navigate]);

  return (
    <div className="welcome-page">
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
