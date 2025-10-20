import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // wajib, supaya path assets benar di Netlify
});
