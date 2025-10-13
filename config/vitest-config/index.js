import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

export const baseConfig = {
  test: {
    globals: true,
    setupFiles: [resolve(__dirname, './setup.ts')],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'coverage/**',
        'dist/**',
        '**/*.d.ts',
        'cypress/**',
        'test{,s}/**',
        'test{,-*}.{js,cjs,mjs,ts,tsx,jsx}',
        '**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx}',
        '**/*{.,-}spec.{js,cjs,mjs,ts,tsx,jsx}',
        '**/__tests__/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
        '**/.{eslint,mocha,prettier}rc.{js,cjs,yml}'
      ]
    }
  }
};

export const reactConfig = {
  ...baseConfig,
  test: {
    ...baseConfig.test,
    environment: 'jsdom',
    setupFiles: [resolve(__dirname, './setup-react.ts')]
  }
};

export const nodeConfig = {
  ...baseConfig,
  test: {
    ...baseConfig.test,
    environment: 'node'
  }
};

export function createVitestConfig(config = {}, aliases = {}) {
  return defineConfig({
    ...config,
    ...baseConfig,
    resolve: {
      alias: {
        ...aliases
      }
    }
  });
}

export function createReactVitestConfig(config = {}, aliases = {}) {
  return defineConfig({
    ...config,
    ...reactConfig,
    resolve: {
      alias: {
        ...aliases
      }
    }
  });
}

export function createNodeVitestConfig(config = {}, aliases = {}) {
  return defineConfig({
    ...config,
    ...nodeConfig,
    resolve: {
      alias: {
        ...aliases
      }
    }
  });
}

export default baseConfig;