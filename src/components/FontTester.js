import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FontTester = ({ onFontChange }) => {
  const [selectedFont, setSelectedFont] = useState('inter');

  const fonts = [
    { id: 'inter', name: 'Inter', class: 'font-inter', description: 'Actual - Minimalista' },
    { id: 'space-grotesk', name: 'Space Grotesk', class: 'font-space-grotesk', description: 'Tame Impala vibes' },
    { id: 'syne', name: 'Syne', class: 'font-syne', description: 'The Weeknd vibes' },
    { id: 'chivo', name: 'Chivo', class: 'font-chivo', description: 'Enlighted vibes' },
    { id: 'dm-sans', name: 'DM Sans', class: 'font-dm-sans', description: 'Bullbenny vibes' },
    { id: 'outfit', name: 'Outfit', class: 'font-outfit', description: 'Moderno' },
    { id: 'albert-sans', name: 'Albert Sans', class: 'font-albert-sans', description: 'Clean' },
    { id: 'poppins', name: 'Poppins', class: 'font-poppins', description: 'Elegante' },
    { id: 'montserrat', name: 'Montserrat', class: 'font-montserrat', description: 'Clásico' },
    { id: 'roboto', name: 'Roboto', class: 'font-roboto', description: 'Google vibes' },
    { id: 'open-sans', name: 'Open Sans', class: 'font-open-sans', description: 'Legible' },
    { id: 'lato', name: 'Lato', class: 'font-lato', description: 'Suave' },
    { id: 'raleway', name: 'Raleway', class: 'font-raleway', description: 'Fino' },
    { id: 'nunito', name: 'Nunito', class: 'font-nunito', description: 'Amigable' },
    { id: 'quicksand', name: 'Quicksand', class: 'font-quicksand', description: 'Redondeado' }
  ];

  const handleFontChange = (fontId) => {
    setSelectedFont(fontId);
    onFontChange(fontId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 left-2 sm:left-4 z-50 bg-black/90 backdrop-blur-md border border-white/20 p-3 sm:p-4 rounded-none max-w-[280px] sm:max-w-xs max-h-80 sm:max-h-96 overflow-y-auto"
    >
      <h3 className="text-white font-bold mb-4 text-sm">TIPOGRAFÍAS</h3>
      <div className="space-y-3">
        {fonts.map((font) => (
          <motion.button
            key={font.id}
            onClick={() => handleFontChange(font.id)}
            whileHover={{ x: 5 }}
            className={`w-full text-left p-2 transition-all duration-300 ${
              selectedFont === font.id 
                ? 'bg-white/20 border border-white/40' 
                : 'bg-transparent border border-transparent hover:bg-white/10'
            }`}
          >
            <div className={`${font.class} text-white font-bold text-lg mb-1`}>
              {font.name}
            </div>
            <div className={`${font.class} text-gray-400 text-xs`}>
              {font.description}
            </div>
            <div className={`${font.class} text-white text-sm mt-2`}>
              TYSAN
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default FontTester; 