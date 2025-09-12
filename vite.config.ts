import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
      babel: {
        plugins: [],
        babelrc: false,
        configFile: false
      }
    })
  ],
  server: {
    port: 3000
  }
})
