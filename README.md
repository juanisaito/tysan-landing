# 🎵 Tysan - Landing Page Musical

Una landing page moderna y elegante para el artista musical **Tysan** de **Liminal Records**, con efecto zipper, scroll suave por secciones y sistema de métricas integrado.

## ✨ Características

- **Efecto Zipper**: Desbloqueo elegante al ingresar email
- **Scroll Suave por Secciones**: Navegación fluida sin slides
- **Sistema de Acceso Persistente**: localStorage para recordar usuarios
- **Integración Google Sheets**: Recolección automática de emails
- **Métricas Completas**: Google Analytics, Facebook Pixel, Hotjar
- **Reproductor de Música**: Preview de próximos lanzamientos
- **Diseño Responsive**: Optimizado para mobile y desktop
- **Sin Efectos de Audio**: Experiencia visual limpia
- **Carga Rápida**: Optimizado para rendimiento

## 🚀 Instalación

1. **Clona el repositorio**
```bash
git clone [tu-repositorio]
cd music-artist-landing
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Inicia el servidor de desarrollo**
```bash
npm start
```

4. **Abre en tu navegador**
```
http://localhost:3000
```

## ⚙️ Configuración

### 1. Personalización Básica

Edita el archivo `src/config.js` para personalizar:

```javascript
export const config = {
  artist: {
    name: "TYSAN",
    genre: "Jazz Detroit",
    description: "Música que trasciende fronteras",
    email: "liminalrecords.ar@gmail.com",
    location: "Buenos Aires, Argentina"
  },
  // ... más configuraciones
};
```

### 2. Integración Google Sheets

**Paso 1: Crear Google Apps Script**

1. Ve a [Google Apps Script](https://script.google.com/)
2. Crea un nuevo proyecto
3. Copia el código de `src/services/emailService.js` (googleAppsScriptExample)
4. Reemplaza `YOUR_SPREADSHEET_ID` con tu ID de hoja de cálculo
5. Despliega como web app

**Paso 2: Configurar el servicio**

Edita `src/services/emailService.js`:

```javascript
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

**Paso 3: Crear Google Sheets**

Crea una hoja de cálculo con estas columnas:
- A: Email
- B: Timestamp
- C: User Agent
- D: Referrer
- E: Page

### 3. Google Analytics

**Paso 1: Crear cuenta de Google Analytics**

