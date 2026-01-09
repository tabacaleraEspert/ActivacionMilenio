#!/bin/bash
# Script para copiar videos a public/

echo "📹 Copiando videos de WhatsApp a public/..."

# Crear carpeta public si no existe
mkdir -p public

# Copiar y renombrar videos
if [ -f "WhatsApp Video 2025-12-02 at 14.46.19.mp4" ]; then
  cp "WhatsApp Video 2025-12-02 at 14.46.19.mp4" public/video1.mp4
  echo "✅ video1.mp4 copiado"
fi

if [ -f "WhatsApp Video 2025-12-02 at 16.42.08.mp4" ]; then
  cp "WhatsApp Video 2025-12-02 at 16.42.08.mp4" public/video2.mp4
  echo "✅ video2.mp4 copiado"
fi

if [ -f "WhatsApp Video 2025-12-02 at 16.42.09.mp4" ]; then
  cp "WhatsApp Video 2025-12-02 at 16.42.09.mp4" public/video3.mp4
  echo "✅ video3.mp4 copiado"
fi

echo ""
echo "✅ Videos copiados! Verifica con: ls -la public/"

