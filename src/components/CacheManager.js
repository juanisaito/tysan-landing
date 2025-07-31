import { useEffect, useState } from 'react';
import { clearAppCache, forceAppUpdate, config } from '../config';

const CacheManager = ({ isAdmin, userEmail }) => {
  const [showCacheControls, setShowCacheControls] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Solo mostrar para el email específico del admin
  useEffect(() => {
    const adminEmails = [
      'juanisaito@gmail.com',
      'saitoneprod@gmail.com',
      'liminal@gmail.com'
    ];
    
    if (isAdmin && userEmail && adminEmails.includes(userEmail.toLowerCase())) {
      setShowCacheControls(true);
    }
  }, [isAdmin, userEmail]);

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      await clearAppCache();
      // Limpiar también localStorage si es necesario
      if (config.development.enableCacheClearing) {
        localStorage.clear();
        console.log('🗑️ localStorage limpiado');
      }
      alert('✅ Cache limpiado exitosamente');
    } catch (error) {
      console.error('Error limpiando cache:', error);
      alert('❌ Error limpiando cache');
    } finally {
      setIsClearing(false);
    }
  };

  const handleForceUpdate = () => {
    setIsUpdating(true);
    try {
      forceAppUpdate();
    } catch (error) {
      console.error('Error forzando actualización:', error);
      alert('❌ Error forzando actualización');
      setIsUpdating(false);
    }
  };

  if (!showCacheControls) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/90 backdrop-blur-sm border border-white/20 p-3 rounded-lg shadow-2xl">
      <div className="text-white text-xs mb-2">
        <div className="font-bold">🔧 Admin</div>
        <div className="text-gray-400">v{config.version}</div>
      </div>
      
      <div className="space-y-1">
        <button
          onClick={handleClearCache}
          disabled={isClearing}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white text-xs px-2 py-1 rounded transition-colors"
        >
          {isClearing ? '...' : '🗑️ Cache'}
        </button>
        
        <button
          onClick={handleForceUpdate}
          disabled={isUpdating}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white text-xs px-2 py-1 rounded transition-colors"
        >
          {isUpdating ? '...' : '🔄 Update'}
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white text-xs px-2 py-1 rounded transition-colors"
        >
          🔄 Reload
        </button>
      </div>
    </div>
  );
};

export default CacheManager; 