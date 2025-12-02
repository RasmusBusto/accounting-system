import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/frontend/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 4200,
    strictPort: true,
    allowedHosts: ['snabel', 'localhost'],
    hmr: {
      host: 'snabel',
      clientPort: 80,
      path: '/',  // Don't use base path for WebSocket
    },
    proxy: {
      '/backend/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend/, ''),
      },
    },
  },
  preview: {
    port: 4200,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
  },
});
