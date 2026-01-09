# 🔴 Error 401 Unauthorized - Solución

## ¿Qué significa el error?

```
POST https://usbkamwrbvkorkmebbof.supabase.co/functions/v1/make-server-ecc7502f/webhook/game-results 401 (Unauthorized)
```

Este error indica que **Supabase está rechazando las peticiones al webhook** porque las Edge Functions por defecto requieren autenticación con JWT (JSON Web Token).

---

## ¿Por qué pasa esto?

**Supabase Edge Functions tienen seguridad por defecto:**
- Todas las funciones requieren un header `Authorization: Bearer <token>`
- El token debe ser válido (ANON_KEY o SERVICE_ROLE_KEY)
- Esto previene que cualquiera pueda llamar tus endpoints

**El problema:**
- Puzzel.org NO puede enviar tokens de autorización
- Los webhooks externos necesitan endpoints **públicos**
- Tu frontend SÍ tiene el token (por eso el botón de prueba puede funcionar)

---

## ✅ Soluciones

### Opción 1: Usar el publicAnonKey (Implementado)

El código del frontend YA está enviando el header correcto:

```typescript
headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${publicAnonKey}`,
}
```

**Probá el botón "🧪 Probar Webhook"** debajo del juego para verificar que funciona desde tu frontend.

---

### Opción 2: Configurar Endpoint Público en Supabase

Para que **Puzzel.org** pueda enviar datos sin token, necesitás hacer el endpoint público.

**IMPORTANTE:** Esto NO es posible directamente en Figma Make. Supabase requiere configuración adicional que está fuera del alcance de este entorno.

---

## 🎯 Estrategia Recomendada

Dado que el webhook **necesita ser público** para que puzzel.org lo use, te recomiendo:

### **Usar webhook.site o similares para testing**

1. **Andá a https://webhook.site**
2. **Copiá la URL única** que te dan (ej: `https://webhook.site/abc123`)
3. **Configurá esa URL en puzzel.org**
4. **Probá el juego** - los resultados llegarán a webhook.site
5. **Verificá que puzzel.org envía los datos correctamente**

Una vez que sepas que puzzel.org funciona, podés:

### **Capturar resultados en el frontend**

Ya que el problema está en que el endpoint de Supabase requiere autenticación, podemos modificar la estrategia:

**1. Escuchar postMessage** (Ya implementado)
   - Si puzzel.org envía postMessage, lo capturamos
   
**2. Enviar al backend desde el frontend** (Solución alternativa)
   - Cuando el usuario completa el juego
   - El frontend (que SÍ tiene el token) envía los datos al webhook
   - El webhook guarda en Supabase

---

## 🔧 Implementación Alternativa

Voy a crear una función que envíe los resultados desde el frontend cuando se detecten:

```typescript
// En game-section.tsx
const sendResultToWebhook = async (result: GameResult) => {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-ecc7502f/webhook/game-results`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`, // Token del frontend
        },
        body: JSON.stringify(result),
      }
    );
    
    if (response.ok) {
      console.log("✅ Resultado enviado a webhook correctamente");
    }
  } catch (error) {
    console.error("❌ Error enviando resultado:", error);
  }
};
```

---

## 🧪 Testing Inmediato

**1. Probá el botón "🧪 Probar Webhook"**
   - Está debajo del juego
   - Click → Envía un resultado de prueba
   - Si funciona: Verás mensaje verde ✅
   - Si falla: Verás mensaje rojo ❌ con detalles

**2. Verificá los resultados guardados**
   - Click en el botón flotante morado 💾 (abajo derecha)
   - Deberías ver el resultado de prueba guardado

**3. Si el test funciona:**
   - El backend está OK
   - El problema es solo que puzzel.org no puede autenticarse
   - Solución: Capturar en el frontend y reenviar

---

## 📊 ¿Qué hacer ahora?

### Si el botón de prueba FUNCIONA ✅:
```
1. El webhook está funcionando correctamente
2. Solo necesitamos capturar los resultados en el frontend
3. Voy a modificar el código para auto-enviar al webhook
```

### Si el botón de prueba FALLA ❌:
```
1. Hay un problema con el backend de Supabase
2. Revisá los logs en Supabase Dashboard
3. Verificá que las Edge Functions estén deployadas
```

---

## 🎯 Próximo Paso

**Probá el botón "🧪 Probar Webhook" AHORA** y decime qué resultado te da:

- ✅ **Verde (Success):** El webhook funciona, solo falta capturar datos de puzzel.org
- ❌ **Rojo (Error):** Hay un problema con el backend que necesitamos resolver

---

## 💡 Nota sobre Producción

Para un entorno de producción real, considerá:

1. **Usar un servicio de webhook intermediario:**
   - Zapier
   - Make.com (Integromat)
   - n8n
   - Webhook.site Pro

2. **Configurar proxy público:**
   - Cloudflare Workers
   - Vercel Edge Functions
   - Netlify Functions

3. **Reconfigurar Supabase:**
   - Crear endpoint público específico
   - Validar requests por IP o secret key
   - Rate limiting

---

**¡Probá el botón de prueba y avisame qué pasa!** 🚀
