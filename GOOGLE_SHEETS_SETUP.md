# 📊 Configuración de Google Sheets para Premios

## 📋 Requisitos

Para que el sistema funcione correctamente, necesitás:

### 1. **Hacer el Sheet Público (Solo Lectura)**

El sheet debe ser público para que el backend pueda leerlo:

1. Ve a tu Google Sheet: https://docs.google.com/spreadsheets/d/1jfJKGRTg96Xj1Y60T0YuPjmU_PHkbdChhEbsFOmloKc/edit
2. Click en **"Compartir"** (botón azul arriba a la derecha)
3. En "Obtener enlace", seleccioná **"Cualquier persona con el enlace"**
4. Asegurate de que el permiso sea **"Visualizador"** (solo lectura)
5. Copiá el enlace

### 2. **Estructura del Sheet**

El sheet debe tener esta estructura:

| Premios | Stock | Usados |
|---------|-------|--------|
| Buzo    | 1     | 0      |
| Remera  | 2     | 0      |
| Gorra   | 3     | 0      |
| ...     | ...   | ...    |

- **Columna A**: Nombre del premio
- **Columna B**: Stock total
- **Columna C**: Cantidad usada

### 3. **Actualización Automática (Opcional)**

Actualmente, el sistema:
- ✅ Lee los premios del sheet
- ✅ Selecciona uno aleatorio basado en stock disponible
- ⚠️ **NO actualiza automáticamente** la columna "Usados"

**Para actualizar automáticamente, necesitás:**

#### Opción A: Google Apps Script (Recomendado)

1. En tu Google Sheet, ve a **Extensiones → Apps Script**
2. Pegá este código:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    const prizeName = data.prize;
    const rowIndex = data.rowIndex;
    
    // Buscar la fila del premio
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === prizeName) {
        // Incrementar "Usados" en la columna C (índice 2)
        const currentUsed = values[i][2] || 0;
        sheet.getRange(i + 1, 3).setValue(currentUsed + 1);
        break;
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({success: true}));
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}));
  }
}
```

3. Guardá el script
4. Desplegá como aplicación web:
   - Click en **"Desplegar" → "Nueva implementación"**
   - Tipo: **"Aplicación web"**
   - Ejecutar como: **"Yo"**
   - Acceso: **"Cualquiera"**
   - Copiá la URL del webhook

5. Actualizá el endpoint en `supabase/functions/server/index.tsx` para llamar a este webhook después de asignar el premio.

#### Opción B: Actualización Manual

Por ahora, el sistema muestra en los logs:
- Qué premio se asignó
- Qué fila actualizar
- Nuevo valor de "Usados"

Podés actualizar manualmente el sheet cuando veas estos logs.

---

## 🔧 Cómo Funciona

### Flujo Actual:

1. Usuario completa el juego
2. Modal aparece con "Raspa y Gana"
3. Componente llama a `/assign-prize` endpoint
4. Backend:
   - Lee el Google Sheet
   - Filtra premios con stock disponible (stock - usados > 0)
   - Selecciona uno aleatorio (probabilidad ponderada por stock)
   - Retorna el premio seleccionado
5. Usuario raspa y ve el premio
6. **IMPORTANTE**: Actualizar manualmente el sheet o configurar Google Apps Script

### Selección de Premios:

El sistema usa **probabilidad ponderada**:
- Premios con más stock disponible tienen más probabilidad de salir
- Ejemplo: Si hay 50 Tabacos y 1 Buzo, es más probable que salga Tabaco

---

## 🧪 Testing

Para probar:

1. Asegurate de que el sheet sea público
2. Verificá que haya premios con stock disponible
3. Jugá el juego hasta que termine el tiempo
4. Raspa la tarjeta
5. Verificá en los logs de Supabase que se asignó el premio correcto
6. Actualizá manualmente el sheet si es necesario

---

## 📝 Notas Importantes

- **El sheet debe ser público** para que funcione la lectura
- **La actualización automática requiere Google Apps Script** o credenciales de servicio
- **Los premios se seleccionan aleatoriamente** pero con probabilidad ponderada
- **Solo se asignan premios con stock disponible** (stock - usados > 0)

---

## 🚀 Próximos Pasos

Si querés actualización automática completa:

1. Configurá Google Apps Script (ver arriba)
2. Actualizá el endpoint para llamar al webhook después de asignar
3. O implementá Google Sheets API con credenciales de servicio (más complejo)
