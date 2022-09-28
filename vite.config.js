import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(),
  VitePWA({
    registerType: 'autoUpdate',
    injectRegister: 'inline',
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,svg,png,webp}']
    },
    includeAssets: ['logo.png', 'mask.svg'],
    manifest:{
      name: 'Profilbegrünung',
      short_name: 'Profilbegrünung',
      description: 'Mit diesen Tool können Profilbilder begrünt werden. Das heißt ihr könnt verschiedene Logos, den Wahlkampfslogan und einen Wahlaufruf hinzufügen',
      theme_color: '#005A50',
      icons: [
        {
          src: 'logo-512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'logo-192.png',
          sizes: '192x192',
          type: 'image/png'
        }
      ]
    }
  })]
})
