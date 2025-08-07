export default {
  ignore: ['node_modules/**', 'dist/**', 'build/**'],
  plugins: [
    'stylelint-scss',
    'stylelint-prettier',
		"@stylistic/stylelint-plugin"
  ],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-prettier-scss',
  ],
  rules: {
    'prettier/prettier': true,
    'selector-class-pattern': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'function', 'if', 'for', 'each', 'include', 'mixin', 'else',
          'import', 'return', 'use', 'extend',
        ],
      },
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],

    '@stylistic/string-quotes': 'double',
    '@stylistic/selector-list-comma-space-after': 'always-single-line',
    '@stylistic/selector-list-comma-space-before': 'never-single-line',
    '@stylistic/value-list-comma-space-after': 'always',
    '@stylistic/value-list-comma-newline-before': 'never-multi-line',
    '@stylistic/value-list-comma-newline-after': 'never-multi-line',
  },
};
