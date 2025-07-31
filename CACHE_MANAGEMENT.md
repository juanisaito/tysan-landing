# 🗂️ Gestión de Caché - TYSAN Landing Page

## Problemas Comunes de Caché

### 1. **No se ven los cambios después de actualizar**
- El navegador está usando una versión cacheada
- El Service Worker está sirviendo contenido antiguo
- Los archivos estáticos no se han actualizado

### 2. **La página siempre muestra lo mismo**
- localStorage no se está limpiando
- Cache del navegador está persistente
- Service Worker no se actualiza

## Soluciones

### 🔧 **Para Desarrolladores**

#### Opción 1: Cache Manager (Recomendado)
Si eres admin, usa el panel de control en la esquina superior derecha:
- 🗑️ **Limpiar Cache**: Elimina todo el caché del navegador
- 🔄 **Forzar Update**: Desregistra el Service Worker y recarga
- 📄 **Recargar**: Recarga la página normalmente

#### Opción 2: Consola del Navegador
```javascript
// Limpiar caché
window.clearTysanCache()

// Forzar actualización
window.forceTysanUpdate()

// Limpiar localStorage
localStorage.clear()
```

#### Opción 3: Página de Limpieza
Visita `/clear-cache.html` para herramientas de limpieza manual.

### 🌐 **Para Usuarios Finales**

#### Navegador Chrome/Edge
1. Presiona `Ctrl + Shift + R` (Windows) o `Cmd + Shift + R` (Mac)
2. O ve a `F12` → Network → ✅ "Disable cache"
3. O `Ctrl + Shift + Delete` → Limpiar caché

#### Navegador Firefox
1. Presiona `Ctrl + F5` (Windows) o `Cmd + Shift + R` (Mac)
2. O `Ctrl + Shift + Delete` → Limpiar caché

#### Navegador Safari
1. Presiona `Cmd + Option + R`
2. O `Cmd + Option + E` → Limpiar caché

## Estructura de Caché

### Service Worker
- **Versión actual**: `tysan-cache-v3`
- **Archivos estáticos**: CSS, JS, imágenes, videos
- **Archivos dinámicos**: API responses, otros recursos

### localStorage
- `tysan_unlocked_email`: Email del usuario
- `tysan_unlock_date`: Fecha de desbloqueo

### SessionStorage
- Datos temporales de sesión

## Scripts de Build

```bash
# Build de producción (sin source maps)
npm run build:prod

# Build limpio (elimina build anterior)
npm run build:clean

# Preparar para deploy
npm run deploy:prep
```

## Configuración de Versiones

### Archivo: `src/config.js`
```javascript
const APP_VERSION = '1.0.3'; // Incrementar para forzar actualizaciones
```

### Service Worker: `public/sw.js`
```javascript
const CACHE_NAME = 'tysan-cache-v3'; // Incrementar versión
```

## Monitoreo de Caché

### Logs en Consola
- ✅ **SW registrado**: Service Worker activo
- 🔄 **Nueva versión disponible**: Actualización pendiente
- 🗑️ **Eliminando cache**: Limpieza en progreso
- 📦 **Sirviendo desde cache**: Recurso cacheado

### Herramientas de Desarrollo
1. **Chrome DevTools** → Application → Storage
2. **Firefox DevTools** → Storage
3. **Safari DevTools** → Storage

## Troubleshooting

### La página no carga
```javascript
// Deshabilitar Service Worker temporalmente
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister());
});
```

### Cambios no aparecen
```javascript
// Forzar recarga sin caché
window.location.reload(true);
```

### Problemas de audio/video
```javascript
// Limpiar caché de media
caches.keys().then(names => {
  names.forEach(name => {
    if (name.includes('media')) caches.delete(name);
  });
});
```

## Mejores Prácticas

### Para Desarrolladores
1. **Incrementar versión** en `config.js` antes de cada deploy
2. **Usar build:clean** para builds de producción
3. **Probar en modo incógnito** para evitar caché
4. **Monitorear logs** de Service Worker

### Para Usuarios
1. **Usar Ctrl+Shift+R** para recargas sin caché
2. **Limpiar caché** regularmente si hay problemas
3. **Reportar problemas** con información del navegador

## Contacto

Si tienes problemas persistentes con el caché:
- Revisa la consola del navegador para errores
- Intenta en modo incógnito
- Contacta al equipo de desarrollo con detalles del problema 