# Lineamientos Creativos - Activación Memotest

## 🎨 Dirección de Arte

### Concepto Visual

**"Verano Interactivo"**

La experiencia debe sentirse como un juego de playa digital. Colores vivos, tipografías legibles bajo el sol, y una sensación de diversión sin fricciones.

## 🖼️ Assets a Producir

### 1. Video de Marca (Crítico)

**Especificaciones Técnicas:**
- Duración: 5-8 segundos
- Formato: MP4, H.264
- Resolución: 1920x1080 (Full HD)
- Aspect Ratio: 16:9
- FPS: 30
- Peso máximo: 5MB
- Audio: No (o muted)

**Lineamiento Creativo:**
- Debe tener energía veraniega
- Transiciones rápidas y dinámicas
- Mostrar producto/marca de forma natural
- Sin locución (será visto en ambientes ruidosos)
- Subtítulos grandes si hay texto
- Alto contraste para visibilidad exterior

**Ejemplos de Contenido:**
- Producto en contexto de playa/verano
- Lifestyle shots rápidos
- Motion graphics de marca
- Combinación de video real + animación

### 2. Imagen Hero (Principal)

**Especificaciones:**
- Formato: JPG o WebP
- Resolución: 2400x1600px mínimo
- Peso máximo: 500KB (optimizada)
- Orientación: Landscape

**Concepto:**
- Playa, costa, o ambiente veraniego
- Puede incluir personas disfrutando
- Colores cálidos (amarillos, naranjas, celestes)
- Debe funcionar con overlay de texto blanco

### 3. Imagen Brand Moment

**Especificaciones:**
- Formato: JPG o WebP
- Resolución: 2400x1600px mínimo
- Peso máximo: 500KB
- Orientación: Landscape

**Concepto:**
- Debe ser diferente al Hero
- Más cercana a la marca
- Puede mostrar el producto
- Tropical, vibrante, energética

## 🎭 Animaciones y Micro-interacciones

### Implementadas

✅ Sol giratorio en Hero  
✅ Scroll hints animados  
✅ Progress bar en formulario  
✅ Confetti en cierre  
✅ Trofeo con bounce  
✅ Particles flotantes  

### Sugerencias Adicionales

**Si se requiere personalización:**

1. **Animación de carga del juego**
   - Actualmente: Loader circular
   - Alternativa: Icono de marca animado

2. **Transiciones entre secciones**
   - Actualmente: Scroll suave
   - Alternativa: Fade/Slide personalizado

3. **Feedback de formulario**
   - Actualmente: Colores y mensajes
   - Alternativa: Sonidos (opcional, cuidado en espacios públicos)

## 🎯 Mensajes Clave

### Hero Section

**Actual:**
> "Desafiá tu verano"  
> "Poné a prueba tu memoria en el memotest más divertido de la costa"

**Alternativas sugeridas:**
- "Jugá y ganá este verano"
- "¿Cuánto recordás? Probalo ahora"
- "El desafío playero que te vuela la cabeza"

### Brand Moment

**Actual:**
> "Estás a punto de jugar"  
> "Prepará tu memoria. El desaf��o empieza ahora."

**Alternativas sugeridas:**
- "Tu momento está por llegar"
- "Concentración máxima en 3... 2... 1..."
- "Ahora o nunca. ¿Estás list@?"

### Cierre

**Actual:**
> "¡Increíble!"  
> "Gracias por jugar"

**Alternativas sugeridas:**
- "¡Lo lograste!" / "¡Buen intento!"
- "Sos un/a crack de la memoria"
- "Tu verano acaba de mejorar"

## 📱 Consideraciones de Uso Exterior

### Legibilidad

✅ **Implementado:**
- Textos con drop-shadow
- Alto contraste (blanco sobre colores saturados)
- Tipografías bold/black
- Tamaños grandes (text-4xl, text-5xl)

### Interactividad

✅ **Implementado:**
- Botones grandes (py-5, px-8)
- Touch targets amplios
- Feedback visual inmediato
- Sin hover states críticos

### Performance

✅ **Implementado:**
- Animaciones ligeras
- Lazy loading de imágenes
- Viewport `once: true` (no re-renderiza)

## 🎬 Storyboard Sugerido

### Secuencia Completa (Para Video/GIF Demo)

1. **0:00-0:02** - Usuario llega, ve Hero animado
2. **0:02-0:05** - Scrollea, ve formulario
3. **0:05-0:10** - Completa formulario (fast-forward)
4. **0:10-0:15** - Ve Brand Moment (video de marca)
5. **0:15-0:25** - Juega al memotest
6. **0:25-0:30** - Ve pantalla de cierre, confetti

