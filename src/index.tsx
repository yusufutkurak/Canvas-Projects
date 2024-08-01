import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // App bileşeninizi içe aktarın
import './index.css'; // CSS dosyanızı içe aktarın

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot çağırarak bir kök oluşturun

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
