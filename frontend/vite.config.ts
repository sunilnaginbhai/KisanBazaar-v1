import { copyFileSync, mkdirSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const clientRoutes = ['login', 'register', 'profile', 'marketplace', 'cart', 'compare', 'reviews', 'directory', 'impact', 'features', 'ai-crop-advisor']

function staticRouteFallbacks() {
  return {
    name: 'static-route-fallbacks',
    writeBundle() {
      for (const route of clientRoutes) {
        const routeDirectory = `dist/${route}`
        mkdirSync(routeDirectory, { recursive: true })
        copyFileSync('dist/index.html', `${routeDirectory}/index.html`)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), staticRouteFallbacks()],
  server: {
    proxy: {
      '/api': 'https://kisanbazaar-1.onrender.com',
    },
  },
})
