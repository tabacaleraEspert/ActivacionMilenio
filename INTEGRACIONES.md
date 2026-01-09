# Guía de Integraciones - Backend y CRM

Este documento muestra cómo integrar la landing page con diferentes plataformas backend y CRM.

## 📍 Ubicación del Código

Todas las integraciones se realizan en `/src/app/App.tsx`, en la función `handleFormComplete`.

## 🔧 Configuración Base

```tsx
const handleFormComplete = async (data: FormData) => {
  try {
    // AQUÍ VA TU INTEGRACIÓN
    await enviarDatos(data);
  } catch (error) {
    console.error('Error al guardar:', error);
    // Opcional: mostrar error al usuario
  }
  
  // Continuar con el flujo normal
  setFormData(data);
  setCurrentStep("brand");
  setTimeout(() => {
    brandRef.current?.scrollIntoView({ behavior: "smooth" });
  }, 100);
};
```

## 🚀 Ejemplos de Integración

### 1. Google Sheets (Más Simple)

**Mediante Google Apps Script:**

```tsx
const handleFormComplete = async (data: FormData) => {
  try {
    await fetch('TU_URL_DE_GOOGLE_SCRIPT', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        ...data
      }),
    });
  } catch (error) {
    console.error('Error:', error);
  }
  
  // Continuar con flujo...
};
```

**Script de Google Apps (en tu Google Sheet):**

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    data.timestamp,
    data.fullName,
    data.email,
    data.phone,
    data.postalCode,
    data.city,
    data.ageRange,
    data.brand
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({success: true}));
}
```

### 2. API REST Propia

```tsx
const handleFormComplete = async (data: FormData) => {
  try {
    const response = await fetch('https://tu-api.com/api/registrations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer TU_TOKEN_AQUI', // Si requiere auth
      },
      body: JSON.stringify({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        postal_code: data.postalCode,
        city: data.city,
        age_range: data.ageRange,
        brand: data.brand,
        timestamp: new Date().toISOString(),
        source: 'landing-memotest',
      }),
    });

    if (!response.ok) {
      throw new Error('Error al guardar');
    }

    const result = await response.json();
    console.log('Guardado exitoso:', result);
  } catch (error) {
    console.error('Error:', error);
    // Opcional: mostrar toast de error
  }
  
  // Continuar...
};
```

### 3. Mailchimp

```tsx
const handleFormComplete = async (data: FormData) => {
  try {
    // Llamar a tu función serverless o backend proxy
    await fetch('https://tu-dominio.com/api/mailchimp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: data.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: data.fullName.split(' ')[0],
          LNAME: data.fullName.split(' ').slice(1).join(' '),
          PHONE: data.phone,
          CITY: data.city,
          POSTALCODE: data.postalCode,
          AGERANGE: data.ageRange,
          BRAND: data.brand,
        },
        tags: ['activacion-memotest', 'verano-2026'],
      }),
    });
  } catch (error) {
    console.error('Error Mailchimp:', error);
  }
  
  // Continuar...
};
```

**Endpoint serverless ejemplo (Vercel/Netlify):**

```javascript
// /api/mailchimp.js
import mailchimp from '@mailchimp/mailchimp_marketing';

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

export default async function handler(req, res) {
  try {
    const response = await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_LIST_ID,
      req.body
    );
    
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
```

### 4. HubSpot

```tsx
const handleFormComplete = async (data: FormData) => {
  try {
    await fetch('https://api.hsforms.com/submissions/v3/integration/submit/PORTAL_ID/FORM_ID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: [
          { name: 'firstname', value: data.fullName.split(' ')[0] },
          { name: 'lastname', value: data.fullName.split(' ').slice(1).join(' ') },
          { name: 'email', value: data.email },
          { name: 'phone', value: data.phone },
          { name: 'city', value: data.city },
          { name: 'zip', value: data.postalCode },
          { name: 'age_range', value: data.ageRange },
          { name: 'preferred_brand', value: data.brand },
        ],
        context: {
          pageUri: window.location.href,
          pageName: 'Memotest Landing Page',
        },
      }),
    });
  } catch (error) {
    console.error('Error HubSpot:', error);
  }
  
  // Continuar...
};
```

### 5. Firebase Firestore

**Instalación:**
```bash
npm install firebase
```

**Configuración:**

```tsx
// En un archivo separado: /src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO_ID",
  // ... resto de config
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

**En App.tsx:**

```tsx
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const handleFormComplete = async (data: FormData) => {
  try {
    const docRef = await addDoc(collection(db, 'registrations'), {
      ...data,
      timestamp: new Date(),
      source: 'landing-memotest',
    });
    
    console.log('Documento guardado con ID:', docRef.id);
  } catch (error) {
    console.error('Error Firebase:', error);
  }
  
  // Continuar...
};
```

### 6. Supabase

**Instalación:**
```bash
npm install @supabase/supabase-js
```

**Configuración:**

```tsx
// /src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tu-proyecto.supabase.co';
const supabaseAnonKey = 'TU_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**En App.tsx:**

```tsx
import { supabase } from '../lib/supabase';

