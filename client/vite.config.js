import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

function customHeadersPlugin() {
  return {
    name: 'configure-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
        next();
      });
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react(), customHeadersPlugin()],
  
  server: {
    https: {
      key: fs.readFileSync('https/key.pem'),
      cert: fs.readFileSync('https/cert.pem'),
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        // preserveHeaderKeyCase: true,
        // secure: false,
      }
    },
  },
  resolve: {
    alias: {
      "@cornerstonejs/tools": "@cornerstonejs/tools/dist/umd/index.js"
    },
  },
});
