// Servicio para manejo de emails y métricas
// Integración con Google Sheets

const GOOGLE_SHEETS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL'; // Reemplazar con tu URL

export const emailService = {
  // Enviar email a Google Sheets
  async submitEmail(email) {
    try {
      const response = await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer || 'direct',
          page: 'tysan-landing'
        })
      });

      if (!response.ok) {
        throw new Error('Error al enviar email');
      }

      const result = await response.json();
      
      // Guardar en localStorage para recordar al usuario
      localStorage.setItem('tysan_unlocked_email', email);
      localStorage.setItem('tysan_unlock_date', new Date().toISOString());
      
      return { success: true, data: result };
    } catch (error) {
      console.error('Error submitting email:', error);
      return { success: false, error: error.message };
    }
  },

  // Verificar si el usuario ya desbloqueó la página
  isUnlocked() {
    return !!localStorage.getItem('tysan_unlocked_email');
  },

  // Obtener email guardado
  getSavedEmail() {
    return localStorage.getItem('tysan_unlocked_email');
  },

  // Limpiar datos guardados (para logout)
  clearSavedData() {
    localStorage.removeItem('tysan_unlocked_email');
    localStorage.removeItem('tysan_unlock_date');
  },

  // Trackear métricas de navegación
  trackNavigation(sectionName) {
    try {
      // Enviar a Google Analytics si está configurado
      if (window.gtag) {
        window.gtag('event', 'section_view', {
          section_name: sectionName,
          page_title: 'Tysan Landing Page'
        });
      }

      // Guardar en localStorage para métricas locales
      const navigationHistory = JSON.parse(localStorage.getItem('tysan_navigation') || '[]');
      navigationHistory.push({
        section: sectionName,
        timestamp: new Date().toISOString()
      });
      
      // Mantener solo los últimos 50 registros
      if (navigationHistory.length > 50) {
        navigationHistory.splice(0, navigationHistory.length - 50);
      }
      
      localStorage.setItem('tysan_navigation', JSON.stringify(navigationHistory));
    } catch (error) {
      console.error('Error tracking navigation:', error);
    }
  },

  // Trackear clics en botones
  trackClick(buttonName, sectionName) {
    try {
      if (window.gtag) {
        window.gtag('event', 'button_click', {
          button_name: buttonName,
          section_name: sectionName,
          page_title: 'Tysan Landing Page'
        });
      }
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  },

  // Obtener métricas locales
  getLocalMetrics() {
    try {
      const navigationHistory = JSON.parse(localStorage.getItem('tysan_navigation') || '[]');
      const unlockDate = localStorage.getItem('tysan_unlock_date');
      
      return {
        totalVisits: navigationHistory.length,
        sectionsVisited: [...new Set(navigationHistory.map(nav => nav.section))],
        firstUnlock: unlockDate,
        lastVisit: navigationHistory.length > 0 ? navigationHistory[navigationHistory.length - 1].timestamp : null
      };
    } catch (error) {
      console.error('Error getting local metrics:', error);
      return null;
    }
  }
};

// Configuración para Google Apps Script
export const googleSheetsConfig = {
  // URL del Google Apps Script (reemplazar con tu URL)
  scriptUrl: 'YOUR_GOOGLE_APPS_SCRIPT_URL',
  
  // Configuración de la hoja de cálculo
  spreadsheetId: 'YOUR_SPREADSHEET_ID',
  sheetName: 'Emails',
  
  // Columnas en la hoja de cálculo
  columns: {
    email: 'A',
    timestamp: 'B',
    userAgent: 'C',
    referrer: 'D',
    page: 'E'
  }
};

// Ejemplo de Google Apps Script para procesar emails
export const googleAppsScriptExample = `
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID').getSheetByName('Emails');
    
    sheet.appendRow([
      data.email,
      data.timestamp,
      data.userAgent,
      data.referrer,
      data.page
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`; 