# 🐛 Debug: Problemas con Asignación de Premios

## ✅ Lo que Funciona
- Guardado de datos del formulario ✅

## ❌ Lo que No Funciona
- Asignación de premios ❌

## 🔍 Pasos para Debuggear

### 1. Verificar la Hoja "Premios"

Asegurate de que tu Google Sheet tenga una hoja llamada **"Premios"** con este formato:

| Columna A | Columna B | Columna C |
|-----------|-----------|-----------|
| **Premio** | **Stock** | **Usados** |
| Premio 1 | 10 | 0 |
| Premio 2 | 5 | 2 |
| Premio 3 | 20 | 1 |

**Importante:**
- La primera fila son los headers (no se leen)
- Columna A = Nombre del premio
- Columna B = Stock total
- Columna C = Cantidad usada
- Debe haber al menos un premio con `Stock > Usados`

### 2. Verificar Logs en Google Apps Script

1. Abrí tu Google Sheet → **Extensiones** → **Apps Script**
2. Click en **"Ver"** → **"Registros de ejecución"**
3. Completá el formulario en tu app
4. Volvé a los logs y verificá si hay errores

Deberías ver logs como:
```
📊 Total de filas en sheet: 4
🎁 Premios disponibles: 2
🎯 Premio seleccionado: Premio 1
✅ Contador actualizado: 1/10
```

### 3. Verificar Consola del Navegador

Abrí la consola del navegador (F12) y completá el formulario. Deberías ver:

```
🎁 Intentando asignar premio...
🔗 URL del premio: https://script.google.com/...
📦 Respuesta del premio recibida: {success: true, prize: "Premio 1"}
✅ Premio asignado correctamente: Premio 1
```

### 4. Probar JSONP Manualmente

Abrí la consola del navegador y ejecutá:

```javascript
const callbackName = 'testCallback_' + Date.now();
window[callbackName] = (response) => {
  console.log('Respuesta:', response);
  delete window[callbackName];
};

const script = document.createElement('script');
script.src = 'https://script.google.com/macros/s/AKfycbxc-o8kBfmBO3EYKn82poE2NmEnyFqFVpKMdzmThbG04pj1-epuWqCSeL7D3rC5NELb_A/exec?action=selectAndAssignPrize&callback=' + callbackName;
script.onerror = () => console.error('Error cargando script');
document.head.appendChild(script);
```

Si funciona, deberías ver la respuesta en la consola.

### 5. Verificar que el Script Esté Actualizado

Asegurate de que el Google Apps Script tenga:
- ✅ Función `selectAndAssignPrize`
- ✅ Función `doGet` que maneja JSONP
- ✅ El script esté desplegado como "Aplicación web"
- ✅ Acceso configurado como "Cualquiera"

## 🎯 Problemas Comunes

### Error: "No hay premios disponibles"
- **Causa**: No hay premios con `stock > usados`
- **Solución**: Agregá premios o aumentá el stock

### Error: "Script function not found"
- **Causa**: El script no está desplegado o está desactualizado
- **Solución**: Redesplegá la aplicación web

### No se recibe respuesta JSONP
- **Causa**: El callback no se está ejecutando
- **Solución**: Verificá los logs de Apps Script y la consola del navegador

### El premio se asigna pero no se muestra
- **Causa**: El estado no se está actualizando correctamente
- **Solución**: Verificá que `setAssignedPrize` se esté llamando

## 📝 Checklist

- [ ] Hoja "Premios" existe y tiene el formato correcto
- [ ] Hay al menos un premio con stock disponible
- [ ] Google Apps Script está desplegado
- [ ] Los logs de Apps Script muestran actividad
- [ ] La consola del navegador no muestra errores
- [ ] El JSONP se está ejecutando correctamente
