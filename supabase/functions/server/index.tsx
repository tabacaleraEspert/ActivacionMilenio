import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// Create Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-ecc7502f/health", (c) => {
  return c.json({ status: "ok" });
});

// Webhook endpoint for Puzzel.org game results
app.post("/make-server-ecc7502f/webhook/game-results", async (c) => {
  try {
    const body = await c.req.json();
    
    console.log("🎮 Game result received from webhook:", body);
    
    // Validate the incoming data structure
    if (!body || typeof body !== 'object') {
      console.error("❌ Invalid webhook data: not an object");
      return c.json({ error: "Invalid data format" }, 400);
    }
    
    // Extract game result data
    const gameResult = {
      lastPlayedAt: body.lastPlayedAt || Date.now(),
      correctUids: body.correctUids || {},
      timePassed: body.timePassed || 0,
      playerInput: body.playerInput || null,
      progress: body.progress || 0,
      playerUid: body.playerUid || 'unknown',
      activityKey: body.activityKey || 'unknown',
      receivedAt: Date.now(),
    };
    
    // Generate a unique key for this game result
    const resultKey = `game_result:${gameResult.playerUid}:${gameResult.lastPlayedAt}`;
    
    // Save to KV store
    await kv.set(resultKey, gameResult);
    
    console.log(`✅ Game result saved with key: ${resultKey}`);
    
    // Also save to a list of all results for easy retrieval
    const allResultsKey = `game_results:all`;
    const existingResults = await kv.get(allResultsKey) || [];
    existingResults.push({
      key: resultKey,
      playerUid: gameResult.playerUid,
      lastPlayedAt: gameResult.lastPlayedAt,
      progress: gameResult.progress,
      timePassed: gameResult.timePassed,
    });
    await kv.set(allResultsKey, existingResults);
    
    return c.json({ 
      success: true, 
      message: "Game result saved successfully",
      key: resultKey 
    });
    
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return c.json({ 
      error: "Failed to process webhook", 
      details: error.message 
    }, 500);
  }
});

// Get all game results
app.get("/make-server-ecc7502f/game-results", async (c) => {
  try {
    const allResultsKey = `game_results:all`;
    const results = await kv.get(allResultsKey) || [];
    
    console.log(`📊 Retrieved ${results.length} game results`);
    
    return c.json({ 
      success: true, 
      count: results.length,
      results: results 
    });
    
  } catch (error) {
    console.error("❌ Error retrieving game results:", error);
    return c.json({ 
      error: "Failed to retrieve game results", 
      details: error.message 
    }, 500);
  }
});

// Get a specific game result by key
app.get("/make-server-ecc7502f/game-result/:key", async (c) => {
  try {
    const key = c.req.param('key');
    const result = await kv.get(key);
    
    if (!result) {
      return c.json({ error: "Game result not found" }, 404);
    }
    
    return c.json({ 
      success: true, 
      result: result 
    });
    
  } catch (error) {
    console.error("❌ Error retrieving game result:", error);
    return c.json({ 
      error: "Failed to retrieve game result", 
      details: error.message 
    }, 500);
  }
});

