import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { DEV_BACKEND_PORT, DEV_FRONTEND_PORT } from './src/config/site.js'

// https://vite.dev/config/  --this config designs
// this way when build make then it uses live url in the development--othherwise localhost url
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: DEV_FRONTEND_PORT,
    proxy: {
      // Product/avatar images are stored as relative /uploads/... paths.
      // API calls now hit the backend origin directly (see src/api/client.js).
      '/uploads': { target: `http://localhost:${DEV_BACKEND_PORT}`, changeOrigin: true },
    },
  },
})
