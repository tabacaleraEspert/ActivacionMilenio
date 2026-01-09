# Guía de Implementación - Activación Memotest

## 🎯 Descripción General

Landing page mobile-first para activación de marca con juego de Memotest integrado desde Puzzel.org.

## 🏗️ Arquitectura

### Componentes Principales

1. **HeroSection** - Pantalla de bienvenida con impacto visual
2. **RegistrationForm** - Formulario con validación completa
3. **BrandMoment** - Respiro visual con contenido de marca
4. **GameSection** - Contenedor del juego embebido
5. **ClosingSection** - Cierre con CTA para compartir/replay

### Flujo de Usuario

```
Hero → Formulario → Brand Moment (5s) → Juego → Cierre
```

## 🎨 Paleta de Colores

### Sección Hero
- Gradiente: `sky-400 → sky-300 → orange-200`
- Sol: `yellow-300 → orange-400`

### Sección Formulario
- Gradiente: `orange-200 → pink-100 → purple-200`
- Progress bar: `purple-500 → pink-500`

### Brand Moment
- Gradiente: `purple-200 → sky-300 → sky-400`
- Acentos: `yellow-300`

### Juego
- Gradiente: `sky-400 → cyan-400 → blue-500`

### Cierre
- Gradiente: `blue-500 → purple-500 → pink-500`
- Trofeo: `yellow-300`

## 📝 Configuración del Formulario

### Campos Obligatorios

- **Nombre completo**: Min 3 caracteres
- **Email**: Validación con regex estándar
- **Teléfono**: Min 8 caracteres, formato internacional
- **Código Postal**: Solo números, min 4 dígitos
- **Ciudad**: Min 2 caracteres
- **Rango de edad**: Selector con opciones predefinidas
- **Marca habitual**: Selector con opciones predefinidas
- **Términos y condiciones**: Checkbox obligatorio

### Validación

Utiliza `react-hook-form` con modo `onChange` para validación en tiempo real.

## 🎮 Integración del Juego

### URL del Memotest

Editar en `/src/app/components/game-section.tsx`:

```tsx
<iframe
  src="TU_URL_DE_PUZZEL_ORG_AQUI"
  // ... resto de props
/>
```

### Recomendaciones

1. Crear el memotest en Puzzel.org
2. Configurar el juego en modo "sin registro"
3. Obtener el link de compartir público
4. Reemplazar la URL en el iframe

## 🎬 Video de Marca

### Ubicación

El placeholder está en `/src/app/components/brand-moment.tsx`

### Implementación

Descomentar y reemplazar:

```tsx
<video
  autoPlay
  muted
  loop
  playsInline
  className="w-full h-full object-cover"
>
  <source src="/ruta/tu-video.mp4" type="video/mp4" />
</video>
```

### Especificaciones Recomendadas

- Duración: 5-8 segundos
- Formato: MP4 (H.264)
- Relación de aspecto: 16:9
- Sin audio (o muted)
- Peso máximo: 5MB

## 🖼️ Imágenes

### Actual (Unsplash)

Las imágenes actuales provienen de Unsplash y son temporales.

### Para Producción

Reemplazar en cada componente:

1. **HeroSection**: Imagen de playa/costa
2. **BrandMoment**: Imagen tropical veraniega

## 📱 Responsive Design

### Mobile-First

Todos los componentes están optimizados para mobile primero.

### Breakpoints Tailwind

- `sm:` - 640px+
- `md:` - 768px+
- `lg:` - 1024px+

## ⚙️ Configuraciones Importantes

### Tiempos de Transición

Editar en `/src/app/App.tsx`:

```tsx
// Tiempo de visualización Brand Moment (default: 5000ms)
}, 5000); // 5 seconds to view brand moment
```

### Auto-scroll

El scroll automático está configurado pero puede deshabilitarse eliminando los `useEffect` correspondientes.

## 🔧 Personalización de Marca

### Logo/Nombre

Editar en `/src/app/components/closing-section.tsx`:

```tsx
<p className="text-4xl font-black text-white">
  TU MARCA
</p>
```

### Mensajes

Los mensajes principales están en español argentino (vos/voseo). Ajustar según región:

- "Jugá" → "Juega"
- "Probá" → "Prueba"
- "Desafiá" → "Desafía"

## 🚀 Despliegue

### Variables de Entorno

No hay variables de entorno requeridas para la versión básica.

### Build

```bash
npm run build
```

### Notas

- Los datos del formulario NO se persisten en esta versión
- Para almacenar datos, integrar con backend/CRM
- El juego es completamente funcional vía iframe

## 📊 Datos del Formulario

### Acceso a los Datos

Los datos se almacenan en el estado `formData` del componente principal.

### Para Integrar con Backend

En `/src/app/App.tsx`, modificar `handleFormComplete`:

```tsx
const handleFormComplete = async (data: FormData) => {
  // Enviar a tu backend
  await fetch('/api/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  setFormData(data);
  setCurrentStep("brand");
  // ... resto del código
};
```

## 🎭 Animaciones

### Librería

Motion (antes Framer Motion)

### Performance

Todas las animaciones usan `viewport={{ once: true }}` para ejecutarse una sola vez y optimizar rendimiento.

## 🐛 Debug Mode

Hay un panel de debug (oculto por defecto) en la esquina inferior derecha.

Para activarlo, remover la clase `hidden` en `/src/app/App.tsx`:

```tsx
<div className="fixed bottom-4 right-4 ... z-50">
  {/* Datos de debug aquí */}
</div>
```

## ✅ Checklist Pre-Lanzamiento

- [ ] Reemplazar URL del juego Puzzel.org
- [ ] Agregar video de marca real
- [ ] Reemplazar imágenes de Unsplash
- [ ] Actualizar nombre de marca en cierre
- [ ] Configurar integración con backend (si aplica)
- [ ] Ajustar opciones de selectores (edad, marcas)
- [ ] Revisar términos y condiciones
- [ ] Testear en dispositivos móviles reales
- [ ] Verificar funcionamiento en sol/exteriores
- [ ] Optimizar peso de imágenes/video

## 📞 Soporte Técnico

Para modificaciones adicionales, los componentes están bien documentados y son fácilmente extensibles.

---

**Versión**: 1.0  
**Última actualización**: Enero 2026
