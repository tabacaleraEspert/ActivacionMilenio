# 🔧 Solución: "Script function not found: doGet"

## ❌ Problema

Cuando accedés a la URL del Google Apps Script, aparece el error:
```
Script function not found: doGet
```

## ✅ Solución

El código tiene la función `doGet`, pero el script desplegado no está actualizado. Necesitás **redesplegar** la aplicación web.

### Pasos para solucionarlo:

1. **Abrí tu Google Sheet:**
   ```
   https://docs.google.com/spreadsheets/d/1jfJKGRTg96Xj1Y60T0YuPjmU_PHkbdChhEbsFOmloKc/edit
   ```

2. **Abrí Apps Script:**
   - Click en **"Extensiones" → "Apps Script"**

3. **Verificá que el código esté completo:**
   - Debe tener las funciones: `doGet`, `doPost`, `saveFormData`, `selectAndAssignPrize`
   - Si falta algo, copiá todo el contenido de `google-apps-script.js` y pegálo

4. **Guardá el script:**
   - Ctrl+S o Cmd+S

5. **Redesplegá la aplicación web:**
   - Click en **"Desplegar" → "Administrar implementaciones"**
   - Click en el ícono de **lápiz** (editar) de la implementación existente
   - O creá una **nueva versión**:
     - Click en **"Desplegar" → "Nueva implementación"**
     - Tipo: **"Aplicación web"**
     - Versión: **"Nueva versión"** (o seleccioná la última)
     - Ejecutar como: **"Yo"**
     - Quién tiene acceso: **"Cualquiera"**
     - Click en **"Desplegar"**

6. **Verificá que funcione:**
   - Abrí la URL en el navegador: `https://script.google.com/macros/s/AKfycbxc-o8kBfmBO3EYKn82poE2NmEnyFqFVpKMdzmThbG04pj1-epuWqCSeL7D3rC5NELb_A/exec`
   - Debería mostrar: `{"success":true,"message":"Google Apps Script activo..."}`

## 🎯 Verificación Rápida

Después de redesplegar, probá hacer un POST desde la consola del navegador:

```javascript
fetch('https://script.google.com/macros/s/AKfycbxc-o8kBfmBO3EYKn82poE2NmEnyFqFVpKMdzmThbG04pj1-epuWqCSeL7D3rC5NELb_A/exec', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'selectAndAssignPrize' })
})
.then(r => r.json())
.then(console.log);
```

Debería retornar un premio o un error si no hay premios disponibles.
