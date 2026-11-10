import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the site from /<repo>/. Override with BASE_PATH=/ for local or custom-domain hosting.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/style-os/',
  plugins: [react()],
});
