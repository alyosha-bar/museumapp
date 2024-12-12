import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // The key is the request path pattern, the value is the target server
      '/api': {
        target: 'http://localhost:3000', // The backend API server address
        changeOrigin: true, // Ensures the host header is correctly set
        secure: false, // Disable SSL verification if the target is HTTP (not HTTPS)
        rewrite: (path) => path.replace(/^\/api/, ''), // Optionally rewrite the path
      },
    }
  }
})