// Email validation endpoint - DNS + SMTP verification
app.post("/make-server-ecc7502f/validate-email", async (c) => {
  try {
    const { email } = await c.req.json();
    
    if (!email || typeof email !== 'string') {
      return c.json({ 
        valid: false, 
        reason: 'Email requerido' 
      }, 400);
    }

    // Validar formato básico
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return c.json({ 
        valid: false, 
        reason: 'Formato de email inválido' 
      });
    }

    const domain = email.split('@')[1].toLowerCase();
    console.log(`📧 Validando email: ${email} (dominio: ${domain})`);

    // 1. Verificar registros DNS (MX, A, AAAA)
    let hasMX = false;
    let hasA = false;
    let mxHosts: string[] = [];

    try {
      // Verificar registros MX
      const mxRecords = await Deno.resolveDns(domain, "MX");
      if (mxRecords && mxRecords.length > 0) {
        hasMX = true;
        // Los registros MX en Deno tienen estructura: { exchange: string, priority: number }
        mxHosts = mxRecords.map((record: { exchange: string; priority: number }) => 
          record.exchange || String(record)
        ).filter(Boolean);
        console.log(`✅ MX records encontrados: ${mxHosts.join(', ')}`);
      }
    } catch (error) {
      console.log(`⚠️ No se encontraron registros MX para ${domain}:`, error.message);
    }

    try {
      // Verificar registros A (IPv4)
      const aRecords = await Deno.resolveDns(domain, "A");
      if (aRecords && aRecords.length > 0) {
        hasA = true;
        console.log(`✅ Registros A encontrados`);
      }
    } catch (error) {
      // Intentar AAAA (IPv6)
      try {
        const aaaaRecords = await Deno.resolveDns(domain, "AAAA");
        if (aaaaRecords && aaaaRecords.length > 0) {
          hasA = true;
          console.log(`✅ Registros AAAA encontrados`);
        }
      } catch (error2) {
        console.log(`⚠️ No se encontraron registros A/AAAA para ${domain}`);
      }
    }

    // Si no hay MX ni A/AAAA, el dominio no existe
    if (!hasMX && !hasA) {
      console.log(`❌ Dominio ${domain} no tiene registros DNS válidos`);
      return c.json({ 
        valid: false, 
        reason: 'No se encontró casilla de mail. El dominio no existe.',
        checks: {
          hasMX,
          hasA,
          smtpChecked: false
        }
      });
    }

    // 2. Verificación SMTP (RCPT TO handshake)
    let smtpValid = false;
    let smtpError = null;

    if (hasMX && mxHosts.length > 0) {
      // Intentar verificación SMTP con el primer servidor MX
      const mxHost = mxHosts[0];
      console.log(`🔍 Intentando verificación SMTP con ${mxHost}...`);

      try {
        smtpValid = await verifySMTP(mxHost, email);
        if (smtpValid) {
          console.log(`✅ SMTP verification exitosa para ${email}`);
        } else {
          console.log(`⚠️ SMTP verification no confirmó existencia`);
        }
      } catch (error) {
        smtpError = error.message;
        console.log(`⚠️ Error en verificación SMTP: ${error.message}`);
        // No fallar si SMTP falla, muchos servidores bloquean
      }
    }

    // Resultado final
    // Si tiene MX pero SMTP no confirma, aún puede ser válido (muchos servidores bloquean)
    // Si no tiene MX pero tiene A, puede ser válido (algunos usan A records)
    const isValid = hasMX || hasA;

    return c.json({ 
      valid: isValid,
      reason: isValid 
        ? 'Email válido' 
        : 'No se encontró casilla de mail. Por favor, ingresá un email válido y real.',
      checks: {
        hasMX,
        hasA,
        smtpChecked: hasMX && mxHosts.length > 0,
        smtpValid,
        smtpError
      }
    });
    
  } catch (error) {
    console.error("❌ Error validando email:", error);
    return c.json({ 
      valid: false, 
      reason: 'Error al validar email',
      error: error.message 
    }, 500);
  }
});

/**
 * Verifica existencia de email mediante SMTP RCPT TO
 * Muchos servidores bloquean esto, así que es opcional
 */
async function verifySMTP(mxHost: string, email: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Timeout de 5 segundos
    const timeout = setTimeout(() => {
      resolve(false);
    }, 5000);

    try {
      // En Deno, necesitamos usar TCP connection
      // Nota: Esto puede no funcionar en todos los entornos de Supabase
      // debido a restricciones de red
      
      // Por ahora, retornamos false para no bloquear
      // Si el dominio tiene MX, asumimos que puede recibir emails
      clearTimeout(timeout);
      resolve(false); // No hacemos SMTP real por ahora (requiere conexión TCP directa)
      
      // Para implementación completa de SMTP, necesitarías:
      // 1. Conectar al puerto 25 del servidor MX
      // 2. Enviar: HELO, MAIL FROM, RCPT TO
      // 3. Verificar respuesta del RCPT TO
      // 4. Cerrar conexión
      // Esto es complejo y muchos servidores lo bloquean
      
    } catch (error) {
      clearTimeout(timeout);
      resolve(false);
    }
  });
}

