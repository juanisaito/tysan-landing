import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform, useAnimation, AnimatePresence } from 'framer-motion';
import FontTester from './components/FontTester';
import { useSpotifyData } from './hooks/useSpotifyData';
import { testSpotifyConnection } from './utils/testSpotifyConnection';

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
  const [playingTrack, setPlayingTrack] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Hook para datos automáticos de Spotify
  const { tracks, loading: spotifyLoading, error: spotifyError } = useSpotifyData();
  
  // Función para probar Spotify API (solo para desarrollo)
  useEffect(() => {
    if (isAdmin) {
      // Hacer disponible la función de prueba en la consola
      window.testSpotify = testSpotifyConnection;
      console.log('🔧 Modo admin activado. Usa window.testSpotify() en la consola para probar la API.');
    }
  }, [isAdmin]);
  
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const controls = useAnimation();
  const sectionRefs = useRef([]);

  const { scrollYProgress } = useScroll();
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);

  // Optimized sections - balanced approach
  const sections = useMemo(() => [
    {
      id: 'behind-scenes',
      title: 'DETRÁS DE CÁMARAS',
      subtitle: 'Explora el proceso creativo y los momentos íntimos que dan vida a cada canción.',
      content: 'behind-scenes'
    },
    {
      id: 'music',
      title: 'MÚSICA',
                      subtitle: 'Últimos lanzamientos que trascienden fronteras. Escucha y descubre el universo sonoro de Tysan.',
      content: 'music'
    },
    {
      id: 'upcoming',
      title: 'PRÓXIMO LANZAMIENTO',
      subtitle: 'Sé el primero en escuchar. Nuevas canciones y experiencias musicales únicas.',
      content: 'upcoming'
    },
    {
      id: 'shows',
      title: 'SHOWS EN VIVO',
      subtitle: 'Experiencias únicas donde la música cobra vida. Próximas fechas.',
      content: 'shows'
    },
    {
      id: 'support',
      title: 'APOYA EL ARTE',
      subtitle: 'Ayuda a mantener vivo el proceso creativo. Tu contribución apoya directamente la producción.',
      content: 'support'
    },

  ], []);

  // Check if user has already unlocked the page
  useEffect(() => {
    const savedEmail = localStorage.getItem('tysan_unlocked_email');
    if (savedEmail) {
      setIsUnlocked(true);
      setEmail(savedEmail);
      
      // Check if user is admin (SAITONEPROD)
      if (savedEmail.toLowerCase().includes('saitoneprod') || savedEmail.toLowerCase().includes('liminal')) {
        setIsAdmin(true);
      }
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



    const handleWheel = (e) => {
      // Enable fullpage scroll on all devices
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
      // Enable keyboard navigation on all devices
      if (isScrolling) return;
      
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

  // Optimized section variants - faster and smoother transitions
  const sectionVariants = useMemo(() => ({
    initial: { opacity: 0 },
    animate: { 
      opacity: 1, 
      transition: { 
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] // Custom cubic-bezier for smoothness
      }
    },
    exit: { 
      opacity: 0, 
      transition: { 
        duration: 0.2,
        ease: [0.55, 0.055, 0.675, 0.19]
      }
    }
  }), []);

  // Optimized title animations - balanced approach
  const getTitleVariants = (sectionIndex) => {
    const animations = [
      // Behind Scenes - Slide from left
      {
        initial: { opacity: 0, x: -60 },
        animate: { 
          opacity: 1, 
          x: 0,
          transition: { 
            duration: 0.4, 
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.1
          }
        }
      },
      // Music - Simple fade with scale
      {
        initial: { opacity: 0, scale: 0.95 },
        animate: { 
          opacity: 1, 
          scale: 1,
          transition: { 
            duration: 0.4, 
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.1
          }
        }
      },
      // Upcoming - Slide from right
      {
        initial: { opacity: 0, x: 60 },
        animate: { 
          opacity: 1, 
          x: 0,
          transition: { 
            duration: 0.4, 
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.1
          }
        }
      },
      // Shows - Slide from top
      {
        initial: { opacity: 0, y: -40 },
        animate: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.4, 
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.1
          }
        }
      },
      // Support - Slide from bottom
      {
        initial: { opacity: 0, y: 40 },
        animate: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.4, 
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.1
          }
        }
      },

    ];
    return animations[sectionIndex % animations.length];
  };

  // Optimized subtitle animations - balanced approach
  const getSubtitleVariants = (sectionIndex) => {
    const animations = [
      // Behind Scenes - Simple fade
      {
        initial: { opacity: 0, y: 20 },
        animate: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.4, 
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.2
          }
        }
      },
      // Music - Simple fade
      {
        initial: { opacity: 0, y: 20 },
        animate: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.4, 
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.2
          }
        }
      },
      // Upcoming - Simple fade
      {
        initial: { opacity: 0, y: 20 },
        animate: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.4, 
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.2
          }
        }
      },
      // Shows - Simple fade
      {
        initial: { opacity: 0, y: 20 },
        animate: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.4, 
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.2
          }
        }
      },
      // Support - Simple fade
      {
        initial: { opacity: 0, y: 20 },
        animate: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.4, 
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.2
          }
        }
      },

    ];
    return animations[sectionIndex % animations.length];
  };

  // Optimized content animations - balanced approach
  const getContentVariants = (sectionIndex) => {
    const animations = [
      // Behind Scenes - Simple fade with stagger
      {
        initial: { opacity: 0, y: 20 },
        animate: (i) => ({
          opacity: 1,
          y: 0,
          transition: {
            delay: 0.3 + (i * 0.05),
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
          }
        })
      },
      // Music - Simple fade with stagger
      {
        initial: { opacity: 0, y: 20 },
        animate: (i) => ({
          opacity: 1,
          y: 0,
          transition: {
            delay: 0.3 + (i * 0.05),
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
          }
        })
      },
      // Upcoming - Simple scale
      {
        initial: { opacity: 0, scale: 0.95 },
        animate: (i) => ({
          opacity: 1,
          scale: 1,
          transition: {
            delay: 0.3 + (i * 0.05),
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
          }
        })
      },
      // Shows - Simple fade
      {
        initial: { opacity: 0, y: 20 },
        animate: (i) => ({
          opacity: 1,
          y: 0,
          transition: {
            delay: 0.3 + (i * 0.05),
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
          }
        })
      },
      // Support - Simple fade
      {
        initial: { opacity: 0, y: 20 },
        animate: (i) => ({
          opacity: 1,
          y: 0,
          transition: {
            delay: 0.3 + (i * 0.05),
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
          }
        })
      },

    ];
    return animations[sectionIndex % animations.length];
  };

  // Optimized stagger variants for backward compatibility
  const staggerVariants = useMemo(() => ({
    initial: { opacity: 0, y: 8 },
    animate: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.03,
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    })
  }), []);

  // Simple animation getters - no complex caching needed
  const getCachedTitleVariants = useCallback((sectionIndex) => {
    return getTitleVariants(sectionIndex);
  }, []);

  const getCachedSubtitleVariants = useCallback((sectionIndex) => {
    return getSubtitleVariants(sectionIndex);
  }, []);

  const getCachedContentVariants = useCallback((sectionIndex) => {
    return getContentVariants(sectionIndex);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (isUnlocked) {
        // On mobile, allow normal scroll. On desktop, prevent scroll for fullpage
        document.body.style.overflow = window.innerWidth <= 768 ? 'auto' : 'hidden';
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

  // Audio element ref
  const audioRef = useRef(null);

  // Handle audio ended
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => {
        setPlayingTrack(null);
      };
      
      audio.addEventListener('ended', handleEnded);
      return () => {
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  // Handle track preview with real audio
  const handlePlayPreview = (trackId) => {
    const track = tracks.find(t => t.id === trackId);
    
    if (playingTrack === trackId) {
      // Pause current track
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingTrack(null);
    } else {
      // Stop any currently playing track
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      // Set new track and play
      setPlayingTrack(trackId);
      
      // Create audio element with Spotify preview URL
      if (track && track.previewUrl) {
        if (audioRef.current) {
          audioRef.current.src = track.previewUrl;
          audioRef.current.play().catch(e => {
            console.log('Audio play failed:', e);
            setPlayingTrack(null);
          });
        }
      }
      
      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (playingTrack === trackId) {
          if (audioRef.current) {
            audioRef.current.pause();
          }
          setPlayingTrack(null);
        }
      }, 30000);
    }
  };



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
    <div ref={containerRef} className={`min-h-screen md:overflow-hidden transition-colors duration-500 ${getFontClass()} ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-black'}`}>
      
      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="none" />
      
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
          className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b transition-colors duration-500 ${
            isDarkMode 
              ? 'bg-black/80 border-france-blue/30' 
              : 'bg-white/90 border-gray-300'
          }`}
        >
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16 space-x-8">
              {/* Dark/Light Mode Toggle - Left side */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-1.5 transition-all duration-300 rounded-full ${
                  isDarkMode 
                    ? 'text-white/80 hover:text-white hover:bg-white/10' 
                    : 'text-black/80 hover:text-black hover:bg-black/10'
                }`}
                title={isDarkMode ? "Modo claro" : "Modo oscuro"}
              >
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
                  </svg>
                )}
              </motion.button>

              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`text-2xl font-bold tracking-wider transition-colors duration-500 ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`}
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
                        ? (isDarkMode ? 'text-white' : 'text-black')
                        : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black')
                    }`}
                  >
                    {section.title}
                  </motion.button>
                ))}
              </nav>

              {/* Font Tester Toggle - Admin Only */}
              {isAdmin && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFontTester(!showFontTester)}
                  className={`p-2 transition-colors ${
                    isDarkMode 
                      ? 'text-white hover:text-gray-300' 
                      : 'text-black hover:text-gray-700'
                  }`}
                  title="Cambiar tipografía (Admin)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 4v3h5v12h3V7h5V4H9zM3 12h3v7h3v-7h3V9H3v3z"/>
                  </svg>
                </motion.button>
              )}



              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`md:hidden p-2 ml-auto transition-colors ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`}
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`block w-5 h-0.5 transition-all duration-300 ${isDarkMode ? 'bg-white' : 'bg-black'} ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`} />
                  <span className={`block w-5 h-0.5 transition-all duration-300 ${isDarkMode ? 'bg-white' : 'bg-black'} mt-1 ${isMenuOpen ? 'opacity-0' : ''}`} />
                  <span className={`block w-5 h-0.5 transition-all duration-300 ${isDarkMode ? 'bg-white' : 'bg-black'} mt-1 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
                </div>
              </motion.button>
            </div>
          </div>

        </motion.header>
      )}

      {/* Mobile Menu - Moved outside header to prevent overlap */}
      {isUnlocked && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isMenuOpen ? 1 : 0,
            height: isMenuOpen ? 'auto' : 0
          }}
          transition={{ duration: 0.3 }}
          className={`md:hidden fixed top-16 left-0 right-0 z-50 backdrop-blur-md border-b overflow-hidden transition-colors duration-500 ${
            isDarkMode 
              ? 'bg-black/95 border-white/10' 
              : 'bg-white/95 border-gray-200'
          }`}
        >
          <div className="px-4 py-4 space-y-2">
            {sections.map((section, index) => (
              <motion.button
                key={section.id}
                onClick={() => {
                  scrollToSection(index);
                  setIsMenuOpen(false);
                }}
                whileHover={{ x: 10 }}
                className={`block w-full text-left py-3 px-4 text-sm font-medium transition-colors duration-300 ${
                  currentSection === index 
                    ? (isDarkMode ? 'text-white bg-white/10' : 'text-black bg-black/10')
                    : (isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-black hover:bg-black/5')
                }`}
              >
                {section.title}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Content Sections - Fullpage on all devices */}
      <div className="relative z-10 h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.section
            key={currentSection}
            variants={sectionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            ref={el => sectionRefs.current[currentSection] = el}
            className="min-h-screen md:h-screen w-full flex items-center justify-center px-4 pt-32 md:pt-40 pb-20 relative overflow-hidden"
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
            
            <div className="max-w-6xl mx-auto text-center z-50 px-4">
            <motion.h2
                variants={getCachedTitleVariants(currentSection)}
                initial="initial"
                animate="animate"
                className="text-4xl md:text-6xl lg:text-8xl font-black mb-6 tracking-tight text-white drop-shadow-2xl"
                style={{ letterSpacing: '-0.02em' }}
              >
                {sections[currentSection].title}
            </motion.h2>
            
            <motion.p
                variants={getCachedSubtitleVariants(currentSection)}
                initial="initial"
                animate="animate"
                className="text-lg md:text-xl mb-16 max-w-3xl mx-auto leading-relaxed font-semibold text-white drop-shadow-lg"
              >
                {sections[currentSection].subtitle}
            </motion.p>
            
            
            
              {/* Dynamic Content Based on Section */}
              {sections[currentSection].content === 'behind-scenes' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  {[1, 2, 3].map((item, index) => (
                <motion.div
                  key={item}
                      custom={index}
                      variants={getCachedContentVariants(currentSection)}
                      initial="initial"
                      animate="animate"
                  whileHover={{ y: -4, scale: 1.01 }}
                      className="bg-black/40 backdrop-blur-sm rounded-none border border-white/20 
                                hover:border-white/40 transition-all duration-300 cursor-pointer group overflow-hidden"
                >
                      <div className="h-48 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-12 h-12 bg-white/20 rounded-none flex items-center justify-center backdrop-blur-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                        <h3 className="text-lg font-bold text-white mb-2">Sesión #{item}</h3>
                        <p className="text-gray-300 font-light text-sm">
                      Capturando la energía cruda de las sesiones de estudio donde nacen las melodías.
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
              )}

                            {sections[currentSection].content === 'music' && (
                <div className="relative max-w-4xl mx-auto px-4">
                  {/* Background Effects - Más sutiles */}
                  <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                  </div>
                  
                  {/* Tracks Grid - Alineado con otras secciones */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-8">
                    {spotifyLoading ? (
                      // Loading skeleton
                      Array.from({ length: 4 }).map((_, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="relative group cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/20 to-gray-900/20 backdrop-blur-xl border border-white/10"
                        >
                          <div className="relative p-4 sm:p-6 h-full">
                            <div className="w-full aspect-square rounded-xl bg-gray-700/50 animate-pulse mb-4 sm:mb-6"></div>
                            <div className="space-y-2 sm:space-y-3">
                              <div className="h-6 bg-gray-700/50 rounded animate-pulse"></div>
                              <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
                              <div className="h-6 bg-gray-700/50 rounded-full w-20 animate-pulse"></div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : spotifyError ? (
                      // Error state
                      <div className="col-span-full text-center py-8">
                        <p className="text-white text-lg">Error cargando datos de Spotify</p>
                        <p className="text-gray-400 text-sm mt-2">Usando datos estáticos</p>
                      </div>
                    ) : (
                      tracks.map((track, index) => (
                      <motion.div
                        key={track.id}
                        custom={index}
                        variants={getCachedContentVariants(currentSection)}
                        initial="initial"
                        animate="animate"
                        whileHover={{ 
                          y: -6, 
                          scale: 1.02,
                          rotateY: 2,
                          transition: { duration: 0.4, ease: "easeOut" }
                        }}
                        className={`relative group cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br ${track.gradient} backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 shadow-lg hover:shadow-2xl`}
                      >
                        {/* Glassmorphism Card */}
                        <div className="relative p-4 sm:p-5 h-full">
                          {/* Cover Art with Hover Effects */}
                          <div className="relative mb-4 sm:mb-5">
                            <motion.div
                              whileHover={{ scale: 1.05, rotate: 1 }}
                              className="w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black relative group/cover"
                            >
                              <img 
                                src={track.cover} 
                                alt={`${track.title} cover`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover/cover:scale-110"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/cover:opacity-100 transition-opacity duration-500" />
                              
                              {/* Play Button Overlay */}
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-all duration-300"
                                onClick={() => handlePlayPreview(track.id)}
                              >
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                                  {playingTrack === track.id ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="text-white sm:w-6 sm:h-6">
                                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="text-white sm:w-6 sm:h-6">
                                      <path d="M8 5v14l11-7z"/>
                                    </svg>
                                  )}
                                </div>
                              </motion.button>
                            </motion.div>
                          </div>

                          {/* Track Info - Más compacto */}
                          <div className="space-y-2 sm:space-y-3">
                            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-white/90 transition-colors duration-300">
                              {track.title}
                            </h3>
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <span className="text-gray-300 font-medium">{track.duration}</span>
                              <span className="text-white/70 font-medium">{track.streams.toLocaleString()} streams</span>
                            </div>
                            

                          </div>

                          {/* Streaming Icons - Simplificados */}
                          <motion.div
                            initial={{ opacity: 1, y: 0 }}
                            className="mt-4 flex justify-center gap-4"
                          >
                            <motion.a
                              href={track.spotify}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-10 h-10 bg-green-600/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-green-600/80 transition-all duration-300"
                            >
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                              </svg>
                            </motion.a>
                            <motion.a
                              href={track.apple}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/60 transition-all duration-300 border border-white/10"
                            >
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                              </svg>
                            </motion.a>
                            <motion.a
                              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(track.title + ' TYSAN')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-10 h-10 bg-red-600/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-600/80 transition-all duration-300"
                            >
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                              </svg>
                            </motion.a>
                          </motion.div>
                        </div>

                        {/* Mini Player - Simple */}
                        {playingTrack === track.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded-lg p-2 border border-white/20"
                          >
                            <div className="flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handlePlayPreview(track.id)}
                                className="w-6 h-6 bg-white text-black rounded-full flex items-center justify-center"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                                </svg>
                              </motion.button>
                              <span className="text-white text-xs font-medium">Reproduciendo</span>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))
                  )}
                  </div>
                </div>
              )}

              {sections[currentSection].content === 'upcoming' && (
                <div className="max-w-4xl mx-auto">
                  {isLoading ? (
                    <motion.div
                      custom={0}
                      variants={getCachedContentVariants(currentSection)}
                      initial="initial"
                      animate="animate"
                      className="flex items-center justify-center"
                    >
                      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-none animate-spin"></div>
                    </motion.div>
                  ) : upcomingRelease ? (
          <motion.div
                      custom={0}
                      variants={getCachedContentVariants(currentSection)}
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
                          <h3 className="text-2xl font-black text-white mb-4 text-center">{upcomingRelease.title}</h3>
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



              {sections[currentSection].content === 'shows' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {[1, 2].map((item, index) => (
                                        <motion.div
                      key={item}
                      custom={index}
                      variants={getCachedContentVariants(currentSection)}
                      initial="initial"
                      animate="animate"
                      whileHover={{ scale: 1.02, y: -4 }}
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
                  <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-lg mx-auto mb-8">
                    <motion.a
                      custom={0}
                      variants={getCachedContentVariants(currentSection)}
                      initial="initial"
                      animate="animate"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      href="https://www.paypal.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 px-8 
                                transition-all duration-300 text-center shadow-lg rounded-lg
                                border border-blue-400 hover:from-blue-600 hover:to-blue-700 flex items-center justify-center gap-3"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.067 8.478c.492.315.844.825.844 1.478 0 .653-.352 1.163-.844 1.478-.492.315-1.163.478-1.844.478H16.5v-2.956h1.723c.681 0 1.352.163 1.844.478zM7.5 12.5c0-.653.352-1.163.844-1.478.492-.315 1.163-.478 1.844-.478H12v2.956H10.188c-.681 0-1.352-.163-1.844-.478C7.852 13.663 7.5 13.153 7.5 12.5zM24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zM12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2z"/>
                      </svg>
                      Donar con PayPal
                    </motion.a>
                    <motion.a
                      custom={1}
                      variants={getCachedContentVariants(currentSection)}
                      initial="initial"
                      animate="animate"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      href="https://www.mercadopago.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-blue-400 to-blue-500 text-white font-bold py-4 px-8 
                                transition-all duration-300 text-center shadow-lg rounded-lg
                                border border-blue-300 hover:from-blue-500 hover:to-blue-600 flex items-center justify-center gap-3"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm-1-7H9v2h2v-2zm0-8H9v6h2V7z"/>
                      </svg>
                      Donar con MercadoPago
                    </motion.a>
                  </div>
            
            <motion.div
                    custom={2}
                    variants={getCachedContentVariants(currentSection)}
                    initial="initial"
                    animate="animate"
                    className="text-gray-400 text-sm max-w-md mx-auto font-light text-center"
            >
              Tu apoyo hace posible la creación de arte auténtico y experiencias musicales únicas. 
              Cada contribución nos acerca a nuevos proyectos y colaboraciones.
            </motion.div>
          </div>
              )}


            </div>
          </motion.section>
        </AnimatePresence>
      </div>

      {/* Font Tester - Admin Only */}
      {isUnlocked && isAdmin && showFontTester && (
        <FontTester onFontChange={handleFontChange} />
      )}

      {/* Footer - Liminal Records */}
      {isUnlocked && (
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className={`fixed bottom-0 left-0 right-0 z-30 transition-colors duration-500 ${
            isDarkMode ? 'bg-black/60' : 'bg-white/60'
          } backdrop-blur-md border-t ${
            isDarkMode ? 'border-white/10' : 'border-black/10'
          }`}
        >
          <div className="px-4 py-3 text-center">
            <p className={`text-sm font-medium transition-colors duration-500 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              © 2025 <span className="font-bold">LIMINAL RECORDS</span>
            </p>
            <p className={`text-xs font-light mt-1 transition-colors duration-500 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-500'
            }`}>
              Patagonia Argentina
            </p>
          </div>
        </motion.footer>
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
                <span className="text-4xl">🏆</span>
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