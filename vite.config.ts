import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  const base = process.env.NODE_ENV === 'development' ? '/' : (process.env.VITE_BASE || '/PICK-U-PARTY-GAME/');

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.ico',
          'apple-touch-icon.png',
          'icon-192.png',
          'icon-512.png',
          'app-icon.jpeg',
          'icon.svg',
        ],
        manifest: {
          id: './',
          name: "PICK'U PARTY",
          short_name: "PICK'U",
          description: 'Multiplayer Finger Roulette, Team Splitter, and Swipe Bottle Spin for Mobile Parties',
          theme_color: '#00f0ff',
          background_color: '#030712',
          display: 'standalone',
          orientation: 'portrait',
          start_url: './',
          scope: './',
          icons: [
            {
              src: './icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: './icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: './icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: './apple-touch-icon.png',
              sizes: '180x180',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: './app-icon.jpeg',
              sizes: '1024x1024',
              type: 'image/jpeg',
              purpose: 'any',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpeg,jpg,mp3,wav,woff,woff2}'],
          maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : undefined,
    },
  };
});
