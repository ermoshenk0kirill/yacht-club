import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'   // ← Новый плагин

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})