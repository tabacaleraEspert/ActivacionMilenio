# 📹 Instrucciones para copiar los videos

Para que los videos funcionen, necesitas copiarlos a la carpeta `public/` con nombres simples.

## Opción 1: Usar el script (recomendado)

Ejecuta en tu terminal:

```bash
npm run move-videos
```

## Opción 2: Manualmente

Copia los videos desde la raíz del proyecto a la carpeta `public/` con estos nombres:

```bash
cd /Users/davorvindis/Desktop/Repositories/ActivacionMilenio

# Crear la carpeta public si no existe
mkdir -p public

# Copiar y renombrar los videos
cp "WhatsApp Video 2025-12-02 at 14.46.19.mp4" public/video1.mp4
cp "WhatsApp Video 2025-12-02 at 16.42.08.mp4" public/video2.mp4
cp "WhatsApp Video 2025-12-02 at 16.42.09.mp4" public/video3.mp4
```

## Verificar

Después de copiar, verifica que los archivos estén ahí:

```bash
ls -la public/
```

Deberías ver:
- video1.mp4
- video2.mp4
- video3.mp4

