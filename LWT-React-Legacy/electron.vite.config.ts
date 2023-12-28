import react from '@vitejs/plugin-react';
import { defineConfig } from 'electron-vite';
import path from 'path';

export default defineConfig({
  main: {
    resolve: {
      alias: {
        // Your other aliases if you have some
        'mock-aws-s3': path.resolve(__dirname, 'src/main/empty.ts'),
        'aws-sdk': path.resolve(__dirname, 'src/main/empty.ts'),
        nock: path.resolve(__dirname, 'src/main/empty.ts'),
      },
    },
  },
  preload: {},
  renderer: {
    base: '/lwt',

    plugins: [react()],

    define: {
      'process.env': process.env,
    },
  },
});
