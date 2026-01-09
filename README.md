# 🏖️ Activación Memotest - Landing Page

Landing page mobile-first para activación de marca con juego de Memotest integrado.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias (si es necesario)
npm install

# Iniciar en desarrollo
npm run dev

# Build para producción
npm run build
```

## 📋 Estructura del Proyecto

```
src/
├── app/
│   ├── App.tsx                    # Componente principal con lógica de flujo
│   └── components/
│       ├── hero-section.tsx       # Pantalla de entrada
│       ├── registration-form.tsx  # Formulario con validación
│       ├── brand-moment.tsx       # Momento de marca con video
│       ├── game-section.tsx       # Contenedor del juego
│       └── closing-section.tsx    # Cierre con CTA
└── styles/
    ├── index.css                  # Estilos globales
    ├── theme.css                  # Tokens de diseño
    └── fonts.css                  # Fuentes personalizadas
```

## ✨ Características

- ✅ **Mobile-First**: Diseñado para dispositivos móviles primero
- ✅ **Validación Real**: Formulario con validación completa usando react-hook-form
- ✅ **Animaciones Suaves**: Micro-interacciones con Motion (Framer Motion)
- ✅ **Auto-scroll**: Flujo guiado entre secciones
- ✅ **Responsive**: Funciona en todos los tamaños de pantalla
- ✅ **Optimizado para Exterior**: Alto contraste y legibilidad bajo el sol
- ✅ **Sin Backend Requerido**: Funciona completamente en frontend

## 🎨 Stack Tecnológico

- **React 18.3.1** - Framework principal
- **TypeScript** - Tipado estático
- **Tailwind CSS v4** - Estilos utility-first
- **Motion** - Animaciones fluidas
- **React Hook Form 7.55.0** - Manejo de formularios
- **Lucide React** - Iconos
- **Vite** - Build tool

## 📱 Flujo de Usuario

```
1. Hero → Usuario ve pantalla de bienvenida animada
2. Formulario → Completa datos (validación en tiempo real)
3. Brand Moment → Ve contenido de marca (5s o skip con scroll)
4. Juego → Juega al Memotest embebido
5. Cierre → Ve resultados, puede compartir o jugar de nuevo
```

## 🔧 Configuración Básica

### 1. Validación de Email (Opcional pero Recomendado)

El formulario incluye validación de existencia de email usando **Mailboxlayer API** (250 verificaciones/mes gratis).

**Para activar la validación:**

1. Regístrate en [Mailboxlayer](https://mailboxlayer.com/) o [APILayer](https://apilayer.com/marketplace/email_verification-api) (gratis, sin tarjeta)
2. Obtén tu API key gratuita (250 verificaciones/mes)
3. Crea un archivo `.env` en la raíz del proyecto:
   ```bash
   VITE_MAILBOXLAYER_API_KEY=tu_api_key_aqui
   ```
4. Reinicia el servidor de desarrollo

**Alternativas disponibles:**
- **Mailboxlayer** (recomendado): 250 verificaciones/mes gratis
- Abstract API: 100 verificaciones/mes
- EmailVerify.io: 100 créditos gratis

**Nota:** Si no configurás la API key, el formulario solo validará el formato del email, pero no verificará si existe realmente.

### 2. URL del Juego (Crítico)

Editar en `/src/app/components/game-section.tsx`:

```tsx
<iframe
  src="TU_URL_DE_PUZZEL_ORG_AQUI"
  // ...
/>
```

### 3. Nombre de Marca

Editar en `/src/app/components/closing-section.tsx`:

```tsx
<p className="text-4xl font-black text-white">
  TU MARCA
</p>
```

### 4. Opciones del Formulario

Editar en `/src/app/components/registration-form.tsx`:

```tsx
// Rangos de edad
<option value="18-24">18-24 años</option>
// Agregar o modificar según necesidad

// Marcas
<option value="marca-a">Marca A</option>
// Agregar opciones reales
```

### 5. Video de Marca (Opcional)

En `/src/app/components/brand-moment.tsx`, descomentar y configurar:

```tsx
<video autoPlay muted loop playsInline>
  <source src="/ruta/tu-video.mp4" type="video/mp4" />
</video>
```

## 📄 Documentación Adicional

- **[IMPLEMENTACION.md](./IMPLEMENTACION.md)** - Guía técnica completa
- **[LINEAMIENTOS_CREATIVOS.md](./LINEAMIENTOS_CREATIVOS.md)** - Dirección de arte y assets

## 🎯 Para Producción

### Checklist

- [ ] Reemplazar URL del juego Puzzel.org
- [ ] Actualizar nombre de marca
- [ ] Agregar video de marca (si aplica)
- [ ] Reemplazar imágenes de Unsplash por assets originales
- [ ] Configurar opciones de selectores del formulario
- [ ] Integrar con backend (si se requiere persistencia)
- [ ] Testear en dispositivos móviles reales
- [ ] Verificar legibilidad en exteriores

### Optimizaciones Recomendadas

```bash
# Optimizar imágenes
# - Usar WebP cuando sea posible
# - Comprimir JPGs a 70-80% calidad
# - Tamaño máximo: 500KB por imagen

# Optimizar video
# - Formato: MP4 (H.264)
# - Duración: 5-8 segundos
# - Peso máximo: 5MB
```

## 🔌 Integración con Backend (Opcional)

Si necesitás persistir los datos del formulario:

```tsx
// En App.tsx, modificar handleFormComplete
const handleFormComplete = async (data: FormData) => {
  try {
    await fetch('https://tu-api.com/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Error al guardar:', error);
  }
  
  // Continuar con el flujo normal
  setFormData(data);
  setCurrentStep("brand");
  // ...
};
```

## 🎨 Personalización de Estilos

Los colores están definidos inline usando Tailwind CSS:

```tsx
// Cambiar gradientes
className="bg-gradient-to-b from-sky-400 to-orange-200"

// Cambiar colores de botones
className="bg-white text-sky-600"
```

Para cambios globales, editar `/src/styles/theme.css`.

## 🐛 Debug

Activar panel de debug (esquina inferior derecha):

En `/src/app/App.tsx`, remover clase `hidden`:

```tsx
<div className="fixed bottom-4 right-4 ... z-50">
  {/* Panel de debug */}
</div>
```

## 📊 Métricas Sugeridas

**Para trackear con analytics:**

- Tasa de llegada a formulario
- Tasa de completado de formulario
- Tiempo promedio en formulario
- Engagement con el juego
- Clicks en "Jugar de nuevo"
- Clicks en "Compartir"

## 🤝 Soporte

Para modificaciones o consultas técnicas, revisar los archivos de documentación o contactar al equipo de desarrollo.

## 📜 Licencia

Proyecto privado para activación de marca.

---

**Versión**: 1.0  
**Última actualización**: Enero 2026  
**Desarrollado para**: Activación de marca en la costa
