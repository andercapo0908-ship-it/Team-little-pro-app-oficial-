import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register PWA Service Worker for standalone installation
if ('serviceWorker' in navigator && (import.meta as any).env?.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('TEAM LITTLE PRO PWA: Service Worker registered successfully', registration.scope);
      })
      .catch((error) => {
        console.error('TEAM LITTLE PRO PWA: Service Worker registration failed', error);
      });
  });
} else if ('serviceWorker' in navigator) {
  // Register in dev mode too for local testability
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('TEAM LITTLE PRO PWA (DEV/LOCAL): Registered successfully', registration.scope);
      })
      .catch((error) => {
        console.warn('TEAM LITTLE PRO PWA (DEV/LOCAL): Registration failed', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