**Duración total del video demo:** 30 segundos

## 🎨 Paleta Extendida

### Colores Principales

```
Sky/Cielo: #38bdf8 (sky-400)
Cyan/Agua: #22d3ee (cyan-400)
Orange/Sol: #fb923c (orange-400)
Yellow/Arena: #fde047 (yellow-300)
Purple/Atardecer: #c084fc (purple-400)
Pink/Tropical: #f472b6 (pink-400)
```

### Uso Recomendado

- **Sky/Cyan**: Fondos principales, confianza
- **Orange/Yellow**: CTAs, acentos, energía
- **Purple/Pink**: Momentos especiales, cierre
- **White**: Textos principales, contraste

## 🖌️ Tipografía

### Actual (Default del Sistema)

Utiliza las fuentes del sistema con fallbacks.

### Si se Requiere Custom Font

**Recomendaciones:**

1. **Para Headings (h1, h2)**
   - Google Font: Poppins Bold/Black
   - Alternative: Montserrat Bold
   - Característica: Geométrica, legible, moderna

2. **Para Body Text**
   - Google Font: Inter Regular
   - Alternative: Open Sans
   - Característica: Alta legibilidad, optimizada para pantallas

### Implementación

Agregar en `/src/styles/fonts.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;900&family=Inter:wght@400;500&display=swap');

:root {
  --font-heading: 'Poppins', sans-serif;
  --font-body: 'Inter', sans-serif;
}
```

## 📸 Sesión Fotográfica (Si se Producen Assets Originales)

### Shot List Sugerido

**Para Hero:**
1. Wide shot de playa con personas jugando
2. Close-up de manos con celular en la playa
3. Grupo de amigos riendo al sol
4. Atardecer en la costa (dorado/naranja)

**Para Brand Moment:**
1. Producto en contexto playero
2. Detalle del producto con luz natural
3. Lifestyle shot con el producto
4. Plano cenital (desde arriba) estilo Instagram

### Dirección

- **Hora dorada**: Mejor luz para exteriores
- **Props**: Toallas coloridas, pelota de playa, sombrilla
- **Modelos**: Diversos, naturales, divirtiéndose
- **Expresiones**: Alegría, sorpresa, concentración

## 🎵 Audio (Opcional)

**Nota:** La experiencia está diseñada SIN audio por defecto (uso en espacios públicos).

**Si se requiere audio opcional:**

### Sound Design
- Click buttons: Suave, veraniego
- Success: Campanitas, alegre
- Error: Gentil, no agresivo
- Background: Muy sutil, ambiente de playa (opcional)

### Implementación
- Debe ser opt-in (botón de audio)
- Volumen bajo por defecto
- Iconos claros (mute/unmute)

## ✨ Elementos de Marca

### Logo Placement

**Sugerencias de ubicación:**

1. **Hero Section**: Esquina superior (opcional)
2. **Formulario**: Header del form (sutil)
3. **Brand Moment**: Watermark en video
4. **Cierre**: Grande, protagonista

### Brand Colors

Si la marca tiene colores específicos, sugerencias de integración:

- Usar en CTAs principales
- Progress bar del formulario
- Acentos y highlights
- Mantener legibilidad

## 📐 Grid y Espaciado

### Márgenes y Padding

**Mobile:**
- Padding lateral: 24px (px-6)
- Spacing vertical: 32-64px (space-y-8 to space-y-16)

**Desktop:**
- Max-width contenedores: 1280px (max-w-5xl)
- Centrado: mx-auto

### Proporciones

- Hero: Full viewport height (min-h-screen)
- Formulario: Adaptativo al contenido
- Juego: Aspect ratio 16:9 mínimo

## 🎯 KPIs de Diseño

### Métricas de Éxito

1. **Tiempo de carga inicial**: < 3 segundos
2. **Tasa de completado del form**: Meta 70%+
3. **Engagement con el juego**: Meta 80%+
4. **Shares**: Facilitar con botón nativo
5. **Repetición**: Meta 30%+ replay

### Testing

- [ ] Test en iPhone (Safari)
- [ ] Test en Android (Chrome)
- [ ] Test bajo luz solar directa
- [ ] Test en conexión lenta (3G)
- [ ] Test con personas reales en la calle

## 🚀 Next Level (Fase 2)

### Features Avanzados

1. **Leaderboard**: Ranking de mejores tiempos
2. **Prizes**: Integración con premios reales
3. **Social Sharing**: Cards personalizadas
4. **AR Filter**: Filtro de Instagram/TikTok
5. **QR Code**: Para activaciones físicas

---

**Para consultas creativas:**  
Todos los componentes son modificables.  
La estructura permite cambios rápidos sin romper la funcionalidad.
