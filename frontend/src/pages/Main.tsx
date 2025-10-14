import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../style/Index.css';
import App from './App';
import React from 'react';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
