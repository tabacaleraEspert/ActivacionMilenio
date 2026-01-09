/**
 * Google Apps Script SOLO para guardar datos del formulario
 * 
 * INSTRUCCIONES:
 * 1. Ve a tu Google Sheet: https://docs.google.com/spreadsheets/d/1jfJKGRTg96Xj1Y60T0YuPjmU_PHkbdChhEbsFOmloKc/edit
 * 2. Extensiones → Apps Script
 * 3. Creá un NUEVO proyecto (o borrá todo y pegá esto)
 * 4. Pegá este código completo
 * 5. Guardá (Ctrl+S o Cmd+S)
 * 6. Desplegá como aplicación web con acceso "Cualquiera"
 * 7. Copiá la URL (la necesitarás para el frontend)
 */

/**
 * Guarda datos del formulario en la hoja "Datos"
 */
function saveFormData(e) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let dataSheet = spreadsheet.getSheetByName("Datos");
    
    // Crear hoja "Datos" si no existe
    if (!dataSheet) {
      dataSheet = spreadsheet.insertSheet("Datos");
      // Agregar headers
      dataSheet.getRange(1, 1, 1, 8).setValues([[
        "Fecha",
        "Nombre Completo",
        "Email",
        "Teléfono",
        "Código Postal",
        "Ciudad",
        "Rango de Edad",
        "Marca"
      ]]);
    }
    
    const data = JSON.parse(e.postData.contents);
    
    // Agregar nueva fila con los datos
    const timestamp = new Date().toLocaleString("es-AR");
    dataSheet.appendRow([
      timestamp,
      data.fullName || "",
      data.email || "",
      data.phone || "",
      data.postalCode || "",
      data.city || "",
      data.ageRange || "",
      data.brand || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Datos guardados correctamente"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Endpoint POST para guardar datos
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Verificar que tenga la acción correcta
    if (data.action === "saveFormData") {
      return saveFormData(e);
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Acción no válida. Usar 'saveFormData'"
      })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Endpoint GET (opcional, para verificar que funciona)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: "Script para guardar datos activo. Usar POST con action='saveFormData'"
  })).setMimeType(ContentService.MimeType.JSON);
}
