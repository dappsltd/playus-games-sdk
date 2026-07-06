import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

const sdkEntry = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  build: {
    outDir: 'dist/sdk',
    emptyOutDir: true,
    lib: {
      entry: {
        index: sdkEntry('./src/playus/index.ts'),
        phaser: sdkEntry('./src/playus/engines/phaser/index.ts'),
        babylon: sdkEntry('./src/playus/engines/babylon/index.ts'),
        three: sdkEntry('./src/playus/engines/three/index.ts'),
        overlay: sdkEntry('./src/playus/overlay/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'phaser',
        '@babylonjs/core/Maths/math.color',
      ],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
    },
  },
});
