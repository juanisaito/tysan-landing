// Color Analyzer for Album Covers
// This utility analyzes album cover colors and generates matching gradients

// Predefined color palettes based on common album cover themes
const colorPalettes = {
  // Dark/Industrial themes
  'dark': {
    primary: 'from-gray-900/40 to-black/40',
    secondary: 'from-gray-800/30 to-gray-900/30',
    accent: 'from-gray-700/20 to-gray-800/20'
  },
  
  // Blue/Cyan themes
  'blue': {
    primary: 'from-blue-900/40 to-cyan-800/40',
    secondary: 'from-blue-800/30 to-blue-900/30',
    accent: 'from-cyan-700/20 to-blue-800/20'
  },
  
  // Purple/Pink themes
  'purple': {
    primary: 'from-purple-900/40 to-pink-800/40',
    secondary: 'from-purple-800/30 to-purple-900/30',
    accent: 'from-pink-700/20 to-purple-800/20'
  },
  
  // Green/Emerald themes
  'green': {
    primary: 'from-green-900/40 to-emerald-800/40',
    secondary: 'from-green-800/30 to-green-900/30',
    accent: 'from-emerald-700/20 to-green-800/20'
  },
  
  // Orange/Red themes
  'orange': {
    primary: 'from-orange-900/40 to-red-800/40',
    secondary: 'from-orange-800/30 to-orange-900/30',
    accent: 'from-red-700/20 to-orange-800/20'
  },
  
  // Neutral/Gray themes
  'neutral': {
    primary: 'from-gray-800/40 to-gray-900/40',
    secondary: 'from-gray-700/30 to-gray-800/30',
    accent: 'from-gray-600/20 to-gray-700/20'
  }
};

// Analyze image URL and return appropriate color palette
export const analyzeImageColors = (imageUrl, trackTitle = '') => {
  // If we have a specific track, use predefined colors based on track name
  if (trackTitle) {
    const title = trackTitle.toLowerCase();
    
    // Balvanera - Blue/Cyan theme (subway, urban)
    if (title.includes('balvanera') || title.includes('bajoterra')) {
      return colorPalettes.blue.primary;
    }
    
    // Bbtrickz - Purple/Pink theme (electronic, vibrant)
    if (title.includes('bbtrickz')) {
      return colorPalettes.purple.primary;
    }
    
    // LV - Orange/Red theme (warm, energetic)
    if (title.includes('lv')) {
      return colorPalettes.orange.primary;
    }
    
    // Desparramo - Green/Emerald theme (organic, natural)
    if (title.includes('desparramo')) {
      return colorPalettes.green.primary;
    }
  }
  
  // Analyze image URL for color hints
  if (imageUrl) {
    const url = imageUrl.toLowerCase();
    
    // Check for color hints in the URL
    if (url.includes('blue') || url.includes('cyan') || url.includes('subway')) {
      return colorPalettes.blue.primary;
    }
    
    if (url.includes('purple') || url.includes('pink') || url.includes('vibrant')) {
      return colorPalettes.purple.primary;
    }
    
    if (url.includes('green') || url.includes('emerald') || url.includes('organic')) {
      return colorPalettes.green.primary;
    }
    
    if (url.includes('orange') || url.includes('red') || url.includes('warm')) {
      return colorPalettes.orange.primary;
    }
  }
  
  // Default to neutral palette
  return colorPalettes.neutral.primary;
};

// Get gradient class for track card
export const getTrackGradient = (track) => {
  return analyzeImageColors(track.cover, track.title);
};

// Get all available palettes for reference
export const getAllPalettes = () => {
  return colorPalettes;
}; 