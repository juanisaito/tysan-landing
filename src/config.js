// Configuration file for TYSAN Landing Page
const APP_VERSION = '1.0.4'; // Incrementar versión para forzar actualizaciones

export const config = {
  // App Version
  version: APP_VERSION,
  
  // Spotify API Configuration
  spotify: {
    clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID || '8655a44e54f5429990da4f90a8521eda',
    clientSecret: process.env.REACT_APP_SPOTIFY_CLIENT_SECRET || '6f7169e1585e440a9ddb675dbb33ce0f',
    baseUrl: 'https://api.spotify.com/v1',
    authUrl: 'https://accounts.spotify.com/api/token'
  },
  
  // App Configuration
  app: {
    name: process.env.REACT_APP_ARTIST_NAME || 'TYSAN',
    label: process.env.REACT_APP_LABEL_NAME || 'LIMINAL RECORDS',
    region: process.env.REACT_APP_REGION || 'Patagonia Argentina',
    version: APP_VERSION
  },
  
  // Cache Configuration
  cache: {
    name: `tysan-cache-v${APP_VERSION.replace(/\./g, '-')}`,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    staticCache: `tysan-static-v${APP_VERSION.replace(/\./g, '-')}`,
    dynamicCache: `tysan-dynamic-v${APP_VERSION.replace(/\./g, '-')}`
  },
  
  // Performance Configuration
  performance: {
    lazyLoadThreshold: 0.1,
    imageQuality: 0.8,
    videoPreload: 'metadata',
    enableServiceWorker: true,
    enableCache: true
  },
  
  // Development Configuration
  development: {
    enableDebugLogs: process.env.NODE_ENV === 'development',
    enableCacheClearing: process.env.NODE_ENV === 'development',
    enableForceUpdate: process.env.NODE_ENV === 'development'
  }
};

export default config;

// Función para formatear fechas
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).toUpperCase();
};

// Función para validar email
export const validateEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

// Función para simular envío a Mailchimp
export const submitToMailchimp = async (email) => {
  // Reemplazar con implementación real de Mailchimp
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Email enviado a Mailchimp:', email);
      resolve({ success: true });
    }, 1500);
  });
};

// Función para limpiar caché
export const clearAppCache = async () => {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          console.log('🗑️ Eliminando cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
      console.log('✅ Cache limpiado exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error limpiando cache:', error);
      return false;
    }
  }
  return false;
};

// Función para forzar actualización
export const forceAppUpdate = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
        console.log('🔄 Service Worker desregistrado');
      });
      // Recargar página después de un breve delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  }
}; 