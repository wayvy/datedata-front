import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import sonarjs from 'eslint-plugin-sonarjs';
import prettierPlugin from 'eslint-plugin-prettier';
import { resolve } from 'path';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['node_modules/**', 'dist/**'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
    plugins: {
      import: importPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      sonarjs,
      prettier: prettierPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          project: resolve('./tsconfig.json'),
        },
      },
    },
    rules: {
      'no-alert': 'error',
      'no-console': 'warn',
      'no-redeclare': 'error',
      'no-var': 'error',
      curly: ['error', 'all'],
      quotes: ['error', 'single'],
      semi: 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'max-nested-callbacks': 'warn',
      'no-template-curly-in-string': 'error',
      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: ['const', 'let'], next: '*' },
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'any', prev: ['const', 'let'], next: ['const', 'let'] },
      ],

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-useless-constructor': 'error',

      'react/jsx-no-target-blank': 'off',
      'react/no-array-index-key': 'warn',
      'react/prefer-stateless-function': 'error',
      'react/display-name': 'off',
      'react/no-danger': 'error',
      'react/no-unused-prop-types': 'error',
      'react/no-multi-comp': 'error',
      'react/jsx-no-bind': [
        'error',
        {
          ignoreDOMComponents: true,
          ignoreRefs: true,
          allowArrowFunctions: false,
          allowFunctions: false,
          allowBind: false,
        },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'sonarjs/no-duplicate-string': ['error', { ignoreStrings: 'always-single-line,never-multi-line' }],
      'sonarjs/cognitive-complexity': ['error', 17],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          alphabetize: { order: 'asc' },
          'newlines-between': 'always',
          pathGroups: [
            {
              pattern: '@repo/**',
              group: 'external',
              position: 'after',
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: './**/*.scss',
              group: 'sibling',
              position: 'after',
            },
          ],
        },
      ],
      'import/no-cycle': 'warn',
      'import/default': 'off',
      'import/no-named-as-default': 'off',

      'prettier/prettier': 'error',
    },
  },
];
