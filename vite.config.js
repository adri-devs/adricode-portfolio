import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1600,
    sourcemap: false,
    minify: 'terser'
  },
  server : {
    proxy: {
      '/api': {
        target: 'http://localhost',
        changeOrigin: true,
      }
    }
  }
})
