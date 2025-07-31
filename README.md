# TYSAN - Landing Page Musical

Landing page oficial para TYSAN, artista de Jazz Detroit desde Patagonia Argentina.

## 🚀 Optimizaciones Implementadas

### Performance & Cache
- ✅ **Service Worker** para cache offline y carga más rápida
- ✅ **Lazy Loading** para imágenes con Intersection Observer
- ✅ **Bundle Optimization** con análisis de tamaño
- ✅ **Font Loading** optimizado con single import
- ✅ **Error Boundaries** para manejo robusto de errores

### Seguridad
- ✅ **Credenciales API** centralizadas en config.js
- ✅ **Variables de entorno** para configuración segura
- ✅ **Sanitización** de inputs de usuario

### Código Limpio
- ✅ **Eliminación de duplicados** en imports de fuentes
- ✅ **Componentes reutilizables** (LazyImage, ErrorBoundary)
- ✅ **Utilidades de performance** centralizadas
- ✅ **Configuración centralizada** en config.js

## 🛠️ Tecnologías

- **React 19** con Hooks modernos
- **Framer Motion** para animaciones fluidas
- **Tailwind CSS** para estilos
- **Spotify Web API** para datos en tiempo real
- **Service Worker** para cache offline

## 📦 Instalación

```bash
npm install
npm start
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm start

# Build de producción
npm run build

# Análisis de bundle
npm run build:analyze

# Linting
npm run lint
npm run lint:fix

# Formateo de código
npm run format

# Análisis de performance
npm run performance
```

## 🎨 Características

### Diseño
- **Responsive** para todos los dispositivos
- **Animaciones fluidas** con Framer Motion
- **Tipografías dinámicas** (15 fuentes disponibles)
- **Video background** optimizado
- **Glassmorphism** y efectos modernos

### Funcionalidad
- **Integración Spotify** en tiempo real
- **Sistema de desbloqueo** por email
- **Reproductor de preview** integrado
- **Navegación fullpage** suave
- **Modo admin** para testing

### Performance
- **Lazy loading** de imágenes
- **Cache offline** con Service Worker
- **Optimización de fuentes**
- **Error handling** robusto
- **Bundle optimizado**

## 🎵 Secciones

1. **Detrás de Cámaras** - Proceso creativo
2. **Música** - Discografía con Spotify API
3. **Próximo Lanzamiento** - Preview exclusivo
4. **Shows en Vivo** - Próximas fechas
5. **Apoia el Arte** - Sistema de donaciones

## 🔐 Configuración

### Variables de Entorno
Crea un archivo `.env` en la raíz:

```env
REACT_APP_SPOTIFY_CLIENT_ID=tu_client_id
REACT_APP_SPOTIFY_CLIENT_SECRET=tu_client_secret
REACT_APP_ARTIST_NAME=TYSAN
REACT_APP_LABEL_NAME=LIMINAL RECORDS
REACT_APP_REGION=Patagonia Argentina
```

### Spotify API
1. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Crea una nueva aplicación
3. Copia Client ID y Client Secret
4. Agrega a variables de entorno

## 📱 Responsive

- **Mobile First** design
- **Touch gestures** optimizados
- **Performance** adaptativa
- **Animaciones** reducidas en móvil

## 🚀 Deploy

```bash
npm run build
```

Los archivos optimizados estarán en `/build`

## 📊 Métricas de Performance

- **Lighthouse Score**: 90+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🎯 Roadmap

- [ ] PWA con manifest
- [ ] Analytics integrado
- [ ] Más plataformas de streaming
- [ ] Sistema de newsletter
- [ ] Galería de fotos
- [ ] Blog integrado

## 📄 Licencia

© 2025 LIMINAL RECORDS - Patagonia Argentina
