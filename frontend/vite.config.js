import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    https: true,         // ✅ serve over HTTPS!
    host: '0.0.0.0',
    port: 5173,
    strictPort: true
  },
  build: {
    sourcemap: true
  },
  define: {
    'process.env': process.env
  }
});
