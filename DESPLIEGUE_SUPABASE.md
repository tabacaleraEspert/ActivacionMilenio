# 🚀 Despliegue de Supabase Edge Functions

## ❌ Problema Actual

El error **404 Not Found** indica que la función de Supabase no está desplegada. Los endpoints `/save-form-data` y `/assign-prize` no están disponibles.

---

## ✅ Solución: Desplegar la Función

Tenés dos opciones para desplegar:

### Opción 1: Usando Supabase CLI (Recomendado)

#### 1.1. Instalar Supabase CLI

**En macOS:**
```bash
brew install supabase/tap/supabase
```

**O con npm:**
```bash
npm install -g supabase
```

#### 1.2. Iniciar sesión en Supabase

```bash
supabase login
```

Esto abrirá tu navegador para autenticarte.

#### 1.3. Vincular tu proyecto

```bash
cd /Users/davorvindis/Desktop/Repositories/ActivacionMilenio
supabase link --project-ref usbkamwrbvkorkmebbof
```

**Nota:** `usbkamwrbvkorkmebbof` es tu Project ID (lo encontrás en la URL de tu dashboard de Supabase).

#### 1.4. Desplegar la función

```bash
supabase functions deploy make-server-ecc7502f
```

Esto desplegará la función desde `supabase/functions/server/index.tsx`.

---

### Opción 2: Desplegar desde el Dashboard de Supabase

#### 2.1. Crear la función manualmente

1. Ve a tu dashboard de Supabase: https://supabase.com/dashboard
2. Seleccioná tu proyecto
3. Ve a **"Edge Functions"** en el menú lateral
4. Click en **"Create a new function"**
5. Nombre: `make-server-ecc7502f`
6. Click en **"Create function"**

#### 2.2. Copiar el código

1. Abrí el archivo `supabase/functions/server/index.tsx` de este proyecto
2. Copiá **todo el contenido**
3. Pegalo en el editor de la función en Supabase
4. Click en **"Deploy"**

#### 2.3. Configurar variables de entorno (Opcional)

Si querés usar una URL personalizada de Google Apps Script:

1. En el dashboard de Supabase, ve a **"Settings" → "Edge Functions" → "Secrets"**
2. Agregá un nuevo secret:
   - **Name**: `GOOGLE_APPS_SCRIPT_URL`
   - **Value**: Tu URL del Google Apps Script (si ya la tenés)

**Nota:** Si no configurás esta variable, el código usa una URL por defecto.

---

## 🔍 Verificar que Funciona

Después de desplegar, probá estos endpoints:

### 1. Health Check
```bash
curl https://usbkamwrbvkorkmebbof.supabase.co/functions/v1/make-server-ecc7502f/health
```

Debería responder: `{"status":"ok"}`

### 2. Probar desde el navegador

Abrí la consola del navegador (F12) y ejecutá:

```javascript
const { projectId, publicAnonKey } = await import("/utils/supabase/info");
const response = await fetch(
  `https://${projectId}.supabase.co/functions/v1/make-server-ecc7502f/health`,
  {
    headers: {
      Authorization: `Bearer ${publicAnonKey}`,
    },
  }
);
const data = await response.json();
console.log(data);
```

Debería mostrar: `{status: "ok"}`

---

## 📝 Notas Importantes

1. **La función debe llamarse exactamente `make-server-ecc7502f`** para que coincida con las URLs del frontend.

2. **Variables de entorno automáticas:**
   - `SUPABASE_URL`: Se configura automáticamente
   - `SUPABASE_SERVICE_ROLE_KEY`: Se configura automáticamente
   - `GOOGLE_APPS_SCRIPT_URL`: Opcional, tiene un valor por defecto

3. **Después de desplegar**, el error 404 debería desaparecer y los endpoints deberían funcionar.

---

## 🐛 Si Sigue Fallando

1. **Verificá los logs:**
   - En el dashboard de Supabase, ve a **"Edge Functions" → "make-server-ecc7502f" → "Logs"**
   - Ahí verás los errores si los hay

2. **Verificá la URL del endpoint:**
   - Debe ser: `https://usbkamwrbvkorkmebbof.supabase.co/functions/v1/make-server-ecc7502f/save-form-data`
   - Reemplazá `usbkamwrbvkorkmebbof` con tu Project ID si es diferente

3. **Verificá el token de autorización:**
   - El frontend debe enviar `Authorization: Bearer <publicAnonKey>`
   - Verificá que `publicAnonKey` esté correcto en `/utils/supabase/info.tsx`

---

## ✅ Checklist Post-Despliegue

- [ ] Función desplegada correctamente
- [ ] Health check responde `{"status":"ok"}`
- [ ] No hay errores 404 en la consola
- [ ] Los datos del formulario se guardan en Google Sheets
- [ ] Los premios se asignan correctamente
- [ ] La columna "Usados" se actualiza en el sheet
