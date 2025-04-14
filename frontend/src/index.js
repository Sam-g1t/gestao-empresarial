import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Você pode manter isso para estilos adicionais seus
import 'bootstrap/dist/css/bootstrap.min.css'; // Importando o CSS do Bootstrap
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
