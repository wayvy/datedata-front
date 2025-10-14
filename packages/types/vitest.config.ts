/// <reference types="vitest" />
import { resolve } from 'path';

import { createNodeVitestConfig } from '@repo/vitest-config';

export default createNodeVitestConfig(
  {},
  {
    '@repo/utils': resolve(__dirname, '../utils/src'),
    '@repo/utils/*': resolve(__dirname, '../utils/src/*'),
  },
);
