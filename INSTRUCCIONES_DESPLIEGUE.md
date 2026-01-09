# 🚀 Instrucciones para Desplegar Google Apps Script

## ❌ Error Actual
"No se encontró la función de la secuencia de comandos: doGet"

Esto significa que el script no está desplegado o no está guardado correctamente.

## ✅ Solución Paso a Paso

### 1. Abrir Google Apps Script

1. Ve a tu Google Sheet: https://docs.google.com/spreadsheets/d/1jfJKGRTg96Xj1Y60T0YuPjmU_PHkbdChhEbsFOmloKc/edit
2. Click en **"Extensiones" → "Apps Script"**
3. Se abrirá una nueva pestaña con el editor

### 2. Verificar/Copiar el Código

1. **BORRÁ TODO** el código que haya en el editor
2. Abrí el archivo `google-apps-script.js` de este proyecto
3. **Copiá TODO el contenido** (328 líneas)
4. **Pegalo** en el editor de Apps Script
5. **VERIFICÁ** que veas estas funciones:
   - `saveFormData`
   - `selectAndAssignPrize`
   - `assignPrize`
   - `doGet` ← **MUY IMPORTANTE**
   - `doPost`

### 3. Guardar el Script

1. Click en el ícono de **guardar** (💾) o presioná **Ctrl+S** (Windows) / **Cmd+S** (Mac)
2. Verificá que no haya errores de sintaxis (debería aparecer un ✓ verde)
3. Si hay errores, corregilos antes de continuar

### 4. Desplegar como Aplicación Web

1. Click en **"Desplegar" → "Nueva implementación"**
2. O si ya existe una implementación:
   - Click en **"Desplegar" → "Administrar implementaciones"**
   - Click en el ícono de **lápiz** (✏️) para editar
   - O creá una **nueva versión**

3. Configurá:
   - **Tipo**: "Aplicación web"
   - **Nombre**: "Activacion Milenio API" (o el que quieras)
   - **Descripción**: (opcional)
   - **Ejecutar como**: **"Yo"** (tu cuenta)
   - **Quién tiene acceso**: **"Cualquiera"** ← **MUY IMPORTANTE**
   - **Versión**: "Nueva versión" (si estás editando)

4. Click en **"Desplegar"**

### 5. Autorizar Permisos

1. Te pedirá autorizar permisos
2. Click en **"Revisar permisos"**
3. Seleccioná tu cuenta de Google
4. Click en **"Avanzado"**
5. Click en **"Ir a Activacion Milenio API (no seguro)"**
   - Esto es normal, es tu propio script
6. Click en **"Permitir"**

### 6. Copiar la URL

1. Después de desplegar, verás una URL como:
   ```
   https://script.google.com/macros/s/AKfycbxc-o8kBfmBO3EYKn82poE2NmEnyFqFVpKMdzmThbG04pj1-epuWqCSeL7D3rC5NELb_A/exec
   ```
2. **Copiá esta URL**
3. Verificá que la URL termine en `/exec` (no `/dev`)

### 7. Verificar que Funcione

1. Abrí la URL en el navegador (sin parámetros)
2. Deberías ver:
   ```json
   {"success":true,"message":"Google Apps Script activo. Usar ?action=selectAndAssignPrize para asignar premios."}
   ```

3. Si ves el error "No se encontró la función doGet":
   - Volvé al paso 2 y verificá que el código esté completo
   - Asegurate de haber guardado (Ctrl+S)
   - Redesplegá la aplicación web

### 8. Probar Asignación de Premio

Abrí esta URL en el navegador:
```
https://script.google.com/macros/s/TU_URL/exec?action=selectAndAssignPrize
```

Deberías ver algo como:
```json
{"success":true,"prize":"Premio 1","newUsedCount":1,"message":"Premio Premio 1 asignado. Usados: 1/10"}
```

## 🐛 Troubleshooting

### Error: "No se encontró la función doGet"
- **Causa**: El código no está guardado o no está desplegado
- **Solución**: 
  1. Verificá que `doGet` esté en el código
  2. Guardá el script (Ctrl+S)
  3. Redesplegá la aplicación web

### Error: "Script function not found"
- **Causa**: La versión desplegada es antigua
- **Solución**: Creá una nueva versión al desplegar

### Error: "No hay premios disponibles"
- **Causa**: No hay premios con stock disponible
- **Solución**: Verificá que la hoja "Premios" tenga premios con `Stock > Usados`

### La URL no funciona
- **Causa**: El acceso no está configurado como "Cualquiera"
- **Solución**: Redesplegá y asegurate de seleccionar "Cualquiera" en "Quién tiene acceso"

## ✅ Checklist Final

- [ ] Código completo copiado en Apps Script
- [ ] Script guardado (sin errores)
- [ ] Aplicación web desplegada
- [ ] Acceso configurado como "Cualquiera"
- [ ] Permisos autorizados
- [ ] URL copiada y verificada
- [ ] `doGet` funciona cuando accedés a la URL
- [ ] `?action=selectAndAssignPrize` retorna un premio