1. Ve a [Google Analytics](https://analytics.google.com/)
2. Crea una nueva propiedad
3. Obtén tu Measurement ID

**Paso 2: Configurar tracking**

Edita `public/analytics.html`:

```javascript
gtag('config', 'G-XXXXXXXXXX'); // Reemplaza con tu ID
```

**Paso 3: Integrar en index.html**

Agrega esto al `<head>` de `public/index.html`:

```html
<script src="%PUBLIC_URL%/analytics.html"></script>
```

### 4. Redes Sociales

Reemplaza los enlaces en `config.js`:

```javascript
socialMedia: {
  instagram: "https://instagram.com/tysan",
  tiktok: "https://tiktok.com/@tysan", 
  youtube: "https://youtube.com/tysan",
  spotify: "https://open.spotify.com/artist/tysan"
}
```

## 📱 Secciones Disponibles

### 1. Detrás de Cámaras
- Sesiones de estudio
- Proceso creativo
- Momentos íntimos

### 2. Próximos Lanzamientos
- Preview de "Untitled"
- Reproductor de música
- Fecha de lanzamiento

### 3. Música
- Lista de tracks
- Género: Jazz Detroit
- Duración de canciones

### 4. Shows en Vivo
- Próximas fechas
- Enlaces para comprar tickets
- Información de eventos

### 5. Apoya el Arte
- Donaciones PayPal
- Donaciones MercadoPago
- Mensaje de agradecimiento

### 6. Contacto
- Email de Liminal Records
- Ubicación
- Redes sociales

## 🔄 Sistema de Acceso

### **LocalStorage (Implementado)**
- ✅ Guarda email automáticamente
- ✅ Acceso instantáneo en visitas posteriores
- ✅ No requiere login adicional
- ✅ Funciona offline

### **Opcional: Sistema de Login**
Si quieres más control, puedes implementar:

1. **Firebase Authentication**
2. **Dashboard de métricas**
3. **Gestión de usuarios**

## 📊 Métricas y Analytics

### **Datos Recolectados**
- ✅ Emails de usuarios
- ✅ Tiempo en cada sección
- ✅ Clics en botones
- ✅ Interacciones con reproductor
- ✅ Fuente de tráfico
- ✅ Dispositivo usado

### **Herramientas Integradas**
- ✅ **Google Analytics**: Métricas generales
- ✅ **Google Sheets**: Base de datos de emails
- ✅ **Facebook Pixel**: Retargeting
- ✅ **Hotjar**: Heatmaps y grabaciones
- ✅ **Métricas Locales**: Historial de navegación

### **Dashboard de Métricas**
Para ver tus métricas:

1. **Google Analytics**: Métricas en tiempo real
2. **Google Sheets**: Lista de emails
3. **Console del navegador**: `emailService.getLocalMetrics()`

## 🎨 Personalización Visual

### Colores del Tema

Los colores principales están definidos en `tailwind.config.js`:

```javascript
colors: {
  primary: '#111339',    // Azul oscuro
  secondary: '#0E0F0E',  // Negro
  accent: '#4D4E6A',     // Azul grisáceo
}
```

### Efectos CSS

Los efectos están en `src/App.css`:

- **Glassmorphism**: `.glass`, `.glass-light`
- **Hover Effects**: `.hover-lift`, `.card-hover`
- **Animaciones**: `.gradient-animate`, `.particle`
- **Responsive**: `.mobile-optimized`, `.mobile-text`

## 📊 Optimización Mobile

La página está optimizada para dispositivos móviles con:

- Scroll suave por secciones
- Navegación por dots adaptativa
- Textos optimizados para pantallas pequeñas
- Efectos táctiles mejorados
- Carga rápida de assets

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm start

# Build para producción
npm run build

# Tests
npm test

# Eject (solo si necesitas configuración avanzada)
npm run eject
```

## 📁 Estructura del Proyecto

```
src/
├── App.js                    # Componente principal
├── App.css                   # Estilos y efectos
├── config.js                 # Configuración editable
├── services/
│   └── emailService.js       # Servicio de emails y métricas
├── index.js                  # Punto de entrada
└── index.css                 # Estilos globales

public/
├── index.html               # HTML principal
├── analytics.html           # Configuración de analytics
└── favicon.ico             # Icono del sitio
```

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Sube la carpeta build/ a Netlify
```

### GitHub Pages
```bash
npm run build
# Configura GitHub Actions para deploy automático
```

## 🎵 Contenido Musical

### Agregar Música Real

1. Reemplaza los placeholders en `config.js`
2. Agrega archivos de audio en `public/audio/`
3. Actualiza las URLs en la configuración

### Integración con APIs

- **Spotify**: Para datos de artistas y releases
- **YouTube**: Para videos de shows
- **SoundCloud**: Para tracks adicionales

## 🔒 Seguridad y Privacidad

- ✅ Emails encriptados en Google Sheets
- ✅ No se almacenan datos sensibles
- ✅ Cumple con GDPR
- ✅ HTTPS obligatorio en producción
- ✅ Política de privacidad incluida

## 📈 Analytics Avanzados

### **Eventos Personalizados**
```javascript
// Trackear desbloqueo
emailService.trackNavigation('unlock');

// Trackear vista de sección
emailService.trackNavigation('behind-scenes');

// Trackear clic en botón
emailService.trackClick('donate', 'support');
```

### **Métricas Locales**
```javascript
// Obtener métricas del usuario
const metrics = emailService.getLocalMetrics();
console.log(metrics);
// {
//   totalVisits: 15,
//   sectionsVisited: ['behind-scenes', 'music', 'contact'],
//   firstUnlock: '2025-01-15T10:30:00.000Z',
//   lastVisit: '2025-01-20T14:45:00.000Z'
// }
```

## 🐛 Troubleshooting

### Problemas Comunes

1. **Emails no se envían a Google Sheets**
   - Verifica la URL del Google Apps Script
   - Revisa los permisos de la hoja de cálculo
   - Verifica la consola del navegador

2. **Google Analytics no funciona**
   - Verifica el Measurement ID
   - Asegúrate de que analytics.html esté incluido
   - Revisa la consola para errores

3. **LocalStorage no funciona**
   - Verifica que el navegador soporte localStorage
   - Limpia el caché del navegador
   - Verifica el modo incógnito

4. **Scroll no funciona suavemente**
   - Verifica que no haya conflictos de CSS
   - Asegúrate de que las secciones tengan `min-h-screen`
   - Revisa la consola para errores de JavaScript

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 📞 Soporte

Para soporte técnico:
- Email: liminalrecords.ar@gmail.com
- Issues: [GitHub Issues](link-a-tu-repo)

## 🎯 Próximas Mejoras

- [ ] Dashboard de métricas en tiempo real
- [ ] Sistema de notificaciones push
- [ ] Integración con Spotify API real
- [ ] Sistema de comentarios
- [ ] Galería de fotos interactiva
- [ ] Chat en vivo para shows

---

**Desarrollado para Liminal Records** 🎵
