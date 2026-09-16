import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config — this tells Vite to use React
export default defineConfig({
  plugins: [react()],
})
