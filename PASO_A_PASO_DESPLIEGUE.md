# 🚀 PASO A PASO: Desplegar Google Apps Script

## ⚠️ Error Actual
```
No se encontró la función de la secuencia de comandos: doGet
```

Esto significa que el script **NO está desplegado** o está usando una **versión antigua**.

---

## ✅ SOLUCIÓN (Sigue estos pasos EXACTAMENTE)

### PASO 1: Abrir Google Apps Script

1. Abrí tu Google Sheet:
   ```
   https://docs.google.com/spreadsheets/d/1jfJKGRTg96Xj1Y60T0YuPjmU_PHkbdChhEbsFOmloKc/edit
   ```

2. Click en **"Extensiones"** (menú superior)
3. Click en **"Apps Script"**
4. Se abrirá una nueva pestaña con el editor de código

### PASO 2: Verificar/Borrar Código Actual

1. **Seleccioná TODO** el código que haya (Ctrl+A o Cmd+A)
2. **BORRÁLO** (Delete o Backspace)
3. El editor debe quedar **completamente vacío**

### PASO 3: Copiar el Código Nuevo

1. Abrí el archivo `google-apps-script.js` de este proyecto
2. **Seleccioná TODO** el contenido (Ctrl+A o Cmd+A)
3. **Copiá** (Ctrl+C o Cmd+C)
4. Volvé al editor de Apps Script
5. **Pegá** el código (Ctrl+V o Cmd+V)

### PASO 4: Verificar que el Código Esté Completo

Desplazate por el código y verificá que veas estas funciones (en este orden):

1. `function saveFormData(e)` - línea ~15
2. `function selectAndAssignPrize(e)` - línea ~68
3. `function assignPrize(e)` - línea ~173
4. **`function doGet(e)` - línea ~236** ← **MUY IMPORTANTE**
5. `function doPost(e)` - línea ~308

Si falta alguna, el código no está completo.

### PASO 5: Guardar el Script

1. Click en el ícono de **💾 Guardar** (esquina superior izquierda)
   - O presioná **Ctrl+S** (Windows) / **Cmd+S** (Mac)
2. Verificá que **NO haya errores** (debería aparecer un ✓ verde)
3. Si hay errores, corregilos antes de continuar

### PASO 6: Desplegar como Aplicación Web

#### Opción A: Si NO tenés una implementación anterior

1. Click en **"Desplegar"** (esquina superior derecha)
2. Click en **"Nueva implementación"**
3. Configurá:
   - **Tipo**: Seleccioná **"Aplicación web"** del dropdown
   - **Nombre**: "Activacion Milenio API" (o el que quieras)
   - **Descripción**: (opcional, dejá vacío)
   - **Ejecutar como**: **"Yo"** (tu cuenta de Google)
   - **Quién tiene acceso**: **"Cualquiera"** ← **MUY IMPORTANTE**
4. Click en **"Desplegar"**

#### Opción B: Si YA tenés una implementación

1. Click en **"Desplegar"**
2. Click en **"Administrar implementaciones"**
3. Verás una lista de implementaciones
4. Click en el ícono de **✏️ lápiz** (editar) de la implementación existente
5. En **"Versión"**, seleccioná **"Nueva versión"**
6. Verificá que **"Quién tiene acceso"** sea **"Cualquiera"**
7. Click en **"Desplegar"**

### PASO 7: Autorizar Permisos

1. Te aparecerá un popup pidiendo autorización
2. Click en **"Revisar permisos"**
3. Seleccioná tu cuenta de Google
4. Click en **"Avanzado"**
5. Click en **"Ir a Activacion Milenio API (no seguro)"**
   - ⚠️ Esto es normal, es tu propio script
6. Click en **"Permitir"**

### PASO 8: Copiar la URL

1. Después de autorizar, verás una pantalla con la URL
2. La URL debería verse así:
   ```
   https://script.google.com/macros/s/AKfycbxc-o8kBfmBO3EYKn82poE2NmEnyFqFVpKMdzmThbG04pj1-epuWqCSeL7D3rC5NELb_A/exec
   ```
3. **IMPORTANTE**: Debe terminar en `/exec` (NO `/dev`)
4. **Copiá esta URL completa**

### PASO 9: Verificar que Funcione

#### Prueba 1: Verificar doGet básico

Abrí esta URL en el navegador (sin parámetros):
```
https://script.google.com/macros/s/TU_URL_AQUI/exec
```

**Deberías ver:**
```json
{"success":true,"message":"Google Apps Script activo. Usar ?action=selectAndAssignPrize&callback=nombreFuncion para JSONP."}
```

**Si ves el error "No se encontró la función doGet":**
- ❌ El script NO está desplegado correctamente
- Volvé al PASO 6 y redesplegá
- Asegurate de seleccionar **"Nueva versión"** si estás editando

#### Prueba 2: Verificar JSONP

Abrí esta URL en el navegador:
```
https://script.google.com/macros/s/TU_URL_AQUI/exec?action=selectAndAssignPrize&callback=test
```

**Deberías ver JavaScript ejecutable:**
```javascript
test({"success":true,"prize":"Premio 1",...});
```

**Si ves el error "No se encontró la función doGet":**
- ❌ El script NO está desplegado
- Volvé al PASO 6

### PASO 10: Actualizar la URL en el Código (Si es diferente)

Si la URL que copiaste es diferente a la que está en el código:

1. Abrí `src/app/App.tsx`
2. Buscá la línea que dice:
   ```typescript
   const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || 
     'https://script.google.com/macros/s/AKfycbxc.../exec';
   ```
3. Reemplazá la URL por defecto con tu URL nueva
4. O mejor: creá un archivo `.env` con:
   ```
   VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/TU_URL_AQUI/exec
   ```

---

## 🐛 Troubleshooting

### Error: "No se encontró la función doGet"
**Causa**: El script no está desplegado o está usando versión antigua
**Solución**: 
1. Verificá que `doGet` esté en el código (línea 236)
2. Guardá el script (Ctrl+S)
3. Redesplegá seleccionando **"Nueva versión"**

### Error: "Script function not found"
**Causa**: Versión desplegada es antigua
**Solución**: Redesplegá con **"Nueva versión"**

### La URL termina en `/dev` en lugar de `/exec`
**Causa**: Estás usando la URL de desarrollo
**Solución**: Usá la URL de la implementación desplegada (termina en `/exec`)

### No puedo ver la URL después de desplegar
**Solución**: 
1. Ve a "Desplegar" → "Administrar implementaciones"
2. Click en la implementación
3. Ahí verás la URL

---

## ✅ Checklist Final

Antes de probar en tu app, verificá:

- [ ] Código completo copiado en Apps Script
- [ ] Script guardado (sin errores)
- [ ] Aplicación web desplegada
- [ ] Acceso configurado como "Cualquiera"
- [ ] Permisos autorizados
- [ ] URL copiada (termina en `/exec`)
- [ ] Prueba 1 funciona (doGet básico)
- [ ] Prueba 2 funciona (JSONP)

**Si todos los checkboxes están marcados, el sistema debería funcionar.** 🎉
