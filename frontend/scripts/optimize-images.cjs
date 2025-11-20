const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const fs = require('fs');
const path = require('path');

const inputDir = 'public/image';
const outputDir = 'public/image-optimized';

async function optimizeImages() {
  try {
    // Crear directorio de salida si no existe
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const files = await imagemin([`${inputDir}/**/*.{jpg,jpeg,png}`], {
      destination: outputDir,
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8]
        })
      ]
    });

    console.log('Images optimized:', files.map(file => file.sourcePath));
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

optimizeImages();