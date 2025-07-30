// Configuración de la Landing Page de Tysan
// Edita estos valores para personalizar el contenido

export const config = {
  // Información del Artista
  artist: {
    name: "TYSAN",
    genre: "Jazz Detroit",
    description: "Música que trasciende fronteras",
    email: "liminalrecords.ar@gmail.com",
    location: "Buenos Aires, Argentina"
  },

  // Redes Sociales (reemplaza los "#" con los enlaces reales)
  socialMedia: {
    instagram: "#",
    tiktok: "#", 
    youtube: "#",
    spotify: "#"
  },

  // Próximo Lanzamiento
  upcomingRelease: {
    title: "Untitled",
    releaseDate: "2025-02-15",
    description: "El próximo lanzamiento de Tysan promete llevar el jazz detroit a nuevos horizontes.",
    albumArt: "https://via.placeholder.com/300x300/4D4E6A/FFFFFF?text=UNTITLED",
    previewUrl: "https://example.com/preview.mp3"
  },

  // Shows en Vivo
  shows: [
    {
      date: "2025-02-15",
      title: "Show #1",
      description: "Una noche de jazz detroit en su máxima expresión.",
      ticketUrl: "#",
      infoUrl: "#"
    },
    {
      date: "2025-03-20", 
      title: "Show #2",
      description: "Experiencia musical única en vivo.",
      ticketUrl: "#",
      infoUrl: "#"
    }
  ],

  // Tracks de Música
  tracks: [
    {
      title: "Track 1",
      duration: "3:45",
      genre: "Jazz Detroit"
    },
    {
      title: "Track 2", 
      duration: "4:12",
      genre: "Jazz Detroit"
    },
    {
      title: "Track 3",
      duration: "3:28", 
      genre: "Jazz Detroit"
    },
    {
      title: "Track 4",
      duration: "5:03",
      genre: "Jazz Detroit"
    }
  ],

  // Enlaces de Donación
  donations: {
    paypal: "https://www.paypal.com",
    mercadopago: "https://www.mercadopago.com"
  },

  // Configuración de Mailchimp (reemplazar con datos reales)
  mailchimp: {
    apiKey: "YOUR_MAILCHIMP_API_KEY",
    listId: "YOUR_MAILCHIMP_LIST_ID",
    server: "YOUR_MAILCHIMP_SERVER" // ej: "us1"
  },

  // Configuración de Spotify API (opcional)
  spotify: {
    clientId: "YOUR_SPOTIFY_CLIENT_ID",
    clientSecret: "YOUR_SPOTIFY_CLIENT_SECRET"
  },

  // Colores del tema
  colors: {
    primary: "#111339",
    secondary: "#0E0F0E", 
    accent: "#4D4E6A",
    text: "#FFFFFF",
    textSecondary: "#9CA3AF"
  }
};

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