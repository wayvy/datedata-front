/// <reference types="vitest" />
import { resolve } from 'path';

import { createReactVitestConfig } from '@repo/vitest-config';
import react from '@vitejs/plugin-react';

export default createReactVitestConfig(
  {
    plugins: [react()],
  },
  {
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
);