const handleFormComplete = async (data: FormData) => {
  try {
    const { data: result, error } = await supabase
      .from('registrations')
      .insert([
        {
          full_name: data.fullName,
          email: data.email,
          phone: data.phone,
          postal_code: data.postalCode,
          city: data.city,
          age_range: data.ageRange,
          brand: data.brand,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) throw error;
    console.log('Guardado en Supabase:', result);
  } catch (error) {
    console.error('Error Supabase:', error);
  }
  
  // Continuar...
};
```

### 7. Airtable

```tsx
const handleFormComplete = async (data: FormData) => {
  try {
    await fetch('https://api.airtable.com/v0/TU_BASE_ID/Registrations', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer TU_API_KEY',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              'Nombre Completo': data.fullName,
              'Email': data.email,
              'Teléfono': data.phone,
              'Código Postal': data.postalCode,
              'Ciudad': data.city,
              'Rango de Edad': data.ageRange,
              'Marca': data.brand,
              'Fecha': new Date().toISOString(),
            },
          },
        ],
      }),
    });
  } catch (error) {
    console.error('Error Airtable:', error);
  }
  
  // Continuar...
};
```

### 8. Webhook Genérico (Zapier, Make, n8n)

```tsx
const handleFormComplete = async (data: FormData) => {
  try {
    await fetch('TU_WEBHOOK_URL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'form_completed',
        timestamp: new Date().toISOString(),
        data: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          postalCode: data.postalCode,
          city: data.city,
          ageRange: data.ageRange,
          brand: data.brand,
        },
        metadata: {
          source: 'landing-memotest',
          userAgent: navigator.userAgent,
          referrer: document.referrer,
        },
      }),
    });
  } catch (error) {
    console.error('Error webhook:', error);
  }
  
  // Continuar...
};
```

## 🔒 Seguridad

### Variables de Entorno

**Nunca** pongas API keys directamente en el código frontend. Usa variables de entorno:

```bash
# .env
VITE_API_URL=https://tu-api.com
VITE_API_KEY=tu_key_aqui
```

En el código:

```tsx
const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
```

### Proxy Backend

Para APIs que requieren secrets, siempre usa un proxy:

```
Frontend → Tu Backend/Serverless → API Externa
```

**Nunca:**
```
Frontend → API Externa (con secret key)
```

## 📊 Analytics

### Google Analytics 4

```tsx
const handleFormComplete = async (data: FormData) => {
  // Tu lógica de guardado...
  
  // Track event en GA4
  if (window.gtag) {
    window.gtag('event', 'form_completed', {
      event_category: 'engagement',
      event_label: 'memotest_registration',
      age_range: data.ageRange,
      brand: data.brand,
    });
  }
  
  // Continuar...
};
```

### Meta Pixel (Facebook)

```tsx
const handleFormComplete = async (data: FormData) => {
  // Tu lógica de guardado...
  
  // Track event en Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'CompleteRegistration', {
      content_name: 'Memotest Registration',
      status: 'completed',
    });
  }
  
  // Continuar...
};
```

## 🎯 Validación y Feedback

### Mostrar Loading State

```tsx
const [isSubmitting, setIsSubmitting] = useState(false);

const handleFormComplete = async (data: FormData) => {
  setIsSubmitting(true);
  
  try {
    await enviarDatos(data);
    // Éxito
  } catch (error) {
    // Error
    alert('Hubo un error. Por favor, intentá de nuevo.');
  } finally {
    setIsSubmitting(false);
  }
  
  // Continuar solo si fue exitoso...
};
```

### Toast Notifications

```tsx
import { toast } from 'sonner';

const handleFormComplete = async (data: FormData) => {
  try {
    await enviarDatos(data);
    toast.success('¡Datos guardados correctamente!');
  } catch (error) {
    toast.error('Error al guardar. Reintentá en un momento.');
  }
  
  // Continuar...
};
```

## 🧪 Testing Local

Para testear sin backend real:

```tsx
const handleFormComplete = async (data: FormData) => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Log en consola
  console.log('Datos a enviar:', data);
  
  // Guardar en localStorage (temporal)
  const registrations = JSON.parse(
    localStorage.getItem('registrations') || '[]'
  );
  registrations.push({
    ...data,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem('registrations', JSON.stringify(registrations));
  
  // Continuar...
};
```

Ver los datos guardados:

```javascript
// En la consola del navegador
console.table(JSON.parse(localStorage.getItem('registrations')));
```

## 📋 Checklist de Integración

- [ ] Endpoint configurado y testeado
- [ ] Variables de entorno configuradas
- [ ] Manejo de errores implementado
- [ ] Loading states para el usuario
- [ ] Validación de datos antes de enviar
- [ ] Analytics tracking configurado
- [ ] Test en ambiente de desarrollo
- [ ] Test en ambiente de producción
- [ ] Documentar credenciales (de forma segura)
- [ ] Plan de contingencia si falla el guardado

## 🆘 Troubleshooting

### Error CORS

Si ves errores de CORS, necesitás configurar el backend para permitir tu dominio:

```javascript
// Express.js ejemplo
app.use(cors({
  origin: 'https://tu-dominio.com',
  methods: ['POST'],
}));
```

### Timeout

Aumentar timeout si la API es lenta:

```tsx
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

try {
  await fetch(url, {
    signal: controller.signal,
    // ... resto
  });
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Timeout!');
  }
}
```

---

¿Necesitás integración con otra plataforma? Contactá al equipo de desarrollo.
