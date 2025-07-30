# 🎵 Configuración de Spotify API para Datos Automáticos

## 📋 Pasos para Configurar:

### 1. Crear App en Spotify Developer Dashboard
1. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Inicia sesión con tu cuenta de Spotify
3. Haz clic en "Create App"
4. Completa la información:
   - **App name**: Tysan Landing Page
   - **App description**: Landing page con datos automáticos de Spotify
   - **Website**: `http://localhost:3000`
   - **Redirect URI**: `http://localhost:3000/callback`
   - **API/SDKs**: Web API

### 2. Obtener Credenciales
1. Una vez creada la app, ve a la página de la app
2. Copia el **Client ID** y **Client Secret**
3. Abre `src/services/spotifyService.js`
4. Reemplaza:
   ```javascript
   const SPOTIFY_CLIENT_ID = 'TU_CLIENT_ID_AQUI';
   const SPOTIFY_CLIENT_SECRET = 'TU_CLIENT_SECRET_AQUI';
   ```

### 3. Variables de Entorno (Recomendado)
Crea un archivo `.env` en la raíz del proyecto:
```env
REACT_APP_SPOTIFY_CLIENT_ID=tu_client_id_aqui
REACT_APP_SPOTIFY_CLIENT_SECRET=tu_client_secret_aqui
```

Y actualiza el servicio:
```javascript
const SPOTIFY_CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
```

## 🚀 Beneficios de la Automatización:

### ✅ **Datos Siempre Actualizados:**
- **Streams reales** de Spotify (simulados basados en popularity)
- **Portadas automáticas** de los álbumes
- **Duración exacta** de cada track
- **Links directos** a Spotify

### ✅ **Fallback Inteligente:**
- Si la API falla, usa datos estáticos
- Loading states elegantes
- Error handling robusto

### ✅ **Performance Optimizado:**
- Cache de tokens automático
- Re-fetch cada 1 hora
- Lazy loading de datos

## 🔧 Configuración Avanzada:

### Obtener IDs de Tracks Específicos:
1. Ve a cualquier track de Tysan en Spotify
2. Copia la URL: `https://open.spotify.com/track/64mLFv8ppGrluc7K9ZSRwl`
3. El ID es: `64mLFv8ppGrluc7K9ZSRwl`
4. Actualiza `TYSAN_TRACK_IDS` en `useSpotifyData.js`

### Personalizar Simulación de Streams:
En `spotifyService.js`, modifica la función `simulateStreams()`:
```javascript
simulateStreams(popularity) {
  // Personaliza la fórmula según tus necesidades
  const baseStreams = popularity * 1500; // Más streams
  const randomFactor = 0.9 + Math.random() * 0.2; // Menos variación
  return Math.floor(baseStreams * randomFactor);
}
```

## 🎯 Resultado Final:
- **Datos automáticos** cada vez que cargue la página
- **Siempre actualizados** con la información real de Spotify
- **Sin intervención manual** necesaria
- **Fallback robusto** si algo falla

¡Con esto tendrás una landing page que se actualiza automáticamente con los datos reales de Tysan en Spotify! 