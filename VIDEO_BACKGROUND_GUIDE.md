# 🎬 Guía para Video Background - Tysan

## 🎯 **Concepto del Video**

### **Estilo Inspirado en Tame Impala**
- **Duración**: 10-15 segundos (loop perfecto)
- **Formato**: MP4, WebM (para mejor compatibilidad)
- **Resolución**: 1920x1080 (Full HD) mínimo
- **FPS**: 24-30 fps
- **Tamaño**: Máximo 5MB (optimizado para web)

## 🎨 **Concepto Visual**

### **Opción 1: Abstracto Industrial**
- **Elementos**: Líneas geométricas, formas abstractas
- **Colores**: Blanco, gris, negro
- **Movimiento**: Lento y fluido
- **Efecto**: Hipnótico y minimalista

### **Opción 2: Jazz Detroit Vibes**
- **Elementos**: Ondas de sonido, partículas flotantes
- **Colores**: Tonos azules, grises, blancos
- **Movimiento**: Orgánico y rítmico
- **Efecto**: Musical y atmosférico

### **Opción 3: Studio Session**
- **Elementos**: Equipos de estudio, luces tenues
- **Colores**: Naranjas, rojos, negros
- **Movimiento**: Cámara lenta, enfoque suave
- **Efecto**: Intimidad y creatividad

## 🛠️ **Herramientas Recomendadas**

### **Gratuitas:**
1. **DaVinci Resolve** - Edición profesional gratuita
2. **Blender** - Animaciones 3D y efectos
3. **After Effects** (trial) - Efectos avanzados
4. **Canva** - Templates básicos
5. **Pexels/Unsplash** - Videos stock gratuitos

### **De Pago:**
1. **Adobe After Effects** - Efectos profesionales
2. **Cinema 4D** - 3D avanzado
3. **Final Cut Pro** - Edición Mac
4. **Premiere Pro** - Edición completa

## 📱 **Especificaciones Técnicas**

### **Optimización Web:**
```bash
# Comando FFmpeg para optimizar
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart output.mp4
```

### **Formatos Soportados:**
- **MP4** (H.264) - Mejor compatibilidad
- **WebM** (VP9) - Mejor compresión
- **AVI** - Fallback

### **Tamaños Recomendados:**
- **Desktop**: 1920x1080
- **Tablet**: 1280x720
- **Mobile**: 854x480

## 🎬 **Tutoriales de Creación**

### **1. Video Abstracto con After Effects**
```javascript
// Efectos recomendados:
- Particular (partículas)
- Form (formas geométricas)
- Wave World (ondas)
- Fractal Noise (texturas)
```

### **2. Video con Blender (Gratuito)**
```python
# Script básico para animación
import bpy
import math

# Crear partículas
bpy.ops.mesh.primitive_plane_add()
bpy.ops.object.particle_system_add()

# Configurar animación
bpy.context.scene.frame_start = 1
bpy.context.scene.frame_end = 300
```

### **3. Video con DaVinci Resolve**
1. Crear proyecto 1920x1080
2. Importar clips o crear composición
3. Aplicar efectos de transición
4. Exportar en H.264

## 🎵 **Sincronización con Música**

### **Concepto:**
- **BPM**: 60-90 BPM (lento y atmosférico)
- **Pulso**: Sincronizar movimientos con beats
- **Intensidad**: Variar según secciones musicales

### **Herramientas de Sincronización:**
- **After Effects**: Expression controls
- **DaVinci Resolve**: Beat detection
- **Blender**: Audio strips

## 📁 **Estructura de Archivos**

```
public/
├── videos/
│   ├── tysan-background.mp4
│   ├── tysan-background.webm
│   └── tysan-background-fallback.jpg
└── assets/
    └── video-thumbnails/
```

## 🔧 **Implementación en React**

### **Código Actual:**
```jsx
{/* Video Background - Estilo Tame Impala */}
{isUnlocked && (
  <div className="fixed inset-0 z-0">
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-full object-cover opacity-20"
      style={{ filter: 'grayscale(100%) contrast(120%)' }}
    >
      <source src="/videos/tysan-background.mp4" type="video/mp4" />
      <source src="/videos/tysan-background.webm" type="video/webm" />
      {/* Fallback: Animated gradient background */}
      <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-800 animate-pulse" />
    </video>
    <div className="absolute inset-0 bg-black/40" />
  </div>
)}
```

### **Optimizaciones:**
```jsx
// Lazy loading del video
const [videoLoaded, setVideoLoaded] = useState(false);

<video
  onLoadedData={() => setVideoLoaded(true)}
  style={{ 
    opacity: videoLoaded ? 0.2 : 0,
    filter: 'grayscale(100%) contrast(120%) brightness(0.3)'
  }}
>
```

## 🎨 **Efectos Post-Producción**

### **Filtros Aplicados:**
- **Grayscale**: 100% (blanco y negro)
- **Contrast**: 120% (más definición)
- **Brightness**: 0.3 (más oscuro)
- **Blur**: 2px (suavizado)

### **Efectos Adicionales:**
- **Vignette**: Oscurecer bordes
- **Grain**: Textura sutil
- **Color Grading**: Tonos fríos

## 📊 **Performance y Optimización**

### **Técnicas de Optimización:**
1. **Compresión**: H.264 con CRF 23
2. **Lazy Loading**: Cargar solo cuando se desbloquea
3. **Fallback**: Imagen estática como respaldo
4. **CDN**: Servir desde CDN para mejor velocidad

### **Métricas Objetivo:**
- **Tiempo de carga**: < 2 segundos
- **Tamaño archivo**: < 5MB
- **FPS**: 24-30 fps constante
- **CPU usage**: < 10%

## 🎯 **Próximos Pasos**

### **1. Crear el Video**
- Elegir concepto (Abstracto Industrial recomendado)
- Crear en After Effects/Blender/DaVinci
- Optimizar para web

### **2. Implementar**
- Subir a `/public/videos/`
- Actualizar rutas en código
- Probar en diferentes dispositivos

### **3. Optimizar**
- Comprimir video
- Implementar lazy loading
- Agregar fallbacks

### **4. Testear**
- Performance en móviles
- Compatibilidad de navegadores
- Experiencia de usuario

---

**Nota**: El video debe ser sutil y no distraer del contenido principal. El objetivo es crear atmósfera sin sobrecargar la experiencia. 