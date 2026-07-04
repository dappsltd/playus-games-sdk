import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  // Playus hosts serve bundles from a subpath (e.g. localhost:PORT/<gameId>/<version>/),
  // so built asset URLs must be relative.
  base: './',
  resolve: {
    alias: [
      {
        find: /^@playus\.club\/games-sdk\/(.+)$/,
        replacement: `${fileURLToPath(new URL('./src/playus', import.meta.url))}/$1`,
      },
      {
        find: '@playus.club/games-sdk',
        replacement: fileURLToPath(new URL('./src/playus/index.ts', import.meta.url)),
      },
    ],
  },
  server: {
    fs: {
      allow: [fileURLToPath(new URL('.', import.meta.url))],
    },
  },
});
