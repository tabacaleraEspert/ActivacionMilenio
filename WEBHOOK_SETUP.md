# 🔗 Configuración del Webhook de Puzzel.org

## ⚠️ IMPORTANTE: PostMessage vs Webhook

**Puzzel.org probablemente NO usa postMessage** - Los mensajes que ves en el panel de debug son de extensiones del navegador (MetaMask, etc.), no del juego.

**Para recibir resultados, DEBES configurar el Webhook en puzzel.org**

## URL del Webhook

Tu endpoint webhook está listo y esperando recibir los resultados del juego:

```
https://usbkamwrbvkorkmebbof.supabase.co/functions/v1/make-server-ecc7502f/webhook/game-results
```

## 📋 Pasos para configurar en Puzzel.org

1. **Ve a la configuración de tu juego** en puzzel.org
2. **Busca la sección "Save via Webhook"** o "Webhook Settings"
3. **Pega la URL del webhook** en el campo correspondiente
4. **Guarda los cambios**

## 🔍 ¿Cómo verificar que funciona?

### Método 1: Usar el Panel de Debug (Ya implementado)
- Jugá una partida completa
- Debajo del juego verás un panel "📨 Mensajes Recibidos"
- Ahí aparecerán TODOS los postMessage que llegan del iframe

### Método 2: Ver los Logs en Supabase
1. Ve a tu dashboard de Supabase
2. Navega a **Edge Functions** → **Logs**
3. Deberías ver mensajes como:
   - `🎮 Game result received from webhook:`
   - `✅ Game result saved with key: ...`

### Método 3: Probar el endpoint manualmente
Podés testear que el webhook funciona con curl:

```bash
curl -X POST https://usbkamwrbvkorkmebbof.supabase.co/functions/v1/make-server-ecc7502f/webhook/game-results \
  -H "Content-Type: application/json" \
  -d '{
    "lastPlayedAt": 1704672000000,
    "correctUids": {"1": true, "2": true},
    "timePassed": 45,
    "playerInput": null,
    "progress": 1,
    "playerUid": "test-player-123",
    "activityKey": "test-activity"
  }'
```

Si funciona correctamente, recibirás:
```json
{
  "success": true,
  "message": "Game result saved successfully",
  "key": "game_result:test-player-123:1704672000000"
}
```

## 📊 Endpoints disponibles

### 1. Webhook para recibir resultados (POST)
```
POST /make-server-ecc7502f/webhook/game-results
```

**Datos que espera (enviados por puzzel.org):**
```json
{
  "lastPlayedAt": number,
  "correctUids": { [key: string]: boolean },
  "timePassed": number,
  "playerInput": any,
  "progress": number,
  "playerUid": string,
  "activityKey": string
}
```

### 2. Ver todos los resultados (GET)
```
GET /make-server-ecc7502f/game-results
```

**Respuesta:**
```json
{
  "success": true,
  "count": 10,
  "results": [
    {
      "key": "game_result:player-123:1704672000000",
      "playerUid": "player-123",
      "lastPlayedAt": 1704672000000,
      "progress": 1,
      "timePassed": 45
    }
  ]
}
```

### 3. Ver resultado específico (GET)
```
GET /make-server-ecc7502f/game-result/{key}
```

**Ejemplo:**
```
GET /make-server-ecc7502f/game-result/game_result:player-123:1704672000000
```

## 🛠️ Qué hace el backend automáticamente

✅ **Recibe** el POST request de puzzel.org  
✅ **Valida** la estructura de datos  
✅ **Guarda** el resultado individual en el KV store  
✅ **Actualiza** la lista de todos los resultados  
✅ **Responde** con confirmación a puzzel.org  
✅ **Registra logs** para debugging  

## 🎯 Próximos pasos (opcional)

Si querés mejorar la experiencia, podés:

1. **Vincular resultados con usuarios registrados**
   - Guardar el `playerUid` cuando el usuario se registra
   - Mostrar "Tus mejores tiempos" en vez de estadísticas globales

2. **Crear un ranking**
   - Ordenar por mejor tiempo
   - Mostrar top 10 jugadores

3. **Exportar datos**
   - Crear endpoint para descargar CSV con todos los resultados
   - Integrar con Google Sheets o Excel

4. **Notificaciones**
   - Enviar email cuando alguien completa el juego
   - Trigger de eventos para analytics

## ⚠️ Importante: Seguridad

- ✅ El endpoint acepta requests de cualquier origen (CORS abierto)
- ✅ No requiere autenticación (público para que puzzel.org pueda enviar datos)
- ⚠️ **NUNCA** expongas datos sensibles del usuario a través de estos endpoints
- ⚠️ Si vas a producción, considerá agregar autenticación o rate limiting

## 🐛 Troubleshooting

### "No llegan resultados al webhook"
1. Verificá que la URL en puzzel.org sea exacta (sin espacios)
2. Revisá los logs de Supabase Edge Functions
3. Probá el endpoint manualmente con curl
4. Verificá que el juego esté configurado para enviar webhooks

### "El panel de debug no muestra mensajes"
1. Abrí la consola del navegador (F12)
2. Deberías ver logs con 🔔 cuando lleguen postMessages
3. Si no ves nada, puede que puzzel.org no esté enviando postMessage al iframe

### "Error 500 en el webhook"
1. Revisá los logs de Supabase
2. Verificá que el formato de datos sea correcto
3. Asegurate que el KV store esté funcionando

---

## 📞 Contacto

Si tenés problemas, revisá:
- Los logs de Supabase Edge Functions
- La consola del navegador (F12)
- El panel de debug en la app

**¡Tu webhook está listo para recibir resultados!** 🎉