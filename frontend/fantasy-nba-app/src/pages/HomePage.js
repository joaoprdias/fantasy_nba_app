import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="home-page">
      {/* Background Video */}
      <video className="background-video" autoPlay loop muted={isMuted}>
        <source src="/videos/LeBron_edit.mp4" type="video/mp4" />
        Seu navegador não suporta vídeos.
      </video>

      <header className="header">
        <img src="/images/nba-logo.png" alt="NBA Logo" className="nba-logo" />
        <h1>ISCTE FANTASY HOOPS</h1>
        <p>Preparado para começar?</p>
      </header>

      {/* Botões de Login e Registo */}
      <section className="cta-section">
        <Link to="/login" className="cta-button">LOGIN</Link>
        <Link to="/register" className="cta-button">REGISTO</Link>
      </section>

      {/* Toggle Sound Button */}
      <button onClick={toggleMute} className="mute-button">
        {isMuted ? "SOUND ON" : "SOUND OFF"}
      </button>

      <footer className="footer">
        <p>&copy; 2024 ISCTE Fantasy Hoops by João Dias (110305), David Franco (110733) & Felipe Pereira (110861)</p>
      </footer>
    </div>
  );
};

export default HomePage;