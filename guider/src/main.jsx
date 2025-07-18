import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#333',
          color: '#fff',
          fontSize: '16px',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
        },
        success: {
          iconTheme: {
            primary: '#22c55e',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
    <App />
  </StrictMode>
);
