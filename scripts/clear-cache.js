#!/usr/bin/env node

/**
 * Script para limpiar caché de desarrollo
 * Uso: node scripts/clear-cache.js
 */

const fs = require('fs');
const path = require('path');

console.log('🗑️ Limpiando caché de desarrollo...');

// Directorios a limpiar
const dirsToClean = [
  'build',
  'node_modules/.cache',
  '.cache',
  'dist'
];

// Archivos a eliminar
const filesToClean = [
  'package-lock.json',
  'yarn.lock'
];

let cleanedCount = 0;

// Función para eliminar directorio recursivamente
function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`✅ Eliminado: ${dirPath}`);
      cleanedCount++;
    } catch (error) {
      console.log(`⚠️ No se pudo eliminar: ${dirPath} - ${error.message}`);
    }
  }
}

// Función para eliminar archivo
function removeFile(filePath) {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ Eliminado: ${filePath}`);
      cleanedCount++;
    } catch (error) {
      console.log(`⚠️ No se pudo eliminar: ${filePath} - ${error.message}`);
    }
  }
}

// Limpiar directorios
dirsToClean.forEach(dir => {
  removeDir(dir);
});

// Limpiar archivos
filesToClean.forEach(file => {
  removeFile(file);
});

// Limpiar caché de npm si está disponible
try {
  const { execSync } = require('child_process');
  console.log('🧹 Limpiando caché de npm...');
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('✅ Caché de npm limpiado');
} catch (error) {
  console.log('⚠️ No se pudo limpiar caché de npm');
}

console.log(`\n🎉 Limpieza completada! ${cleanedCount} elementos eliminados.`);
console.log('\n📋 Próximos pasos:');
console.log('1. npm install (reinstalar dependencias)');
console.log('2. npm start (iniciar servidor de desarrollo)');
console.log('3. Ctrl+Shift+R (recargar sin caché en el navegador)'); 