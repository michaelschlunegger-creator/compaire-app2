import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/compaire-app2/',
  plugins: [react()],
})
