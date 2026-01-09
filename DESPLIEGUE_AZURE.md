# 🚀 Despliegue en Azure Static Web Apps

## 📋 Tipo de Aplicación

Esta es una **Static Web App** (Aplicación Web Estática) porque:
- ✅ Se compila a archivos estáticos (HTML, CSS, JS)
- ✅ No requiere servidor backend propio
- ✅ Usa Google Apps Script como backend externo
- ✅ Perfecta para Azure Static Web Apps

---

## 🎯 Opción 1: Azure Static Web Apps (Recomendado)

### Ventajas
- ✅ Gratis para aplicaciones estáticas
- ✅ HTTPS automático
- ✅ CDN global
- ✅ Integración con GitHub (deploy automático)
- ✅ Muy fácil de configurar

### Pasos para Desplegar

#### 1. Crear el Recurso en Azure

1. Ve a [Azure Portal](https://portal.azure.com)
2. Click en **"Crear un recurso"**
3. Buscá **"Static Web Apps"**
4. Click en **"Crear"**
5. Configurá:
   - **Suscripción**: Tu suscripción
   - **Grupo de recursos**: Creá uno nuevo o usá existente
   - **Nombre**: `activacion-milenio` (o el que quieras)
   - **Plan de hospedaje**: **Gratis**
   - **Región**: La más cercana a tus usuarios
   - **Origen**: **GitHub** (si querés CI/CD automático) o **Otro**
   - Si elegiste GitHub:
     - Autorizá Azure
     - Seleccioná tu repositorio: `tabacaleraEspert/ActivacionMilenio`
     - **Rama**: `main`
     - **Ubicación de la aplicación**: `/` (raíz)
     - **Ubicación de la API**: (dejá vacío, no tenés API)
     - **Ubicación de la salida**: `dist` (Vite compila a `dist`)

#### 2. Configurar Build

Azure necesita saber cómo compilar tu app. Creá un archivo de configuración:

**Creá `.github/workflows/azure-static-web-apps.yml`** (si usás GitHub):

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: ""
          output_location: "dist"
```

**O configurá manualmente en Azure Portal:**
- Ve a tu Static Web App
- **"Configuración" → "Configuración de compilación"**
- **Ubicación de la aplicación**: `/`
- **Ubicación de la API**: (vacío)
- **Ubicación de la salida**: `dist`
- **Comando de compilación**: `npm run build`

#### 3. Variables de Entorno

Necesitás configurar las URLs de Google Apps Script:

1. En Azure Portal, ve a tu Static Web App
2. **"Configuración" → "Variables de aplicación"**
3. Agregá:
   - **Nombre**: `VITE_GOOGLE_SCRIPT_SAVE_DATA_URL`
   - **Valor**: `https://script.google.com/macros/s/AKfycbxz4Mtt62__aabtFbMIoMmY7YOuqS2v5lOzpQDpNwC7hSmUWMIxUP4mOfMCKQzjp0vYHw/exec`
4. Agregá otra:
   - **Nombre**: `VITE_GOOGLE_SCRIPT_PRIZES_URL`
   - **Valor**: `https://script.google.com/macros/s/AKfycbyolBkatt3RA7hIUNq77T9igvo4AGdLSaA2J6vuvl_27F8e22mp4VY6m7cJ-lM-HTBKCg/exec`

#### 4. Build Local (Opcional, para probar)

```bash
npm install
npm run build
```

Esto creará la carpeta `dist/` con los archivos estáticos.

---

## 🎯 Opción 2: Azure App Service (Alternativa)

Si preferís usar App Service (más complejo, pero más control):

1. Creá un **App Service** en Azure
2. Configurá **Node.js** como runtime
3. Desplegá desde GitHub o usando Azure CLI
4. Necesitarás configurar el build manualmente

**No recomendado** para esta app porque es más complejo y costoso.

---

## ✅ Checklist Pre-Despliegue

- [ ] Código en GitHub (✅ Ya está)
- [ ] Variables de entorno configuradas en Azure
- [ ] Google Apps Script desplegado y funcionando
- [ ] Build local funciona (`npm run build`)
- [ ] URLs de Google Apps Script correctas

---

## 🔧 Comandos Útiles

### Build Local
```bash
npm install
npm run build
```

### Preview Local
```bash
npm run dev
```

### Verificar Build
```bash
npm run build
ls -la dist/
```

---

## 📝 Notas Importantes

1. **Variables de Entorno**: En Azure Static Web Apps, las variables que empiezan con `VITE_` se inyectan en el build. Asegurate de configurarlas en Azure Portal.

2. **HTTPS**: Azure Static Web Apps incluye HTTPS automático y certificado SSL.

3. **Dominio Personalizado**: Podés agregar tu propio dominio desde Azure Portal → "Dominios personalizados".

4. **CORS**: Google Apps Script debe tener acceso "Cualquiera" para que funcione desde tu dominio de Azure.

---

## 🐛 Troubleshooting

### El build falla
- Verificá que `package.json` tenga el script `build`
- Revisá los logs en Azure Portal → "Registros de implementación"

### Las variables de entorno no funcionan
- Asegurate de que empiecen con `VITE_`
- Reiniciá la aplicación después de agregar variables
- Verificá que estén en "Variables de aplicación" (no "Configuración de la aplicación")

### CORS errors con Google Apps Script
- Verificá que los scripts estén desplegados con acceso "Cualquiera"
- Revisá la consola del navegador para ver errores específicos

---

## 🎉 Después del Despliegue

Tu app estará disponible en:
```
https://[nombre-de-tu-app].azurestaticapps.net
```

Azure te dará esta URL automáticamente después de crear el recurso.
