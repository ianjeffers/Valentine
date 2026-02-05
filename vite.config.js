import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Must be '/Valentine/' for GitHub Pages. Always open the site with trailing slash.
export default defineConfig({
  plugins: [react()],
  base: '/Valentine/',
})
