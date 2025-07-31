// Performance utilities for TYSAN Landing Page

// Debounce function for performance optimization
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Preload critical resources
export const preloadResources = () => {
  const criticalResources = [
    '/videos/tysan-background.webm',
    '/videos/tysan-background.mp4'
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = resource.endsWith('.webm') || resource.endsWith('.mp4') ? 'video' : 'image';
    link.href = resource;
    document.head.appendChild(link);
  });
};

// Optimize images with WebP support detection
export const getOptimizedImageUrl = (url, width = 300) => {
  if (!url) return url;
  
  // If it's already a placeholder or external URL, return as is
  if (url.includes('placeholder') || url.includes('http')) {
    return url;
  }
  
  // For local images, you could add WebP conversion logic here
  return url;
};

// Memory management for large components
export const cleanupMemory = () => {
  // Clear any stored data that's no longer needed
  if (window.gc) {
    window.gc();
  }
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  console.log(`${name} took ${end - start} milliseconds`);
  return result;
};

// Lazy load components
export const lazyLoadComponent = (importFunc) => {
  return React.lazy(importFunc);
};

// Optimize animations for reduced motion preference
export const getReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Cache management
export const clearOldCache = async () => {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => 
      name.startsWith('tysan-cache-') && name !== 'tysan-cache-v1'
    );
    
    await Promise.all(
      oldCaches.map(name => caches.delete(name))
    );
  }
}; 