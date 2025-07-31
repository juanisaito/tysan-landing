import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Función para limpiar caché
const clearCache = async () => {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('🗑️ Cache limpiado');
  }
};

// Función para forzar actualización del Service Worker
const forceUpdate = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
        console.log('🔄 Service Worker desregistrado');
      });
    });
  }
};

// Register service worker for offline functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ SW registrado: ', registration);
        
        // Comentado temporalmente para evitar bucle infinito
        // registration.addEventListener('updatefound', () => {
        //   const newWorker = registration.installing;
        //   newWorker.addEventListener('statechange', () => {
        //     if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        //       console.log('🔄 Nueva versión disponible');
        //       if (window.confirm('Hay una nueva versión disponible. ¿Recargar la página?')) {
        //         window.location.reload();
        //       }
        //     }
        //   });
        // });
      })
      .catch((registrationError) => {
        console.log('❌ SW registration failed: ', registrationError);
      });
  });
  
  // Exponer funciones de limpieza para desarrollo
  if (process.env.NODE_ENV === 'development') {
    window.clearTysanCache = clearCache;
    window.forceTysanUpdate = forceUpdate;
    console.log('🔧 Funciones de desarrollo disponibles: window.clearTysanCache() y window.forceTysanUpdate()');
  }
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();