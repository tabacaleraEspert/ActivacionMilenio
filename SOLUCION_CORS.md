# 🔧 Solución: Error 405 Method Not Allowed (CORS)

## ❌ Problema

Cuando el frontend intenta hacer una petición POST a Google Apps Script, aparece el error:
```
405 Method Not Allowed
Request Method: OPTIONS
```

Esto es un problema de **CORS (Cross-Origin Resource Sharing)**. El navegador envía primero una petición `OPTIONS` (preflight) para verificar si el servidor permite la petición, pero Google Apps Script no maneja bien estas peticiones.

## ✅ Solución Implementada

Se implementó una solución híbrida que evita completamente el problema de CORS:

### 1. Guardar Datos del Formulario
- Usa `mode: 'no-cors'` para evitar el preflight
- No podemos leer la respuesta, pero los datos se guardan correctamente
- Es un "fire and forget" - enviamos los datos y continuamos

### 2. Obtener Premio
- Usa **JSONP** (JSON with Padding) para evitar CORS completamente
- El Google Apps Script ahora soporta JSONP a través de `doGet`
- El frontend crea un `<script>` tag que carga la URL con un callback
- El script ejecuta el callback con los datos del premio

## 📝 Cambios Realizados

### Frontend (`src/app/App.tsx`)
- Guardar datos: usa `fetch` con `mode: 'no-cors'`
- Obtener premio: usa JSONP con un `<script>` tag dinámico

### Google Apps Script (`google-apps-script.js`)
- `doGet` ahora maneja peticiones JSONP
- Si recibe `action=selectAndAssignPrize&callback=nombreFuncion`, ejecuta la función y retorna JSONP

## 🚀 Próximos Pasos

1. **Actualizá el Google Apps Script:**
   - Copiá el código actualizado de `google-apps-script.js`
   - Pegalo en el editor de Apps Script
   - Guardá y redesplegá la aplicación web

2. **Verificá que funcione:**
   - Completá el formulario
   - Verificá en la consola que aparezca "✅ Premio asignado: [nombre]"
   - Verificá en Google Sheets que los datos se guarden

## 🎯 Cómo Funciona JSONP

```javascript
// El frontend crea esto:
<script src="URL?action=selectAndAssignPrize&callback=handlePrize_123"></script>

// El servidor responde con:
handlePrize_123({"success": true, "prize": "Premio 1"});

// El navegador ejecuta automáticamente:
handlePrize_123({"success": true, "prize": "Premio 1"});
```

Esto evita completamente CORS porque los `<script>` tags no están sujetos a las mismas restricciones que `fetch`.

## ⚠️ Notas

- **Guardar datos**: No podemos verificar si se guardó correctamente (por `no-cors`), pero generalmente funciona
- **Obtener premio**: Si falla, el sistema continúa sin premio asignado (el usuario verá "Premio Sorpresa")
- **Timeout**: El JSONP tiene un timeout de 3 segundos para no bloquear el flujo
