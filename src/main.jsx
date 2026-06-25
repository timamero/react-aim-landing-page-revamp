import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/variables.css';
import './styles/globals.css';
import './styles/animations.css';
import './styles/blocks/button.css';
import './styles/blocks/header.css';
import './styles/blocks/hero.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
