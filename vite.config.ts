import react from '@vitejs/plugin-react'
// defineConfig de 'vitest/config', no de 'vite': la versión de vite no
// conoce el campo `test` y tsc -b lo rechaza (error real encontrado al
// verificar, no un supuesto).
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
})
