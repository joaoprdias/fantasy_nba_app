import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // Importa o componente principal
import { BrowserRouter as Router } from 'react-router-dom'; // Importa o Router para gerenciar as rotas

// Ponto de entrada da aplicação
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router> {/* Envolvendo a aplicação com o Router */}
      <App /> {/* Componente principal que contém as rotas e a lógica */}
    </Router>
  </React.StrictMode>
);