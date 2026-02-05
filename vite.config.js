import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For GitHub Pages: base must be '/REPO_NAME/' (e.g. '/Valentine/'). Use '/' for username.github.io.
export default defineConfig({
  plugins: [react()],
  base: '/Valentine/',
})
