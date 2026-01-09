/**
 * Google Apps Script SOLO para asignar premios
 * 
 * INSTRUCCIONES:
 * 1. Ve a tu Google Sheet: https://docs.google.com/spreadsheets/d/1jfJKGRTg96Xj1Y60T0YuPjmU_PHkbdChhEbsFOmloKc/edit
 * 2. Extensiones → Apps Script
 * 3. Creá un SEGUNDO proyecto (o en otro Sheet)
 * 4. Pegá este código completo
 * 5. IMPORTANTE: Configurá el email de alerta en la línea 18 (ALERT_EMAIL)
 * 6. Guardá (Ctrl+S o Cmd+S)
 * 7. Desplegá como aplicación web con acceso "Cualquiera"
 * 8. Copiá la URL (la necesitarás para el frontend)
 * 
 * IMPORTANTE: Este script debe tener acceso al mismo Google Sheet
 */

// ⚠️ CONFIGURAR: Email al que se enviará la alerta cuando no haya premios
const ALERT_EMAIL = "tu-email@ejemplo.com"; // ⬅️ CAMBIÁ ESTE EMAIL

/**
 * Selecciona y asigna un premio aleatorio basado en stock disponible
 * Usa probabilidad ponderada: premios con más stock tienen más probabilidad
 */
function selectAndAssignPrize() {
  try {
    // IMPORTANTE: Reemplazá este ID con el ID de tu Google Sheet
    const SHEET_ID = "1jfJKGRTg96Xj1Y60T0YuPjmU_PHkbdChhEbsFOmloKc";
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    
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
      Logger.log("📧 Verificando configuración de email de alerta...");
      Logger.log("   ALERT_EMAIL configurado: " + ALERT_EMAIL);
      Logger.log("   ALERT_EMAIL es válido: " + (ALERT_EMAIL && ALERT_EMAIL !== "tu-email@ejemplo.com"));
      
      // Enviar alerta por email si está configurado
      if (ALERT_EMAIL && ALERT_EMAIL !== "tu-email@ejemplo.com") {
        Logger.log("📧 Intentando enviar email de alerta a: " + ALERT_EMAIL);
        try {
          sendStockAlertEmail(ALERT_EMAIL, SHEET_ID);
          Logger.log("✅ Email de alerta enviado correctamente a: " + ALERT_EMAIL);
        } catch (emailError) {
          Logger.log("❌ ERROR enviando email de alerta:");
          Logger.log("   Tipo de error: " + emailError.name);
          Logger.log("   Mensaje: " + emailError.message);
          Logger.log("   Stack: " + emailError.stack);
        }
      } else {
        Logger.log("⚠️ Email de alerta NO configurado o está usando el valor por defecto");
        Logger.log("   Para activarlo, cambiá ALERT_EMAIL en la línea 18 del script");
      }
      
      return {
        success: false,
        prize: null,
        error: "No hay premios disponibles. Verificá que la hoja 'Premios' tenga premios con stock > 0 y usados < stock."
      };
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
    
    return {
      success: true,
      prize: selectedPrize.name,
      newUsedCount: newUsedCount,
      message: `Premio ${selectedPrize.name} asignado. Usados: ${newUsedCount}/${selectedPrize.stock}`
    };
    
  } catch (error) {
    Logger.log("❌ Error en selectAndAssignPrize: " + error.toString());
    Logger.log("Stack: " + error.stack);
    return {
      success: false,
      prize: null,
      error: error.toString()
    };
  }
}

/**
 * Envía un email de alerta cuando no hay premios disponibles
 */
function sendStockAlertEmail(email, sheetId) {
  Logger.log("📧 ===== INICIO: Envío de email de alerta =====");
  Logger.log("   Email destino: " + email);
  Logger.log("   Sheet ID: " + sheetId);
  Logger.log("   Timestamp: " + new Date().toISOString());
  
  try {
    // Validar email
    if (!email || email === "" || email === "tu-email@ejemplo.com") {
      Logger.log("❌ Email no válido o no configurado");
      throw new Error("Email no configurado correctamente");
    }
    
    Logger.log("✅ Email válido: " + email);
    
    // Preparar contenido del email
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;
    const subject = "⚠️ ALERTA: Sin stock de premios disponibles";
    const body = `
¡Atención!

Se ha intentado asignar un premio pero NO HAY STOCK DISPONIBLE.

📊 Detalles:
- Todos los premios han sido utilizados (usados >= stock)
- Es necesario reponer stock en el Google Sheet
- Fecha/Hora: ${new Date().toLocaleString("es-AR")}

🔗 Acceder al Sheet:
${sheetUrl}

📝 Acción requerida:
1. Abrí el Google Sheet
2. Verificá la hoja "Premios"
3. Aumentá el stock de los premios o agregá nuevos premios

---
Este es un email automático generado por Google Apps Script.
    `.trim();
    
    Logger.log("📝 Contenido del email preparado:");
    Logger.log("   Asunto: " + subject);
    Logger.log("   Longitud del cuerpo: " + body.length + " caracteres");
    
    // Intentar enviar el email
    Logger.log("📤 Intentando enviar email con MailApp.sendEmail...");
    
    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: body,
    });
    
    Logger.log("✅ Email enviado exitosamente con MailApp.sendEmail");
    Logger.log("📧 ===== FIN: Email enviado correctamente =====");
    
  } catch (error) {
    Logger.log("❌ ===== ERROR EN ENVÍO DE EMAIL =====");
    Logger.log("   Tipo de error: " + (error.name || "Unknown"));
    Logger.log("   Mensaje: " + error.message);
    Logger.log("   Stack completo:");
    Logger.log(error.stack || "No hay stack trace disponible");
    Logger.log("📧 ===== FIN: Error en envío =====");
    
    // Intentar método alternativo si MailApp falla
    try {
      Logger.log("🔄 Intentando método alternativo con GmailApp...");
      GmailApp.sendEmail(email, subject, body);
      Logger.log("✅ Email enviado exitosamente con GmailApp");
    } catch (gmailError) {
      Logger.log("❌ GmailApp también falló:");
      Logger.log("   Error: " + gmailError.message);
    }
    
    throw error;
  }
}

/**
 * Endpoint GET para asignar premio (JSONP)
 */
function doGet(e) {
  try {
    const callback = e.parameter.callback;
    
    // Ejecutar la función de asignar premio
    const result = selectAndAssignPrize();
    const resultJson = JSON.stringify(result);
    
    Logger.log("✅ Resultado: " + resultJson);
    
    // Si hay callback, retornar como JSONP
    if (callback) {
      return ContentService.createTextOutput(
        callback + "(" + resultJson + ");"
      ).setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    // Si no hay callback, retornar JSON normal
    return ContentService.createTextOutput(resultJson)
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log("❌ Error en doGet: " + error.toString());
    const errorJson = JSON.stringify({
      success: false,
      prize: null,
      error: error.toString()
    });
    
    if (e.parameter.callback) {
      return ContentService.createTextOutput(
        e.parameter.callback + "(" + errorJson + ");"
      ).setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    return ContentService.createTextOutput(errorJson)
      .setMimeType(ContentService.MimeType.JSON);
  }
}
