import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform, useAnimation, AnimatePresence } from 'framer-motion';
import FontTester from './components/FontTester';

const App = () => {
  const [email, setEmail] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [currentSection, setCurrentSection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [upcomingRelease, setUpcomingRelease] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentFont, setCurrentFont] = useState('inter');
  const [showFontTester, setShowFontTester] = useState(false);
  
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const controls = useAnimation();
  const sectionRefs = useRef([]);

  const { scrollYProgress } = useScroll();
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);

  // Memoize sections to prevent unnecessary re-renders
  const sections = useMemo(() => [
    {
      id: 'behind-scenes',
      title: 'DETRÁS DE CÁMARAS',
      subtitle: 'Explora el proceso creativo, las sesiones de grabación y los momentos íntimos que dan vida a cada canción.',
      content: 'behind-scenes'
    },
    {
      id: 'upcoming',
      title: 'PRÓXIMOS LANZAMIENTOS',
      subtitle: 'Descubre lo que está por venir. Nuevas canciones, colaboraciones especiales y experiencias musicales únicas.',
      content: 'upcoming'
    },
    {
      id: 'music',
      title: 'MÚSICA',
      subtitle: 'Sumérgete en el universo sonoro de Tysan. Jazz detroit que trasciende fronteras.',
      content: 'music'
    },
    {
      id: 'shows',
      title: 'SHOWS EN VIVO',
      subtitle: 'Experiencias únicas donde la música cobra vida. Próximas fechas y presentaciones especiales.',
      content: 'shows'
    },
    {
      id: 'support',
      title: 'APOYA EL ARTE',
      subtitle: 'Ayuda a mantener vivo el proceso creativo. Tu contribución apoya directamente la producción de nueva música.',
      content: 'support'
    },
    {
      id: 'contact',
      title: 'CONTACTO',
      subtitle: 'Conecta con Tysan y el equipo de Liminal Records. Colaboraciones, prensa y más.',
      content: 'contact'
    }
  ], []);

  // Check if user has already unlocked the page
  useEffect(() => {
    const savedEmail = localStorage.getItem('tysan_unlocked_email');
    if (savedEmail) {
      setIsUnlocked(true);
      setEmail(savedEmail);
    }
  }, []);

  // Fetch upcoming release from Spotify API (placeholder)
  useEffect(() => {
    const fetchUpcomingRelease = async () => {
      setIsLoading(true);
      try {
        // Placeholder data - replace with actual Spotify API call
        const mockData = {
          title: "Untitled",
          artist: "Tysan",
          releaseDate: "2025-02-15",
          previewUrl: "https://example.com/preview.mp3",
          albumArt: "https://via.placeholder.com/300x300/1a1a1a/ffffff?text=UNTITLED",
          description: "El próximo lanzamiento de Tysan promete llevar el jazz detroit a nuevos horizontes."
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUpcomingRelease(mockData);
      } catch (error) {
        console.error('Error fetching upcoming release:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isUnlocked) {
      fetchUpcomingRelease();
    }
  }, [isUnlocked]);

  // Optimized form submission with useCallback
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (/\S+@\S+\.\S+/.test(email)) {
      setIsLoading(true);
      
      // Simulate email submission to Google Sheets
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Save email to localStorage
        localStorage.setItem('tysan_unlocked_email', email);
        
        setIsUnlocked(true);
        controls.start({
          opacity: 0,
          y: -50,
          transition: { duration: 0.8, ease: "easeInOut" }
        });
      } catch (error) {
        setError('Error al enviar el correo. Intenta nuevamente.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Por favor ingresa un correo válido');
    }
  }, [email, controls]);

  // Fullpage scroll navigation
  const scrollToSection = useCallback((sectionIndex) => {
    if (isScrolling || sectionIndex === currentSection) return;
    
    setIsScrolling(true);
    setCurrentSection(sectionIndex);
    setIsMenuOpen(false);
    
    // Smooth scroll to section
    if (sectionRefs.current[sectionIndex]) {
      sectionRefs.current[sectionIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    
    // Reset scrolling flag after animation
    setTimeout(() => setIsScrolling(false), 800);
  }, [currentSection, isScrolling]);

  // Font change handler
  const handleFontChange = useCallback((fontId) => {
    setCurrentFont(fontId);
  }, []);

  // Handle wheel scroll for fullpage navigation
  useEffect(() => {
    let timeoutId;
    let isScrollingWheel = false;

    // Check if device is mobile
    const isMobile = window.innerWidth <= 768;

    const handleWheel = (e) => {
      // Disable fullpage scroll on mobile
      if (isMobile) return;
      
      if (isScrollingWheel || isScrolling) return;
      
      e.preventDefault();
      isScrollingWheel = true;
      
      const direction = e.deltaY > 0 ? 1 : -1;
      const nextSection = Math.max(0, Math.min(sections.length - 1, currentSection + direction));
      
      if (nextSection !== currentSection) {
        scrollToSection(nextSection);
      }
      
      // Faster debounce for better responsiveness
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        isScrollingWheel = false;
      }, 200);
    };

    const handleKeyDown = (e) => {
      // Disable keyboard navigation on mobile
      if (isMobile || isScrolling) return;
      
      let nextSection = currentSection;
      
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        nextSection = Math.min(sections.length - 1, currentSection + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        nextSection = Math.max(0, currentSection - 1);
      } else if (e.key === 'Home') {
        nextSection = 0;
      } else if (e.key === 'End') {
        nextSection = sections.length - 1;
      }
      
      if (nextSection !== currentSection) {
        scrollToSection(nextSection);
      }
    };

    if (isUnlocked) {
      document.addEventListener('wheel', handleWheel, { passive: false });
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, [currentSection, isScrolling, sections.length, scrollToSection, isUnlocked]);

  // Optimized animation variants - reduced complexity
  const leftVariants = useMemo(() => ({
    initial: { x: 0 },
    animate: { 
      x: '-100%', 
      transition: { 
        duration: 1.2, 
        ease: "easeInOut"
      } 
    }
  }), []);

  const rightVariants = useMemo(() => ({
    initial: { x: 0 },
    animate: { 
      x: '100%', 
      transition: { 
        duration: 1.2, 
        ease: "easeInOut"
      } 
    }
  }), []);

  const zipLineVariants = useMemo(() => ({
    initial: { scaleY: 1 },
    animate: { 
      scaleY: 0,
      transition: { 
        duration: 1.2, 
        ease: "easeInOut"
      } 
    }
  }), []);

  // Optimized section variants - faster transitions
  const sectionVariants = useMemo(() => ({
    initial: { opacity: 0 },
    animate: { 
      opacity: 1, 
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      transition: { 
        duration: 0.2,
        ease: "easeIn"
      }
    }
  }), []);

  // Optimized stagger variants - reduced delays
  const staggerVariants = useMemo(() => ({
    initial: { opacity: 0, y: 10 },
    animate: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2,
        ease: "easeOut"
      }
    })
  }), []);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      
      if (isUnlocked) {
        // On mobile, allow normal scroll. On desktop, prevent scroll for fullpage
        document.body.style.overflow = isMobile ? 'auto' : 'hidden';
      } else {
        document.body.style.overflow = 'hidden';
      }
    };

    handleResize(); // Initial call
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = 'auto';
    };
  }, [isUnlocked]);

  // Get font class based on current font
  const getFontClass = () => {
    const fontMap = {
      'inter': 'font-inter',
      'space-grotesk': 'font-space-grotesk',
      'syne': 'font-syne',
      'chivo': 'font-chivo',
      'dm-sans': 'font-dm-sans',
      'outfit': 'font-outfit',
      'albert-sans': 'font-albert-sans'
    };
    return fontMap[currentFont] || 'font-inter';
  };

  return (
    <div ref={containerRef} className={`min-h-screen bg-black md:overflow-hidden ${getFontClass()}`}>
      
      {/* Video Background - Estilo Tame Impala */}
      {isUnlocked && (
        <div className="fixed inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover opacity-95"
            style={{ filter: 'brightness(2.0) contrast(1.2) saturate(1.1)' }}
          >
            <source src="/videos/tysan-background.webm" type="video/webm" />
            <source src="/videos/tysan-background.mp4" type="video/mp4" />
            {/* Fallback: Animated gradient background */}
            <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-800 animate-pulse" />
          </video>
          <div className="absolute inset-0 bg-transparent" />
        </div>
      )}

      {/* Navigation Header - Estilo Enlighted */}
      {isUnlocked && (
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-france-blue/30"
        >
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16 space-x-8">
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold text-white tracking-wider"
              >
                TYSAN
              </motion.div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8">
                {sections.map((section, index) => (
                  <motion.button
                    key={section.id}
                    onClick={() => scrollToSection(index)}
                    whileHover={{ y: -2 }}
                    className={`text-sm font-medium transition-colors duration-300 ${
                      currentSection === index 
                        ? 'text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {section.title}
                  </motion.button>
                ))}
              </nav>

              {/* Font Tester Toggle */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFontTester(!showFontTester)}
                className="p-2 text-white hover:text-gray-300 transition-colors"
                title="Cambiar tipografía"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 4v3h5v12h3V7h5V4H9zM3 12h3v7h3v-7h3V9H3v3z"/>
                </svg>
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-white ml-auto"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`} />
                  <span className={`block w-5 h-0.5 bg-white mt-1 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                  <span className={`block w-5 h-0.5 bg-white mt-1 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
                </div>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isMenuOpen ? 1 : 0,
              height: isMenuOpen ? 'auto' : 0
            }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {sections.map((section, index) => (
                <motion.button
                  key={section.id}
                  onClick={() => scrollToSection(index)}
                  whileHover={{ x: 10 }}
                  className={`block w-full text-left py-3 px-4 text-sm font-medium transition-colors duration-300 ${
                    currentSection === index 
                      ? 'text-white bg-white/10' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {section.title}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.header>
      )}

      {/* Content Sections - Fullpage on Desktop, Normal Scroll on Mobile */}
      <div className="relative z-10 md:h-screen md:overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.section
            key={currentSection}
            variants={sectionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            ref={el => sectionRefs.current[currentSection] = el}
            className="min-h-screen md:h-screen w-full flex items-center justify-center px-4 pt-24 pb-20 relative overflow-hidden"
          >
            {/* Section Background */}
            <motion.div
              style={{ y: currentSection % 2 === 0 ? y1 : y2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10"
            />
            
            {/* Dynamic Background Pattern - Estilo Industrial */}
            <div 
              className="absolute inset-0 opacity-10" 
              style={{
                backgroundImage: currentSection % 2 === 0 
                  ? `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
                  : `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), 
                     radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`
              }}
            />
            
            <div className="max-w-6xl mx-auto text-center z-20 px-4">
              <motion.h2
                custom={0}
                variants={staggerVariants}
                initial="initial"
                animate="animate"
                className="text-4xl md:text-6xl lg:text-8xl font-black text-white mb-8 tracking-tight"
                style={{ letterSpacing: '-0.02em' }}
              >
                {sections[currentSection].title}
              </motion.h2>
              
              <motion.p
                custom={1}
                variants={staggerVariants}
                initial="initial"
                animate="animate"
                className="text-lg md:text-xl text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed font-light"
              >
                {sections[currentSection].subtitle}
              </motion.p>

              {/* Dynamic Content Based on Section */}
              {sections[currentSection].content === 'behind-scenes' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {[1, 2, 3].map((item, index) => (
                    <motion.div
                      key={item}
                      custom={index + 2}
                      variants={staggerVariants}
                      initial="initial"
                      animate="animate"
                      whileHover={{ y: -10 }}
                      className="bg-black/40 backdrop-blur-sm rounded-none border border-white/20 
                                hover:border-white/40 transition-all duration-500 cursor-pointer group overflow-hidden"
                    >
                      <div className="h-64 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-16 h-16 bg-white/20 rounded-none flex items-center justify-center backdrop-blur-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2">Sesión #{item}</h3>
                        <p className="text-gray-300 font-light">
                          Capturando la energía cruda de las sesiones de estudio donde nacen las melodías.
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {sections[currentSection].content === 'upcoming' && (
                <div className="max-w-4xl mx-auto">
                  {isLoading ? (
                    <motion.div
                      custom={2}
                      variants={staggerVariants}
                      initial="initial"
                      animate="animate"
                      className="flex items-center justify-center"
                    >
                      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-none animate-spin"></div>
                    </motion.div>
                  ) : upcomingRelease ? (
                    <motion.div
                      custom={2}
                      variants={staggerVariants}
                      initial="initial"
                      animate="animate"
                      className="bg-black/60 backdrop-blur-sm rounded-none p-8 border border-white/20"
                    >
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                          <img 
                            src={upcomingRelease.albumArt} 
                            alt={upcomingRelease.title}
                            className="w-48 h-48 object-cover shadow-2xl"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-3xl font-bold text-white mb-2">
                            {new Date(upcomingRelease.releaseDate).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            }).toUpperCase()}
                          </div>
                          <h3 className="text-4xl font-black text-white mb-4">{upcomingRelease.title}</h3>
                          <p className="text-xl text-gray-300 mb-6 font-light">{upcomingRelease.description}</p>
                          
                          {/* Music Player - Estilo Industrial */}
                          <div className="bg-black/40 rounded-none p-4 border border-white/20">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <div className="text-white font-bold">Preview</div>
                                <div className="text-gray-400 text-sm font-light">30 segundos</div>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-12 h-12 bg-white text-black rounded-none flex items-center justify-center"
                              >
                                {isPlaying ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                )}
                              </motion.button>
                            </div>
                            <div className="w-full bg-gray-700 rounded-none h-2">
                              <div className="bg-white h-2" style={{ width: isPlaying ? '45%' : '0%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      custom={2}
                      variants={staggerVariants}
                      initial="initial"
                      animate="animate"
                      className="text-gray-400 font-light"
                    >
                      No hay lanzamientos próximos
                    </motion.div>
                  )}
                </div>
              )}

              {sections[currentSection].content === 'music' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {[1, 2, 3, 4].map((item, index) => (
                    <motion.div
                      key={item}
                      custom={index + 2}
                      variants={staggerVariants}
                      initial="initial"
                      animate="animate"
                      whileHover={{ scale: 1.02 }}
                      className="bg-black/40 backdrop-blur-sm rounded-none p-6 border border-white/20 
                                hover:border-white/40 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-black rounded-none flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-0.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4v2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8h4z"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-1">Track {item}</h3>
                          <p className="text-gray-400 text-sm font-light">3:45 • Jazz Detroit</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-10 h-10 bg-france-blue text-white rounded-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {sections[currentSection].content === 'shows' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {[1, 2].map((item, index) => (
                    <motion.div
                      key={item}
                      custom={index + 2}
                      variants={staggerVariants}
                      initial="initial"
                      animate="animate"
                      whileHover={{ scale: 1.03 }}
                      className="bg-black/60 backdrop-blur-sm rounded-none p-8 border border-white/20 
                                transition-all duration-300 cursor-pointer group"
                    >
                      <div className="text-center">
                        <div className="text-3xl md:text-4xl font-black text-white mb-4">15 FEB, 2025</div>
                        <h3 className="text-2xl font-bold text-white mb-3">Show #{item}</h3>
                        <p className="text-gray-300 mb-6 font-light">
                          Una noche de jazz detroit en su máxima expresión.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                          <button className="text-white hover:text-france-blue hover:bg-white transition-all duration-300 px-6 py-2 border border-white font-medium">
                             Comprar Tickets
                          </button>
                          <button className="bg-france-blue text-white hover:bg-france-blue-light transition-all duration-300 px-6 py-2 border border-france-blue font-medium">
                             Más Info
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {sections[currentSection].content === 'support' && (
                <div className="max-w-4xl mx-auto">
                  <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-md mx-auto mb-8">
                    <motion.a
                      custom={2}
                      variants={staggerVariants}
                      initial="initial"
                      animate="animate"
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      href="https://www.paypal.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-black font-bold py-4 px-8 
                                transition-all duration-300 text-center shadow-lg
                                border border-white hover:bg-gray-100"
                    >
                      Donar con PayPal
                    </motion.a>
                    <motion.a
                      custom={3}
                      variants={staggerVariants}
                      initial="initial"
                      animate="animate"
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      href="https://www.mercadopago.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-black text-white font-bold py-4 px-8 
                                transition-all duration-300 text-center shadow-lg
                                border border-white hover:bg-gray-900"
                    >
                      Donar con MercadoPago
                    </motion.a>
                  </div>
                  
                  <motion.div
                    custom={4}
                    variants={staggerVariants}
                    initial="initial"
                    animate="animate"
                    className="text-gray-400 text-sm max-w-md mx-auto font-light"
                  >
                    Tu apoyo hace posible la creación de arte auténtico y experiencias musicales únicas. 
                    Cada contribución nos acerca a nuevos proyectos y colaboraciones.
                  </motion.div>
                </div>
              )}

              {sections[currentSection].content === 'contact' && (
                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div
                      custom={2}
                      variants={staggerVariants}
                      initial="initial"
                      animate="animate"
                      className="bg-black/40 backdrop-blur-sm rounded-none p-8 border border-white/20"
                    >
                      <h3 className="text-2xl font-bold text-white mb-6">Liminal Records</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                          </svg>
                          <a href="mailto:liminalrecords.ar@gmail.com" className="text-gray-300 hover:text-white transition-colors font-light">
                            liminalrecords.ar@gmail.com
                          </a>
                        </div>
                        <div className="flex items-center gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                          </svg>
                          <span className="text-gray-300 font-light">Buenos Aires, Argentina</span>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      custom={3}
                      variants={staggerVariants}
                      initial="initial"
                      animate="animate"
                      className="bg-black/40 backdrop-blur-sm rounded-none p-8 border border-white/20"
                    >
                      <h3 className="text-2xl font-bold text-white mb-6">Síguenos</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { name: 'Instagram', icon: '📷' },
                          { name: 'TikTok', icon: '🎵' },
                          { name: 'YouTube', icon: '▶️' },
                          { name: 'Spotify', icon: '🎧' }
                        ].map((social, index) => (
                          <motion.button
                            key={social.name}
                            custom={index + 4}
                            variants={staggerVariants}
                            initial="initial"
                            animate="animate"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 p-3 bg-black/40 rounded-none border border-white/20 
                                      hover:border-white/40 transition-all duration-300"
                          >
                            <span className="text-2xl">{social.icon}</span>
                            <span className="text-white font-bold">{social.name}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        </AnimatePresence>
      </div>

      {/* Font Tester */}
      {isUnlocked && showFontTester && (
        <FontTester onFontChange={handleFontChange} />
      )}

      {/* Zipper Effect */}
      <motion.div
        variants={leftVariants}
        initial="initial"
        animate={isUnlocked ? "animate" : "initial"}
        className="fixed inset-y-0 left-0 w-1/2 bg-black z-50"
      />
      <motion.div
        variants={rightVariants}
        initial="initial"
        animate={isUnlocked ? "animate" : "initial"}
        className="fixed inset-y-0 right-0 w-1/2 bg-black z-50"
      />
      <motion.div
        variants={zipLineVariants}
        initial="initial"
        animate={isUnlocked ? "animate" : "initial"}
        className="fixed top-0 left-1/2 w-1 h-full bg-white z-50 origin-top"
      />

      {/* Email Overlay - Estilo Minimalista */}
      {!isUnlocked && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-black p-10 max-w-md w-full border border-white/20"
          >
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-6 p-4 bg-yellow-400 rounded-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="black" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </motion.div>
              <h1 className="text-4xl font-black text-white mb-4 tracking-wider">
                TYSAN
              </h1>
              <p className="text-gray-300 mb-4 font-light">
                Desbloquea la música
              </p>
              <p className="text-gray-400 text-sm font-light">
                Ingresa tu correo para acceder a contenido exclusivo y mantenerte actualizado
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full px-5 py-4 bg-black border border-white/30 text-white 
                            placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 
                            transition-all duration-300 font-light"
                  required
                  disabled={isLoading}
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-2 pl-1 absolute -bottom-5 left-0 font-light"
                  >
                    {error}
                  </motion.p>
                )}
              </div>
              
              <motion.button
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-france-blue text-white font-bold 
                          py-4 px-6 transition-all duration-300 shadow-lg
                          hover:bg-france-blue-light disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-none animate-spin"></div>
                    Enviando...
                  </div>
                ) : (
                  'DESBLOQUEAR CON CORREO'
                )}
              </motion.button>
            </form>
            
            <p className="text-gray-400 text-sm mt-8 text-center max-w-xs mx-auto font-light">
              Tu correo está seguro con nosotros. Solo enviaremos actualizaciones musicales y contenido exclusivo.
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default App;