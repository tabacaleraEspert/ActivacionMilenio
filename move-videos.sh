#!/bin/bash
# Script para mover los videos de WhatsApp a la carpeta public

echo "📹 Moviendo videos de WhatsApp a la carpeta public..."

# Crear carpeta public si no existe
mkdir -p public

# Mover videos que empiezan con "WhatsApp"
for video in "WhatsApp"*.mp4; do
  if [ -f "$video" ]; then
    echo "Moviendo: $video"
    mv "$video" public/
  fi
done

echo "✅ Videos movidos exitosamente a public/"
echo "Los videos ahora están accesibles desde /nombre-del-video.mp4"

