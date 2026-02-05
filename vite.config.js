import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base works on GitHub Pages at any path (e.g. .../Valentine/ or .../Valentine).
export default defineConfig({
  plugins: [react()],
  base: './',
})
