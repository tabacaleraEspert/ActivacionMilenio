# 📋 Instrucciones: 2 Scripts Separados

## 🎯 Estructura

Ahora tenemos **2 scripts separados**:

1. **`google-apps-script-save-data.js`** - Solo guarda datos del formulario
2. **`google-apps-script-prizes.js`** - Solo asigna premios

Esto simplifica el código y evita problemas.

---

## 📝 PASO 1: Crear Script para Guardar Datos

### 1.1. Abrir Apps Script

1. Ve a tu Google Sheet: https://docs.google.com/spreadsheets/d/1jfJKGRTg96Xj1Y60T0YuPjmU_PHkbdChhEbsFOmloKc/edit
2. Click en **"Extensiones" → "Apps Script"**
3. Se abrirá una nueva pestaña

### 1.2. Copiar Código

1. Abrí el archivo `google-apps-script-save-data.js` de este proyecto
2. **Copiá TODO** el contenido
3. **Pegalo** en el editor de Apps Script
4. **Guardá** (Ctrl+S o Cmd+S)

### 1.3. Desplegar

1. Click en **"Desplegar" → "Nueva implementación"**
2. Configurá:
   - **Tipo**: "Aplicación web"
   - **Nombre**: "Guardar Datos"
   - **Ejecutar como**: "Yo"
   - **Quién tiene acceso**: **"Cualquiera"**
3. Click en **"Desplegar"**
4. **Autorizá permisos** cuando te lo pida
5. **Copiá la URL** (algo como: `https://script.google.com/macros/s/ABC123.../exec`)

**Guarda esta URL, la necesitarás después.**

---

## 🎁 PASO 2: Crear Script para Asignar Premios

### 2.1. Crear Nuevo Proyecto

**Opción A: En el mismo Sheet (Recomendado)**

1. En el editor de Apps Script, click en **"Archivo" → "Nuevo" → "Proyecto"**
2. Se abrirá una nueva pestaña con un proyecto vacío
3. **IMPORTANTE**: Este proyecto también necesita acceso al mismo Google Sheet

**Opción B: En otro Sheet (Más simple)**

1. Creá una copia de tu Google Sheet (o usá el mismo)
2. Ve a **"Extensiones" → "Apps Script"**
3. Se abrirá un nuevo proyecto

### 2.2. Copiar Código

1. Abrí el archivo `google-apps-script-prizes.js` de este proyecto
2. **IMPORTANTE**: Verificá que el `SHEET_ID` en la línea 18 sea correcto:
   ```javascript
   const SHEET_ID = "1jfJKGRTg96Xj1Y60T0YuPjmU_PHkbdChhEbsFOmloKc";
   ```
3. **Copiá TODO** el contenido
4. **Pegalo** en el editor de Apps Script
5. **Guardá** (Ctrl+S o Cmd+S)

### 2.3. Desplegar

1. Click en **"Desplegar" → "Nueva implementación"**
2. Configurá:
   - **Tipo**: "Aplicación web"
   - **Nombre**: "Asignar Premios"
   - **Ejecutar como**: "Yo"
   - **Quién tiene acceso**: **"Cualquiera"**
3. Click en **"Desplegar"**
4. **Autorizá permisos** cuando te lo pida
5. **Copiá la URL** (algo como: `https://script.google.com/macros/s/XYZ789.../exec`)

**Guarda esta URL también.**

---

## ⚙️ PASO 3: Configurar URLs en el Frontend

Tenes dos opciones:

### Opción A: Variables de Entorno (Recomendado)

1. Creá o editá el archivo `.env` en la raíz del proyecto:
   ```bash
   VITE_GOOGLE_SCRIPT_SAVE_DATA_URL=https://script.google.com/macros/s/TU_URL_SAVE_DATA/exec
   VITE_GOOGLE_SCRIPT_PRIZES_URL=https://script.google.com/macros/s/TU_URL_PRIZES/exec
   ```

2. Reemplazá `TU_URL_SAVE_DATA` y `TU_URL_PRIZES` con las URLs que copiaste

3. Reiniciá el servidor de desarrollo si está corriendo

### Opción B: Editar Código Directamente

1. Abrí `src/app/App.tsx`
2. Buscá estas líneas (alrededor de línea 78-82):
   ```typescript
   const SAVE_DATA_URL = import.meta.env.VITE_GOOGLE_SCRIPT_SAVE_DATA_URL || 
     'https://script.google.com/macros/s/TU_URL_SAVE_DATA/exec';
   
   const ASSIGN_PRIZE_URL = import.meta.env.VITE_GOOGLE_SCRIPT_PRIZES_URL || 
     'https://script.google.com/macros/s/TU_URL_PRIZES/exec';
   ```
3. Reemplazá `TU_URL_SAVE_DATA` y `TU_URL_PRIZES` con las URLs que copiaste

---

## ✅ PASO 4: Verificar que Funcione

### Verificar Script de Guardar Datos

Abrí esta URL en el navegador:
```
https://script.google.com/macros/s/TU_URL_SAVE_DATA/exec
```

Deberías ver:
```json
{"success":true,"message":"Script para guardar datos activo..."}
```

### Verificar Script de Premios

Abrí esta URL en el navegador:
```
https://script.google.com/macros/s/TU_URL_PRIZES/exec?callback=test
```

Deberías ver JavaScript ejecutable:
```javascript
test({"success":true,"prize":"Premio 1",...});
```

---

## 🎯 Flujo Completo

1. **Usuario completa formulario** → Click en "Continuar"
2. **Frontend llama a Script 1** → Guarda datos (POST, no-cors)
3. **Frontend llama a Script 2** → Asigna premio (GET, JSONP)
4. **Script 2 retorna premio** → Se guarda en el estado
5. **Usuario juega** → Cuando termina, ve el premio asignado

---

## 🐛 Troubleshooting

### Error: "No se encontró la función doGet" (Script de Premios)
- **Causa**: El script no está desplegado
- **Solución**: Redesplegá el script de premios

### Error: "No hay premios disponibles"
- **Causa**: No hay premios con stock disponible
- **Solución**: Verificá que la hoja "Premios" tenga premios con `Stock > Usados`

### Los datos no se guardan
- **Causa**: URL incorrecta o script no desplegado
- **Solución**: Verificá la URL del script de guardar datos

### El premio no se asigna
- **Causa**: URL incorrecta o error en JSONP
- **Solución**: Verificá la URL del script de premios y los logs en la consola

---

## ✅ Checklist Final

- [ ] Script 1 (guardar datos) creado y desplegado
- [ ] URL del Script 1 copiada
- [ ] Script 2 (premios) creado y desplegado
- [ ] URL del Script 2 copiada
- [ ] SHEET_ID correcto en Script 2
- [ ] URLs configuradas en `.env` o en el código
- [ ] Script 1 funciona (verificación GET)
- [ ] Script 2 funciona (verificación JSONP)
- [ ] Formulario guarda datos correctamente
- [ ] Premio se asigna correctamente
