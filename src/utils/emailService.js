// Servicio para manejar el envío de emails
// Opciones de integración:

// 1. Google Sheets (Recomendado para empezar)
export const sendEmailToGoogleSheets = async (email) => {
  try {
    // Necesitas crear un Google Sheet y configurar un webhook
    // Puedes usar Google Apps Script o servicios como Zapier
    const response = await fetch('TU_WEBHOOK_URL_AQUI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        timestamp: new Date().toISOString(),
        source: 'Tysan Landing Page'
      })
    });
    
    if (response.ok) {
      return { success: true, message: 'Email registrado correctamente' };
    } else {
      throw new Error('Error al enviar email');
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Error al enviar email' };
  }
};

// 2. EmailJS (Fácil de configurar)
export const sendEmailWithEmailJS = async (email) => {
  try {
    // Necesitas configurar EmailJS con tu template
    const templateParams = {
      to_email: 'tu@email.com', // Tu email
      from_email: email,
      message: `Nuevo suscriptor: ${email}`,
      subject: 'Nuevo suscriptor de Tysan'
    };

    // Ejemplo con EmailJS
    // emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_USER_ID');
    
    return { success: true, message: 'Email enviado correctamente' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Error al enviar email' };
  }
};

// 3. Netlify Functions (Si usas Netlify)
export const sendEmailWithNetlify = async (email) => {
  try {
    const response = await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });
    
    if (response.ok) {
      return { success: true, message: 'Email registrado correctamente' };
    } else {
      throw new Error('Error al enviar email');
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Error al enviar email' };
  }
};

// 4. Formspree (Muy fácil)
export const sendEmailWithFormspree = async (email) => {
  try {
    const response = await fetch('https://formspree.io/f/TU_FORM_ID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        _subject: 'Nuevo suscriptor de Tysan'
      })
    });
    
    if (response.ok) {
      return { success: true, message: 'Email registrado correctamente' };
    } else {
      throw new Error('Error al enviar email');
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Error al enviar email' };
  }
};

// Función principal que puedes usar
export const sendEmail = async (email) => {
  // Elige el método que prefieras:
  
  // Opción 1: Google Sheets (recomendado)
  // return await sendEmailToGoogleSheets(email);
  
  // Opción 2: EmailJS
  // return await sendEmailWithEmailJS(email);
  
  // Opción 3: Netlify Functions
  // return await sendEmailWithNetlify(email);
  
  // Opción 4: Formspree (más fácil)
  return await sendEmailWithFormspree(email);
}; 