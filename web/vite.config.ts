import path from 'path';
import { defineConfig } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig({
  plugins: [
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      ],
      imports: [
        {
          './src/yuka': [
            ['Yuka', 'Yuka'],
            ['useYuka', 'useYuka'],
          ],
        },
      ],
    }),
  ],
  build: {
    outDir: '../app/html',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
