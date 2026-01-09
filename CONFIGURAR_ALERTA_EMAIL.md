# 📧 Configurar Alerta por Email cuando se Acabe el Stock

## 🎯 ¿Qué hace?

Cuando un usuario intenta obtener un premio pero **NO hay premios disponibles** (todos los premios tienen `usados >= stock`), el sistema enviará automáticamente un email de alerta.

---

## ⚙️ Configuración

### Paso 1: Configurar el Email de Alerta

1. Abrí el archivo `google-apps-script-prizes.js`
2. Buscá la línea 18:
   ```javascript
   const ALERT_EMAIL = "tu-email@ejemplo.com"; // ⬅️ CAMBIÁ ESTE EMAIL
   ```
3. Reemplazá `"tu-email@ejemplo.com"` con tu email real:
   ```javascript
   const ALERT_EMAIL = "tu-email@gmail.com"; // ⬅️ Tu email aquí
   ```
4. Guardá el archivo

### Paso 2: Actualizar el Script en Google Apps Script

1. Ve a tu Google Sheet → **Extensiones** → **Apps Script**
2. Abrí el proyecto del script de premios
3. Copiá el código actualizado de `google-apps-script-prizes.js`
4. Pegalo en el editor (reemplazá todo)
5. **IMPORTANTE**: Verificá que el `ALERT_EMAIL` esté configurado correctamente
6. Guardá (Ctrl+S o Cmd+S)

### Paso 3: Autorizar Envío de Emails

La primera vez que el script intente enviar un email, Google te pedirá autorización:

1. Cuando se ejecute el script y no haya premios, Google mostrará un popup
2. Click en **"Revisar permisos"**
3. Seleccioná tu cuenta
4. Click en **"Avanzado"**
5. Click en **"Ir a [nombre del script] (no seguro)"**
6. Click en **"Permitir"**

**Nota**: Esto solo pasa la primera vez. Después funcionará automáticamente.

---

## 📧 Contenido del Email

El email de alerta incluirá:

- **Asunto**: "⚠️ ALERTA: Sin stock de premios disponibles"
- **Contenido**:
  - Mensaje de alerta
  - Link directo al Google Sheet
  - Instrucciones para reponer stock

---

## ✅ Verificación

Para probar que funciona:

1. **Opción A**: Esperar a que se acaben todos los premios naturalmente
2. **Opción B**: Simular manualmente:
   - Abrí tu Google Sheet
   - En la hoja "Premios", poné todos los valores de "Usados" iguales o mayores a "Stock"
   - Intentá asignar un premio desde la app
   - Deberías recibir el email de alerta

---

## 🐛 Troubleshooting

### No recibo el email

**Verificá:**
1. ✅ El `ALERT_EMAIL` está configurado correctamente (no es "tu-email@ejemplo.com")
2. ✅ El script está actualizado en Google Apps Script
3. ✅ Los permisos de email están autorizados
4. ✅ Revisá la carpeta de spam/correo no deseado
5. ✅ Verificá los logs de Apps Script: **"Ver" → "Registros de ejecución"**

### Error: "Authorization required"

**Solución:**
- Ejecutá manualmente la función `sendStockAlertEmail` desde el editor de Apps Script
- Google te pedirá autorización
- Una vez autorizado, funcionará automáticamente

### El email se envía pero no llega

**Posibles causas:**
- El email está en spam
- El dominio del remitente está bloqueado
- Verificá que el email esté bien escrito

---

## 📝 Notas

- El email se envía **solo cuando se intenta asignar un premio** y no hay stock disponible
- No se envía múltiples emails por el mismo evento (solo uno por intento)
- El email se envía desde la cuenta de Google asociada al script
- Puedes configurar múltiples emails separándolos por comas (requiere modificar el código)

---

## 🔧 Configurar Múltiples Emails (Opcional)

Si querés enviar el email a varias personas, modificá la función `sendStockAlertEmail`:

```javascript
function sendStockAlertEmail(emails, sheetId) {
  const emailList = emails.split(',').map(e => e.trim());
  // ... resto del código
  emailList.forEach(email => {
    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: body,
    });
  });
}
```

Y en la configuración:
```javascript
const ALERT_EMAIL = "email1@gmail.com, email2@gmail.com, email3@gmail.com";
```
