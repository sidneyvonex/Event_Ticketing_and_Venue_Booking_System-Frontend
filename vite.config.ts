import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import compression from 'vite-plugin-compression';
import rollupPolyfillNode from 'rollup-plugin-polyfill-node';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    compression(),
  ],
  resolve: {
    alias: {
      global: 'globalThis',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
      ],
    },
  },
  build: {
  minify: 'esbuild',
  sourcemap: false,
  rollupOptions: {
    treeshake: true,
    plugins: [
      rollupPolyfillNode(),
    ],
  },
},
});
