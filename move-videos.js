import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📹 Copiando y renombrando videos de WhatsApp a la carpeta public...');

// Crear carpeta public si no existe
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Obtener todos los archivos en la raíz que empiezan con "WhatsApp"
const rootDir = __dirname;
const files = fs.readdirSync(rootDir);

// Filtrar solo los videos de WhatsApp
const whatsappVideos = files.filter(file => 
  file.startsWith('WhatsApp') && file.endsWith('.mp4')
).sort(); // Ordenar para mantener consistencia

let copiedCount = 0;
const videoNames = [];

whatsappVideos.forEach((file, index) => {
  const sourcePath = path.join(rootDir, file);
  // Renombrar a nombres simples sin espacios: video1.mp4, video2.mp4, etc.
  const newName = `video${index + 1}.mp4`;
  const destPath = path.join(publicDir, newName);
  
  try {
    // Copiar en lugar de mover para mantener los originales
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ Copiado: ${file} → ${newName}`);
    videoNames.push(newName);
    copiedCount++;
  } catch (error) {
    console.error(`❌ Error copiando ${file}:`, error.message);
  }
});

console.log(`\n✅ ${copiedCount} video(s) copiado(s) exitosamente a public/`);
console.log('Los videos ahora están accesibles desde:');
videoNames.forEach(name => {
  console.log(`  - /${name}`);
});
console.log('\n💡 Actualiza el componente brand-moment.tsx para usar estos nombres.');

