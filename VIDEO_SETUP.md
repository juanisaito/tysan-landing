# 🎬 Configuración del Video de Fondo

## 📁 Ubicación de Archivos
Coloca tu video de fondo en: `public/videos/`

## 📋 Formatos Soportados
- **MP4** (recomendado): `tysan-background.mp4`
- **WebM** (alternativo): `tysan-background.webm`

## 🎯 Especificaciones Recomendadas
- **Duración**: 10-15 segundos (loop)
- **Resolución**: 1920x1080 (Full HD)
- **Tamaño**: < 5MB para carga rápida
- **FPS**: 24-30 fps
- **Codec**: H.264 para MP4, VP9 para WebM

## 🛠️ Optimización con FFmpeg

### MP4 Optimizado
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 128k -movflags +faststart -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" public/videos/tysan-background.mp4
```

### WebM Optimizado
```bash
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus -b:a 128k -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" public/videos/tysan-background.webm
```

## 🎨 Conceptos Visuales Sugeridos

### 1. Abstract Industrial
- Formas geométricas en movimiento
- Líneas y patrones dinámicos
- Colores monocromáticos

### 2. Jazz Detroit Vibes
- Luces de neón
- Siluetas en movimiento
- Ambiente urbano nocturno

### 3. Studio Session
- Equipos de música
- Luces de estudio
- Ambiente de grabación

## 📱 Consideraciones Móviles
- El video se desactiva automáticamente en dispositivos móviles para ahorrar batería
- Se muestra un gradiente animado como fallback

## 🔧 Personalización
Puedes modificar los filtros CSS en `src/App.js`:
```javascript
style={{ filter: 'grayscale(100%) contrast(120%)' }}
```

## 📊 Monitoreo de Performance
- El video se carga de forma lazy
- Se optimiza automáticamente según la conexión
- Fallback automático si el video no carga

## 🎵 Sincronización con Música
Si quieres sincronizar el video con música:
1. Usa la misma duración que el loop de música
2. Sincroniza los beats con cambios visuales
3. Considera usar Web Audio API para sincronización precisa 