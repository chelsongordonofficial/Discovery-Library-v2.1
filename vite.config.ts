import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: '**/*.svg?react',
    }),
  ],
  base: './',
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
  build: {
    cssCodeSplit: false, // always emit one CSS file
    rollupOptions: {
      output: {
        entryFileNames: 'homepage.js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] ?? assetInfo.name ?? '';
          return name.endsWith('.css')
            ? 'homepage.css'
            : 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});