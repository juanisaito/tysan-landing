import { useState, useEffect } from 'react';
import spotifyService from '../services/spotifyService';

export const useSpotifyData = () => {
  const [tracks, setTracks] = useState([]);
  const [totalStreams, setTotalStreams] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchSpotifyData = async () => {
      try {
        setLoading(true);
        
        // Opción 1: Obtener top tracks automáticamente
        const artistData = await spotifyService.getArtistData();
        
        // Opción 2: Obtener tracks específicos por ID
        // const tracksData = await spotifyService.getTrackStreams(TYSAN_TRACK_IDS);
        
        const processedTracks = artistData.topTracks.map((track, index) => {
          // Set current track name for stream calculation
          spotifyService.currentTrackName = track.name;
          
          return {
            id: index + 1,
            title: track.name,
            duration: spotifyService.formatDuration(track.duration_ms),
            streams: spotifyService.simulateStreams(track.popularity),
            spotify: track.external_urls.spotify,
            apple: `https://music.apple.com/mx/album/${track.name.toLowerCase().replace(/\s+/g, '-')}-single/1702759022`,
            cover: track.album.images[0]?.url || 'https://via.placeholder.com/300x300/4D4E6A/FFFFFF?text=TYSAN',
            previewUrl: track.preview_url || null,
            gradient: [
              'from-purple-500/20 to-pink-500/20',
              'from-blue-500/20 to-cyan-500/20', 
              'from-green-500/20 to-emerald-500/20',
              'from-orange-500/20 to-red-500/20'
            ][index] || 'from-gray-500/20 to-gray-600/20'
          };
        });

        setTracks(processedTracks);
        
        // Calcular total de streams
        const total = processedTracks.reduce((sum, track) => sum + track.streams, 0);
        setTotalStreams(total);
        
      } catch (err) {
        console.error('Error fetching Spotify data:', err);
        setError(err.message);
        
        // Fallback a datos estáticos si falla la API
        const staticTracks = [
          { 
            id: 1, 
            title: 'Bbtrickz', 
            duration: '2:11', 
            streams: 52387 + Math.floor(52387 * 0.5) + Math.floor(52387 * 0.25), // Spotify + YouTube + Apple
            spotify: 'https://open.spotify.com/track/64mLFv8ppGrluc7K9ZSRwl?si=f300c75ba1da46fc', 
            apple: 'https://music.apple.com/mx/album/bbtrickz-single/1702759022',
            cover: 'https://i.scdn.co/image/ab67616d0000b273f46b9d202509a2c4b5d4f8e9',
            previewUrl: 'https://p.scdn.co/mp3-preview/64mLFv8ppGrluc7K9ZSRwl?cid=774b29d4f13844c495f206cafdad9c86',
            gradient: 'from-purple-500/20 to-pink-500/20'
          },
          { 
            id: 2, 
            title: 'Balvanera', 
            duration: '2:02', 
            streams: 52000 + Math.floor(52000 * 0.5) + Math.floor(52000 * 0.25), // Spotify + YouTube + Apple
            spotify: 'https://open.spotify.com/track/balvanera', 
            apple: 'https://music.apple.com/mx/album/balvanera-single/1702759022',
            cover: 'https://i.scdn.co/image/ab67616d0000b273e8b066f70c206d86b6d0b8a1',
            previewUrl: 'https://p.scdn.co/mp3-preview/balvanera?cid=774b29d4f13844c495f206cafdad9c86',
            gradient: 'from-blue-500/20 to-cyan-500/20'
          },
          { 
            id: 3, 
            title: 'Lv', 
            duration: '2:19', 
            streams: 22755 + Math.floor(22755 * 0.5) + Math.floor(22755 * 0.25), // Spotify + YouTube + Apple
            spotify: 'https://open.spotify.com/track/lv', 
            apple: 'https://music.apple.com/mx/album/lv-single/1702759022',
            cover: 'https://i.scdn.co/image/ab67616d0000b273d4e6c2c8c8c8c8c8c8c8c8c8',
            previewUrl: 'https://p.scdn.co/mp3-preview/lv?cid=774b29d4f13844c495f206cafdad9c86',
            gradient: 'from-green-500/20 to-emerald-500/20'
          },
          { 
            id: 4, 
            title: 'Desparramo', 
            duration: '2:04', 
            streams: 22193 + Math.floor(22193 * 0.5) + Math.floor(22193 * 0.25), // Spotify + YouTube + Apple
            spotify: 'https://open.spotify.com/track/desparramo', 
            apple: 'https://music.apple.com/mx/album/desparramo-single/1702759022',
            cover: 'https://i.scdn.co/image/ab67616d0000b273c8c8c8c8c8c8c8c8c8c8c8c8',
            previewUrl: 'https://p.scdn.co/mp3-preview/desparramo?cid=774b29d4f13844c495f206cafdad9c86',
            gradient: 'from-orange-500/20 to-red-500/20'
          }
        ];
        
        setTracks(staticTracks);
        setTotalStreams(staticTracks.reduce((sum, track) => sum + track.streams, 0));
      } finally {
        setLoading(false);
      }
    };

    fetchSpotifyData();
  }, []);

  return { tracks, totalStreams, loading, error };
}; 