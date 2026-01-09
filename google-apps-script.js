/**
 * Google Apps Script para manejar datos del formulario y premios
 * 
 * INSTRUCCIONES:
 * 1. Ve a tu Google Sheet: https://docs.google.com/spreadsheets/d/1jfJKGRTg96Xj1Y60T0YuPjmU_PHkbdChhEbsFOmloKc/edit
 * 2. Extensiones → Apps Script
 * 3. Pegá este código completo
 * 4. Guardá (Ctrl+S o Cmd+S)
 * 5. Desplegá como aplicación web (ver instrucciones abajo)
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
      dataSheet.getRange(1, 1, 1, 7).setValues([[
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
 * Selecciona y asigna un premio aleatorio basado en stock disponible
 * Usa probabilidad ponderada: premios con más stock tienen más probabilidad
 */
function selectAndAssignPrize(e) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Intentar encontrar la hoja "Premios", si no existe usar la primera hoja
    let prizesSheet = spreadsheet.getSheetByName("Premios");
    if (!prizesSheet) {
      // Si no existe "Premios", usar la primera hoja que no sea "Datos"
      const sheets = spreadsheet.getSheets();
      for (let i = 0; i < sheets.length; i++) {
        if (sheets[i].getName() !== "Datos") {
          prizesSheet = sheets[i];
          break;
        }
      }
      // Si no hay ninguna otra hoja, usar la primera
      if (!prizesSheet) {
        prizesSheet = spreadsheet.getSheets()[0];
      }
    }
    
    // Leer todos los premios
    const dataRange = prizesSheet.getDataRange();
    const values = dataRange.getValues();
    
    // Log para debugging (solo visible en Apps Script)
    Logger.log("📊 Total de filas en sheet: " + values.length);
    Logger.log("📋 Primera fila (headers): " + JSON.stringify(values[0]));
    
    // Filtrar premios con stock disponible (available > 0)
    // Asumimos formato: Columna A = Nombre, Columna B = Stock, Columna C = Usados
    const availablePrizes = [];
    for (let i = 1; i < values.length; i++) {
      const name = values[i][0];
      const stock = parseFloat(values[i][1]) || 0;
      const used = parseFloat(values[i][2]) || 0;
      const available = stock - used;
      
      Logger.log(`Premio ${i}: ${name}, Stock: ${stock}, Usados: ${used}, Disponible: ${available}`);
      
      if (name && stock > 0 && available > 0) {
        availablePrizes.push({
          name: String(name).trim(), // Asegurar que sea string y sin espacios
          stock: stock,
          used: used,
          available: available,
          rowIndex: i + 1 // Fila en el sheet (1-indexed)
        });
      }
    }
    
    Logger.log("🎁 Premios disponibles: " + availablePrizes.length);
    
    if (availablePrizes.length === 0) {
      Logger.log("❌ No hay premios disponibles");
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        prize: null,
        error: "No hay premios disponibles. Verificá que la hoja 'Premios' tenga premios con stock > 0 y usados < stock."
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Seleccionar premio aleatorio con probabilidad ponderada
    const totalAvailable = availablePrizes.reduce(function(sum, p) { return sum + p.available; }, 0);
    let random = Math.random() * totalAvailable;
    let selectedPrize = availablePrizes[0];
    
    for (let i = 0; i < availablePrizes.length; i++) {
      random -= availablePrizes[i].available;
      if (random <= 0) {
        selectedPrize = availablePrizes[i];
        break;
      }
    }
    
    Logger.log("🎯 Premio seleccionado: " + selectedPrize.name);
    
    // Actualizar contador de "Usados" en la columna C (índice 3)
    const newUsedCount = selectedPrize.used + 1;
    prizesSheet.getRange(selectedPrize.rowIndex, 3).setValue(newUsedCount);
    
    Logger.log("✅ Contador actualizado: " + newUsedCount + "/" + selectedPrize.stock);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      prize: selectedPrize.name,
      newUsedCount: newUsedCount,
      message: `Premio ${selectedPrize.name} asignado. Usados: ${newUsedCount}/${selectedPrize.stock}`
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log("❌ Error en selectAndAssignPrize: " + error.toString());
    Logger.log("Stack: " + error.stack);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      prize: null,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Asigna un premio específico y actualiza el contador de "Usados"
 * (Función legacy, mantenida por compatibilidad)
 */
function assignPrize(e) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const prizesSheet = spreadsheet.getSheetByName("Premios") || spreadsheet.getSheets()[0];
    
    const data = JSON.parse(e.postData.contents);
    const prizeName = data.prize;
    
    if (!prizeName) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Nombre del premio requerido"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Buscar el premio en el sheet
    const dataRange = prizesSheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === prizeName) {
        // Obtener valores actuales
        const currentStock = values[i][1] || 0;
        const currentUsed = values[i][2] || 0;
        
        // Verificar que haya stock disponible
        if (currentUsed >= currentStock) {
          return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: `Premio ${prizeName} sin stock disponible`
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        // Incrementar "Usados" en la columna C (índice 2, pero en getRange es columna 3)
        const newUsedCount = currentUsed + 1;
        prizesSheet.getRange(i + 1, 3).setValue(newUsedCount);
        
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          prize: prizeName,
          newUsedCount: newUsedCount,
          message: `Premio ${prizeName} asignado. Usados: ${newUsedCount}/${currentStock}`
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: `Premio ${prizeName} no encontrado`
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función para requests GET (necesaria para que la URL funcione)
 * Maneja peticiones GET para asignar premios usando JSONP (evita problemas de CORS)
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    const callback = e.parameter.callback;
    
    // Si hay una acción selectAndAssignPrize con callback, es JSONP
    if (action === "selectAndAssignPrize" && callback) {
      Logger.log("🎁 JSONP: Asignando premio...");
      Logger.log("📞 Callback: " + callback);
      
      // Llamar directamente a la función de asignar premio
      const mockEvent = {
        postData: {
          contents: JSON.stringify({ action: "selectAndAssignPrize" })
        }
      };
      const result = selectAndAssignPrize(mockEvent);
      const resultText = result.getContent();
      
      Logger.log("✅ JSONP: Resultado: " + resultText);
      
      // Retornar como JSONP (JavaScript que ejecuta el callback)
      return ContentService.createTextOutput(
        callback + "(" + resultText + ");"
      ).setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    // Si hay acción pero sin callback, retornar JSON normal (puede fallar por CORS)
    if (action === "selectAndAssignPrize") {
      Logger.log("🎁 GET: Asignando premio (sin callback)...");
      const mockEvent = {
        postData: {
          contents: JSON.stringify({ action: "selectAndAssignPrize" })
        }
      };
      const result = selectAndAssignPrize(mockEvent);
      const resultText = result.getContent();
      
      Logger.log("✅ GET: Resultado: " + resultText);
      
      return ContentService.createTextOutput(resultText)
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Respuesta normal para GET sin acción
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Google Apps Script activo. Usar ?action=selectAndAssignPrize&callback=nombreFuncion para JSONP."
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log("❌ GET Error: " + error.toString());
    const errorMessage = error.toString().replace(/'/g, "\\'").replace(/\n/g, " ");
    
    // Si hay callback, retornar JSONP con error
    if (e.parameter.callback) {
      return ContentService.createTextOutput(
        e.parameter.callback + "({success: false, error: '" + errorMessage + "'});"
      ).setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    // Si no hay callback, retornar JSON con error
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Endpoint principal que maneja ambas funciones
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    if (action === "saveFormData") {
      return saveFormData(e);
    } else if (action === "selectAndAssignPrize") {
      return selectAndAssignPrize(e);
    } else if (action === "assignPrize") {
      return assignPrize(e);
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Acción no válida. Usar 'saveFormData', 'selectAndAssignPrize' o 'assignPrize'"
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
 * Función de prueba (opcional)
 */
function test() {
  // Probar guardar datos
  const testData = {
    action: "saveFormData",
    fullName: "Test User",
    email: "test@example.com",
    phone: "1234567890",
    postalCode: "1234",
    city: "Buenos Aires",
    ageRange: "25-34",
    brand: "marlboro-red"
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
