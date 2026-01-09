# 📊 Configuración Completa de Google Sheets

## 🎯 Lo que hace el sistema

1. **Guarda datos del formulario** en la hoja "Datos"
2. **Lee premios** de la hoja "Premios" (o primera hoja)
3. **Asigna premio aleatorio** basado en stock disponible
4. **Actualiza automáticamente** la columna "Usados" cuando se asigna un premio
5. **No asigna premios** cuando usados >= stock

---

## 📋 Paso 1: Configurar Google Apps Script

### 1.1. Abrir Apps Script

1. Ve a tu Google Sheet: https://docs.google.com/spreadsheets/d/1jfJKGRTg96Xj1Y60T0YuPjmU_PHkbdChhEbsFOmloKc/edit
2. Click en **"Extensiones" → "Apps Script"**
3. Se abrirá una nueva pestaña con el editor de scripts

### 1.2. Pegar el código

1. **Borrá todo** el código que haya en el editor
2. Abrí el archivo `google-apps-script.js` de este proyecto
3. **Copiá todo el contenido** y pegálo en el editor de Apps Script
4. **Guardá** (Ctrl+S o Cmd+S, o click en el ícono de guardar)

### 1.3. Desplegar como aplicación web

1. Click en **"Desplegar" → "Nueva implementación"**
2. Configurá:
   - **Tipo**: "Aplicación web"
   - **Nombre**: "Activacion Milenio API" (o el que quieras)
   - **Ejecutar como**: "Yo"
   - **Quién tiene acceso**: **"Cualquiera"** (importante!)
3. Click en **"Desplegar"**
4. **Autorizá los permisos** cuando te lo pida:
   - Click en "Revisar permisos"
   - Seleccioná tu cuenta
   - Click en "Avanzado"
   - Click en "Ir a Activacion Milenio API (no seguro)" (es normal, es tu propio script)
   - Click en "Permitir"
5. **Copiá la URL del webhook** que aparece (algo como: `https://script.google.com/macros/s/AKfycby.../exec`)
   - Esta URL la necesitás para el siguiente paso

---

## 🔧 Paso 2: Configurar Variable de Entorno (Opcional)

**IMPORTANTE**: La URL ya está configurada por defecto en el código. Si querés cambiarla:

### 2.1. Agregar URL del Script a Supabase (Opcional)

1. Ve a tu dashboard de Supabase: https://supabase.com/dashboard
2. Seleccioná tu proyecto
3. Ve a **"Settings" → "Edge Functions" → "Secrets"**
4. Agregá una nueva variable secreta:
   - **Name**: `GOOGLE_APPS_SCRIPT_URL`
   - **Value**: `https://script.google.com/macros/s/AKfycbxc-o8kBfmBO3EYKn82poE2NmEnyFqFVpKMdzmThbG04pj1-epuWqCSeL7D3rC5NELb_A/exec`
5. Click en **"Save"**

**Nota**: Si no configurás la variable de entorno, el código usará la URL por defecto que ya está incluida.

### 2.2. URL Configurada

La URL del Google Apps Script ya está configurada en el código:
```
https://script.google.com/macros/s/AKfycbxc-o8kBfmBO3EYKn82poE2NmEnyFqFVpKMdzmThbG04pj1-epuWqCSeL7D3rC5NELb_A/exec
```

---

## 📝 Paso 3: Verificar Estructura del Sheet

### Hoja "Premios" (o primera hoja)

Asegurate de que tenga esta estructura:

| Premios | Stock | Usados |
|---------|-------|--------|
| Buzo    | 1     | 0      |
| Remera  | 2     | 0      |
| Gorra   | 3     | 0      |
| Cuello  | 25    | 4      |
| ...     | ...   | ...    |

- **Columna A**: Nombre del premio
- **Columna B**: Stock total
- **Columna C**: Cantidad usada

### Hoja "Datos" (se crea automáticamente)

El script creará automáticamente la hoja "Datos" con estos headers:

| Fecha | Nombre Completo | Email | Teléfono | Código Postal | Ciudad | Rango de Edad | Marca |
|-------|----------------|-------|----------|---------------|--------|---------------|-------|

---

## ✅ Paso 4: Hacer el Sheet Público (Solo Lectura)

1. En tu Google Sheet, click en **"Compartir"** (botón azul)
2. En "Obtener enlace", seleccioná **"Cualquier persona con el enlace"**
3. Permiso: **"Visualizador"** (solo lectura)
4. Click en **"Listo"**

**Nota**: El script de Apps Script puede escribir aunque el sheet sea público solo lectura, porque se ejecuta con tus permisos.

---

## 🧪 Paso 5: Probar

### Probar guardar datos:

1. Completá el formulario en tu app
2. Verificá que los datos aparezcan en la hoja "Datos"

### Probar asignar premio:

1. Jugá el juego hasta que termine el tiempo
2. Raspa la tarjeta
3. Verificá que:
   - Se asigne un premio aleatorio
   - La columna "Usados" se incremente en 1 en la hoja "Premios"
   - Si un premio tiene usados >= stock, no aparezca más

---

## 🔍 Verificación de Funcionamiento

### Logs en Supabase:

1. Ve a **"Edge Functions" → "Logs"**
2. Buscá mensajes como:
   - `✅ Datos del formulario guardados en Google Sheets`
   - `✅ Premio X asignado y actualizado en sheet`

### Verificar en Google Sheets:

1. Abrí la hoja "Datos" - deberías ver los registros del formulario
2. Abrí la hoja "Premios" - la columna "Usados" debería incrementarse

---

## 🚨 Troubleshooting

### Error: "No hay premios disponibles"

- Verificá que haya premios con `stock - usados > 0`
- Verificá que el sheet sea público
- Revisá los logs de Supabase para ver el error específico

### Error: "Error al guardar datos"

- Verificá que la URL del Google Apps Script esté correcta
- Verificá que el script esté desplegado como "Aplicación web"
- Verificá que el acceso sea "Cualquiera"

### Los datos no se guardan

- Verificá que `GOOGLE_APPS_SCRIPT_URL` esté configurada en Supabase Secrets
- Revisá los logs de Supabase
- Verificá que el script tenga los permisos correctos

---

## 📊 Estructura de Datos

### Datos del Formulario (Hoja "Datos"):

```json
{
  "fullName": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+54 11 1234-5678",
  "postalCode": "1234",
  "city": "Buenos Aires",
  "ageRange": "25-34",
  "brand": "marlboro-red"
}
```

### Asignación de Premio:

```json
{
  "action": "assignPrize",
  "prize": "Buzo"
}
```

---

## 🎯 Resumen de Pasos

1. ✅ Crear Google Apps Script (pegar código)
2. ✅ Desplegar como aplicación web
3. ✅ Copiar URL del webhook
4. ✅ Agregar `GOOGLE_APPS_SCRIPT_URL` en Supabase Secrets
5. ✅ Hacer el sheet público (solo lectura)
6. ✅ Probar

---

**¡Listo!** Una vez completados estos pasos, el sistema guardará automáticamente los datos del formulario y actualizará los premios en Google Sheets.
