// Script de prueba para verificar la conexión con Spotify API
import spotifyService from '../services/spotifyService';

export const testSpotifyConnection = async () => {
  console.log('🎵 Probando conexión con Spotify API...');
  
  try {
    // 1. Probar autenticación
    console.log('1️⃣ Obteniendo token de acceso...');
    const token = await spotifyService.getAccessToken();
    console.log('✅ Token obtenido:', token ? 'SUCCESS' : 'FAILED');
    
    // 2. Probar búsqueda de artista
    console.log('2️⃣ Buscando artista Tysan...');
    const artistData = await spotifyService.getArtistData();
    console.log('✅ Artista encontrado:', artistData.artist.name);
    console.log('✅ Top tracks:', artistData.topTracks.length);
    
    // 3. Mostrar información de tracks
    console.log('3️⃣ Información de tracks:');
    artistData.topTracks.forEach((track, index) => {
      console.log(`   ${index + 1}. ${track.name} - ${spotifyService.formatDuration(track.duration_ms)} - Popularity: ${track.popularity}`);
    });
    
    // 4. Probar simulación de streams
    console.log('4️⃣ Simulando streams...');
    const totalStreams = artistData.topTracks.reduce((sum, track) => {
      const streams = spotifyService.simulateStreams(track.popularity);
      console.log(`   ${track.name}: ${streams.toLocaleString()} streams`);
      return sum + streams;
    }, 0);
    console.log('✅ Total streams simulados:', totalStreams.toLocaleString());
    
    console.log('🎉 ¡Conexión con Spotify exitosa!');
    return { success: true, data: artistData };
    
  } catch (error) {
    console.error('❌ Error en la conexión con Spotify:', error.message);
    return { success: false, error: error.message };
  }
};

// Función para probar desde la consola del navegador
window.testSpotify = testSpotifyConnection; 