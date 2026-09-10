import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'MuscleMap',
        short_name: 'MuscleMap',
        description: 'Fast personal workout and muscle stimulus tracking',
        theme_color: '#0d3028',
        background_color: '#f3f4ee',
        display: 'standalone',
        start_url: '/',
      },
    }),
  ],
})