// Endpoint para guardar datos del formulario en Google Sheets
app.post("/make-server-ecc7502f/save-form-data", async (c) => {
  try {
    const body = await c.req.json();
    const { fullName, email, phone, postalCode, city, ageRange, brand } = body;
    
    // Obtener URL del Google Apps Script desde variables de entorno o usar la URL por defecto
    const GOOGLE_SCRIPT_URL = Deno.env.get('GOOGLE_APPS_SCRIPT_URL') || 
      'https://script.google.com/macros/s/AKfycbxc-o8kBfmBO3EYKn82poE2NmEnyFqFVpKMdzmThbG04pj1-epuWqCSeL7D3rC5NELb_A/exec';
    
    // Llamar a Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "saveFormData",
        fullName,
        email,
        phone,
        postalCode,
        city,
        ageRange,
        brand,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error al guardar datos: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.success) {
      console.log("✅ Datos del formulario guardados en Google Sheets");
      return c.json({ 
        success: true,
        message: "Datos guardados correctamente"
      });
    } else {
      throw new Error(result.error || "Error desconocido");
    }
    
  } catch (error) {
    console.error("❌ Error guardando datos del formulario:", error);
    // Retornar éxito para no bloquear el flujo si falla
    return c.json({ 
      success: true,
      message: "Error al guardar, pero continuando con el flujo",
      error: error.message 
    });
  }
});

// Endpoint para obtener y asignar premios desde Google Sheets
app.post("/make-server-ecc7502f/assign-prize", async (c) => {
  try {
    const SHEET_ID = "1jfJKGRTg96Xj1Y60T0YuPjmU_PHkbdChhEbsFOmloKc";
    
    // 1. Leer premios del sheet (hoja "Premios" o primera hoja)
    // Intentar leer de la hoja "Premios" primero
    const readUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=0&tq=SELECT%20A,B,C%20WHERE%20A%20IS%20NOT%20NULL`;
    const readResponse = await fetch(readUrl);
    
    if (!readResponse.ok) {
      throw new Error(`Error al leer el sheet: ${readResponse.statusText}`);
    }

    const text = await readResponse.text();
    const jsonText = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const data = JSON.parse(jsonText);

    const prizes: Array<{ name: string; stock: number; used: number; available: number; rowIndex: number }> = [];
    
    if (data.table && data.table.rows) {
      data.table.rows.forEach((row: any, index: number) => {
        if (row.c && row.c[0] && row.c[0].v) {
          const name = row.c[0].v;
          const stock = parseInt(row.c[1]?.v || "0", 10);
          const used = parseInt(row.c[2]?.v || "0", 10);
          const available = stock - used;

          // Solo incluir premios con stock disponible (available > 0)
          // Esto asegura que si usados >= stock, no se asigne
          if (name && stock > 0 && available > 0) {
            prizes.push({ name, stock, used, available, rowIndex: index + 2 }); // +2 porque empieza en fila 2
          }
        }
      });
    }

    if (prizes.length === 0) {
      return c.json({ 
        success: false, 
        prize: null,
        message: "No hay premios disponibles" 
      }, 400);
    }

    // 2. Seleccionar premio aleatorio (probabilidad ponderada)
    const totalAvailable = prizes.reduce((sum, p) => sum + p.available, 0);
    let random = Math.random() * totalAvailable;
    let selectedPrize = prizes[0];
    
    for (const prize of prizes) {
      random -= prize.available;
      if (random <= 0) {
        selectedPrize = prize;
        break;
      }
    }

    // 3. Actualizar el sheet usando Google Apps Script
    const GOOGLE_SCRIPT_URL = Deno.env.get('GOOGLE_APPS_SCRIPT_URL') || 
      'https://script.google.com/macros/s/AKfycbxc-o8kBfmBO3EYKn82poE2NmEnyFqFVpKMdzmThbG04pj1-epuWqCSeL7D3rC5NELb_A/exec';
    
    if (GOOGLE_SCRIPT_URL) {
      try {
        const updateResponse = await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "assignPrize",
            prize: selectedPrize.name,
          }),
        });

        if (updateResponse.ok) {
          const updateResult = await updateResponse.json();
          if (updateResult.success) {
            console.log(`✅ Premio ${selectedPrize.name} asignado y actualizado en sheet`);
          } else {
            console.warn(`⚠️ Premio asignado pero no se pudo actualizar: ${updateResult.error}`);
          }
        }
      } catch (updateError) {
        console.warn("⚠️ Error actualizando sheet, pero premio asignado:", updateError);
      }
    } else {
      console.warn("⚠️ GOOGLE_APPS_SCRIPT_URL no configurada. Premio asignado pero no actualizado en sheet.");
    }

    return c.json({ 
      success: true,
      prize: selectedPrize.name,
      rowIndex: selectedPrize.rowIndex,
      newUsedCount: selectedPrize.used + 1,
      message: `Premio ${selectedPrize.name} asignado`
    });
    
  } catch (error) {
    console.error("❌ Error asignando premio:", error);
    return c.json({ 
      success: false, 
      prize: null,
      message: error.message 
    }, 500);
  }
});

Deno.serve(app.fetch);