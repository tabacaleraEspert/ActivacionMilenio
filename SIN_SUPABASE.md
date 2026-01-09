# ✅ Sistema sin Supabase - Solo Google Apps Script

## 🎯 ¿Qué cambió?

**Ya NO necesitás Supabase.** Todo funciona directamente con Google Apps Script.

---

## 📋 Configuración

### 1. Desplegar Google Apps Script

1. Ve a tu Google Sheet: https://docs.google.com/spreadsheets/d/1jfJKGRTg96Xj1Y60T0YuPjmU_PHkbdChhEbsFOmloKc/edit
2. Click en **"Extensiones" → "Apps Script"**
3. Abrí el archivo `google-apps-script.js` de este proyecto
4. **Copiá todo el contenido** y pegálo en el editor de Apps Script
5. **Guardá** (Ctrl+S o Cmd+S)
6. Click en **"Desplegar" → "Nueva implementación"**
7. Configurá:
   - **Tipo**: "Aplicación web"
   - **Nombre**: "Activacion Milenio API"
   - **Ejecutar como**: "Yo"
   - **Quién tiene acceso**: **"Cualquiera"** (importante!)
8. Click en **"Desplegar"**
9. **Autorizá los permisos** cuando te lo pida
10. **Copiá la URL del webhook** (algo como: `https://script.google.com/macros/s/AKfycby.../exec`)

### 2. Configurar URL en el Frontend (Opcional)

Si querés usar una URL personalizada, agregá esta variable de entorno:

**Creá o editá el archivo `.env` en la raíz del proyecto:**

```bash
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/TU_URL_AQUI/exec
```

**Nota:** Si no configurás esta variable, el código usa una URL por defecto que ya está en el código.

---

## 🔧 ¿Qué hace cada función?

### `saveFormData`
- Guarda los datos del formulario en la hoja "Datos"
- Se llama automáticamente cuando el usuario completa el formulario

### `selectAndAssignPrize`
- Lee todos los premios del sheet
- Filtra los que tienen stock disponible (`stock - usados > 0`)
- Selecciona uno aleatorio con probabilidad ponderada (más stock = más probabilidad)
- Actualiza automáticamente la columna "Usados"
- Retorna el premio seleccionado

---

## 📊 Flujo Completo

1. **Usuario completa el formulario** → Click en "Continuar"
2. **Sistema guarda datos** → Llama a `saveFormData` en Google Apps Script
3. **Sistema asigna premio** → Llama a `selectAndAssignPrize` en Google Apps Script
4. **Premio se guarda** → Se almacena en el estado de la app
5. **Usuario juega** → Cuando termina el tiempo, aparece el modal
6. **Usuario raspa** → Ve el premio que ya fue asignado

---

## ✅ Ventajas de no usar Supabase

- ✅ **Más simple**: Solo necesitás Google Sheets y Google Apps Script
- ✅ **Sin despliegue**: No necesitás configurar Supabase Edge Functions
- ✅ **Sin costos**: Google Apps Script es gratis (con límites razonables)
- ✅ **Todo en un lugar**: Datos y lógica en Google Sheets

---

## ⚠️ Limitaciones

- **Validación de email**: Ahora solo valida el formato, no verifica si el dominio existe (DNS)
- **Si necesitás validación DNS**: Tendrías que volver a usar Supabase o otro backend

---

## 🐛 Troubleshooting

### Error: "No hay premios disponibles"
- Verificá que el sheet tenga premios con `stock > 0` y `usados < stock`
- Verificá que la hoja se llame "Premios" o que sea la primera hoja

### Error: "Acción no válida"
- Verificá que el Google Apps Script tenga las funciones `saveFormData` y `selectAndAssignPrize`
- Verificá que la URL del script sea correcta

### Los datos no se guardan
- Verificá que el Google Apps Script esté desplegado como "Aplicación web"
- Verificá que el acceso sea "Cualquiera"
- Verificá los logs en Apps Script: "Ver" → "Registros de ejecución"

---

## 📝 Notas

- La validación de email ahora es más simple (solo formato)
- Si necesitás validación DNS más adelante, podés volver a usar Supabase
- El sistema funciona completamente offline una vez que el premio está asignado
