// Spotify Web API Service
// Necesitas crear una app en: https://developer.spotify.com/dashboard

const SPOTIFY_CLIENT_ID = '8655a44e54f5429990da4f90a8521eda';
const SPOTIFY_CLIENT_SECRET = '6f7169e1585e440a9ddb675dbb33ce0f';

class SpotifyService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // Obtener token de acceso
  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry > Date.now()) {
      return this.accessToken;
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET)
      },
      body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in * 1000);
    
    return this.accessToken;
  }

  // Obtener datos del artista Tysan
  async getArtistData() {
    const token = await this.getAccessToken();
    
    // Buscar artista Tysan
    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=Tysan&type=artist&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    const searchData = await searchResponse.json();
    const artistId = searchData.artists.items[0]?.id;
    
    if (!artistId) {
      throw new Error('Artista Tysan no encontrado');
    }

    // Obtener top tracks del artista
    const tracksResponse = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=AR`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    const tracksData = await tracksResponse.json();
    
    return {
      artist: searchData.artists.items[0],
      topTracks: tracksData.tracks.slice(0, 4) // Top 4 tracks
    };
  }

  // Obtener streams de tracks específicos (requiere IDs de tracks)
  async getTrackStreams(trackIds) {
    const token = await this.getAccessToken();
    
    const tracksResponse = await fetch(
      `https://api.spotify.com/v1/tracks?ids=${trackIds.join(',')}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    const tracksData = await tracksResponse.json();
    
    return tracksData.tracks.map(track => ({
      id: track.id,
      name: track.name,
      duration: this.formatDuration(track.duration_ms),
      popularity: track.popularity,
      album: track.album,
      external_urls: track.external_urls
    }));
  }

  // Formatear duración de ms a mm:ss
  formatDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  }

  // Simular streams basado en popularity (Spotify no da streams reales)
  simulateStreams(popularity) {
    // Popularity va de 0-100, simulamos streams realistas
    const baseStreams = popularity * 1000;
    const randomFactor = 0.8 + Math.random() * 0.4; // ±20% variación
    return Math.floor(baseStreams * randomFactor);
  }
}

export default new SpotifyService(); 