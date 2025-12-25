import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SuiProvider } from './context/SuiProvider';
import '@mysten/dapp-kit/dist/index.css';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <SuiProvider>
      <App />
    </SuiProvider>
  </React.StrictMode>
);