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
    assetsDir: 'src',
  },
  server: {
    proxy: {
      '/was': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        ws: false,
        secure: false,
      },
      port: '5173', // 端口号
      open: 'true', // 是否自动打开浏览器
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
