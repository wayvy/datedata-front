/// <reference types="vitest" />
import { resolve } from 'path';

import { createReactVitestConfig } from '@repo/vitest-config';
import react from '@vitejs/plugin-react';

export default createReactVitestConfig(
  {
    plugins: [react()],
  },
  {
    '@repo/types': resolve(__dirname, '../types/src'),
    '@repo/types/*': resolve(__dirname, '../types/src/*'),
    '@repo/utils': resolve(__dirname, '../utils/src'),
    '@repo/utils/*': resolve(__dirname, '../utils/src/*'),
  },
);
