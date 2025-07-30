# 📧 Configuración del Sistema de Emails

## 🎯 Opciones Disponibles

### 1. **Formspree** (Recomendado - Más Fácil)
**Ventajas**: Configuración en 2 minutos, gratis hasta 50 emails/mes
**Desventajas**: Límite en plan gratuito

#### Configuración:
1. Ve a [formspree.io](https://formspree.io)
2. Crea una cuenta gratuita
3. Crea un nuevo formulario
4. Copia el ID del formulario (ej: `xrgjqkqr`)
5. Reemplaza `TU_FORM_ID` en `src/utils/emailService.js`

```javascript
// En src/utils/emailService.js, línea 67:
const response = await fetch('https://formspree.io/f/xrgjqkqr', {
```

### 2. **Google Sheets** (Recomendado - Profesional)
**Ventajas**: Totalmente gratis, datos en Google Sheets
**Desventajas**: Requiere configuración inicial

#### Configuración:
1. Crea un Google Sheet
2. Ve a Extensiones > Apps Script
3. Pega este código:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(),
    data.email,
    data.source || 'Tysan Landing Page'
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Despliega como web app
5. Copia la URL y reemplaza en el código

### 3. **EmailJS** (Intermedio)
**Ventajas**: Envío directo a email, templates personalizables
**Desventajas**: Requiere configuración de templates

#### Configuración:
1. Ve a [emailjs.com](https://emailjs.com)
2. Crea cuenta gratuita
3. Configura servicio de email (Gmail, Outlook, etc.)
4. Crea template de email
5. Obtén Service ID, Template ID y User ID
6. Descomenta las líneas en `emailService.js`

### 4. **Netlify Functions** (Avanzado)
**Ventajas**: Totalmente personalizable, gratis
**Desventajas**: Requiere conocimientos técnicos

## 🔧 Integración en el Código

### Paso 1: Importar el servicio
En `src/App.js`, agrega:

```javascript
import { sendEmail } from './utils/emailService';
```

### Paso 2: Modificar handleSubmit
Reemplaza la función `handleSubmit` en `src/App.js`:

```javascript
const handleSubmit = useCallback(async (e) => {
  e.preventDefault();
  if (/\S+@\S+\.\S+/.test(email)) {
    setIsLoading(true);
    
    try {
      const result = await sendEmail(email);
      
      if (result.success) {
        // Guardar email en localStorage
        localStorage.setItem('tysan_unlocked_email', email);
        setIsUnlocked(true);
        controls.start({
          opacity: 0,
          y: -50,
          transition: { duration: 0.8, ease: "easeInOut" }
        });
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Error al enviar el correo. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  } else {
    setError('Por favor ingresa un correo válido');
  }
}, [email, controls]);
```

## 📊 Monitoreo y Analytics

### Google Sheets (Recomendado)
- Todos los emails se guardan automáticamente
- Puedes crear gráficos y análisis
- Fácil exportación a CSV

### Formspree Dashboard
- Dashboard web para ver emails
- Estadísticas básicas
- Notificaciones por email

## 🔒 Privacidad y GDPR

### Información Recolectada
- Email del usuario
- Timestamp de registro
- Fuente (Tysan Landing Page)

### Cumplimiento
- Los emails se usan solo para actualizaciones musicales
- Fácil desuscripción
- No se comparten con terceros

## 🚀 Próximos Pasos

1. **Elige tu método preferido** (recomiendo Formspree para empezar)
2. **Configura el servicio** siguiendo las instrucciones
3. **Actualiza el código** con tu configuración
4. **Prueba el envío** con tu propio email
5. **Monitorea los resultados** en el dashboard

## 💡 Tips

- **Formspree**: Perfecto para empezar, muy fácil
- **Google Sheets**: Mejor para análisis de datos
- **EmailJS**: Ideal si quieres emails personalizados
- **Netlify**: Para desarrolladores avanzados

¿Cuál prefieres? Te ayudo a configurarlo paso a paso. 