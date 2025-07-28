import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    compression(), // Adds gzip compression
  ],
  build: {
    minify: 'esbuild',
    sourcemap: false, // Prevents large .map files
  },
});