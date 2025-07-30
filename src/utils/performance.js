// Utilidades de optimización de rendimiento

// Throttle function para limitar la frecuencia de ejecución
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
  }
};

// Debounce function para retrasar la ejecución
export const debounce = (func, wait, immediate) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Intersection Observer para lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Preload critical resources
export const preloadResources = () => {
  // Preload critical images
  const criticalImages = [
    // Add your critical image URLs here
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });

  // Preload critical fonts
  const criticalFonts = [
    // Add your critical font URLs here
  ];

  criticalFonts.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = href;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Optimize images
export const optimizeImage = (src, width, quality = 80) => {
  // If using a CDN like Cloudinary, you can add optimization parameters
  if (src.includes('cloudinary.com')) {
    return src.replace('/upload/', `/upload/w_${width},q_${quality}/`);
  }
  return src;
};

// Memory management for animations
export const cleanupAnimations = () => {
  // Cancel any running animations
  const animations = document.getAnimations();
  animations.forEach(animation => {
    if (animation.playState === 'running') {
      animation.cancel();
    }
  });
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  console.log(`${name} took ${end - start} milliseconds`);
  return result;
};

// Optimize scroll performance
export const optimizeScroll = (element, callback) => {
  let ticking = false;
  
  const updateScroll = () => {
    callback();
    ticking = false;
  };
  
  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateScroll);
      ticking = true;
    }
  };
  
  element.addEventListener('scroll', requestTick, { passive: true });
  
  return () => {
    element.removeEventListener('scroll', requestTick);
  };
};

// Reduce motion for users who prefer it
export const shouldReduceMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Optimize animations based on user preference
export const getOptimizedAnimationConfig = (defaultConfig) => {
  if (shouldReduceMotion()) {
    return {
      duration: 0.1,
      ease: 'linear',
      ...defaultConfig
    };
  }
  return defaultConfig;
};

// Lazy load components
export const lazyLoadComponent = (importFunc) => {
  return React.lazy(importFunc);
};

// Cache management
export const cacheData = (key, data, ttl = 3600000) => { // 1 hour default
  const item = {
    data,
    timestamp: Date.now(),
    ttl
  };
  
  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.warn('Failed to cache data:', error);
  }
};

export const getCachedData = (key) => {
  try {
    const item = JSON.parse(localStorage.getItem(key));
    if (!item) return null;
    
    const isExpired = Date.now() - item.timestamp > item.ttl;
    if (isExpired) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.data;
  } catch (error) {
    console.warn('Failed to get cached data:', error);
    return null;
  }
};

// Network status monitoring
export const monitorNetworkStatus = (callback) => {
  const updateNetworkStatus = () => {
    const isOnline = navigator.onLine;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    callback({
      isOnline,
      effectiveType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0
    });
  };
  
  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
  window.addEventListener('load', updateNetworkStatus);
  
  return () => {
    window.removeEventListener('online', updateNetworkStatus);
    window.removeEventListener('offline', updateNetworkStatus);
    window.removeEventListener('load', updateNetworkStatus);
  };
};

// Optimize for mobile devices
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const getOptimizedConfigForDevice = () => {
  const isMobile = isMobileDevice();
  
  return {
    particles: isMobile ? 15 : 25,
    frameRate: isMobile ? 24 : 30,
    animationDuration: isMobile ? 0.3 : 0.5,
    enableHeavyEffects: !isMobile
  };
}; 