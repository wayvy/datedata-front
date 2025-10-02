import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    plugins: [
      react(),
      ...(isProd
        ? [
            compression({
              algorithms: ['gzip'],
              exclude: [/\.(br)$/, /\.(gz)$/],
            }),
            compression({
              algorithms: ['brotliCompress'],
              exclude: [/\.(br)$/, /\.(gz)$/],
            }),
          ]
        : []),
    ],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@repo/ui': resolve(__dirname, '../../packages/ui/src'),
        '@repo/ui/*': resolve(__dirname, '../../packages/ui/src/*'),
        '@repo/utils': resolve(__dirname, '../../packages/utils/src'),
        '@repo/utils/*': resolve(__dirname, '../../packages/utils/src/*'),
        '@repo/models': resolve(__dirname, '../../packages/models/src'),
        '@repo/models/*': resolve(__dirname, '../../packages/models/src/*'),
        '@repo/stores': resolve(__dirname, '../../packages/stores/src'),
        '@repo/stores/*': resolve(__dirname, '../../packages/stores/src/*'),
        '@repo/types': resolve(__dirname, '../../packages/types/src'),
        '@repo/types/*': resolve(__dirname, '../../packages/types/src/*'),
      },
    },
    css: {
      modules: {
        localsConvention: 'dashes',
        generateScopedName: isProd ? '[hash:base64:5]' : '[name]__[local]__[hash:base64:5]',
      },
    },
    server: {
      https: {
        key: '.ssl/key.pem',
        cert: '.ssl/cert.pem',
      },
      watch: {
        ignored: ['!**/node_modules/@repo/**'],
      },
      proxy: {
        '/api': {
          target: 'https://dev.datedata.dev',
          changeOrigin: true,
          secure: true,
        },
      },
    },
    build: {
      sourcemap: !isProd,
      assetsDir: 'static',
      rollupOptions: {
        treeshake: 'recommended',
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProd,
          drop_debugger: isProd,
        },
      },
    },
  };
});
