import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
// TODO base as dev/prod env
export default defineConfig({
  base: '/lwt',
  plugins: [react()],
  root: './src/renderer',

  build: {
    outDir: '../../dist',
  },
  define: {
    'process.env': process.env,
  },
});
