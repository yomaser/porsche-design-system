module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  globals: {
    page: true,
    browser: true,
    context: true,
    jestPuppeteer: true,
  },
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:@typescript-eslint/recommended-requiring-type-checking'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prefer-arrow', 'react', 'fp'],
  rules: {
    '@typescript-eslint/adjacent-overload-signatures': 'error',
    '@typescript-eslint/array-type': 'error',
    '@typescript-eslint/ban-types': 'error',
    '@typescript-eslint/class-name-casing': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/consistent-type-assertions': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      {
        allowExpressions: true,
      },
    ],
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'explicit',
      },
    ],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/member-ordering': 'error',
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/no-empty-interface': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-namespace': 'error',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: false,
        varsIgnorePattern: 'h',
      },
    ],
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/prefer-for-of': 'off',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    '@typescript-eslint/quotes': ['error', 'single'],
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/triple-slash-reference': 'error',
    '@typescript-eslint/type-annotation-spacing': 'off',
    '@typescript-eslint/unified-signatures': 'error',
    'arrow-body-style': 'off',
    'arrow-parens': ['off', 'as-needed'],
    camelcase: 'error',
    'comma-dangle': 'off',
    complexity: 'off',
    'constructor-super': 'error',
    curly: 'error',
    'dot-notation': 'error',
    'eol-last': 'off',
    eqeqeq: ['error', 'smart'],
    'guard-for-in': 'error',
    'id-blacklist': ['error', 'any', 'Number', 'number', 'String', 'string', 'Boolean', 'boolean', 'Undefined'],
    'id-match': 'error',
    'import/no-extraneous-dependencies': 'off',
    'import/order': 'off',
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/utils-entry', '**/styles-entry'],
            caseSensitive: true,
            message: "Please don't use since it might cause circular dependencies.",
          },
        ],
        paths: [
          {
            name: 'change-case',
            message:
              'Please use paramCaseToCamelCase() util instead or do it yourself instead of pulling in a library.',
          },
          {
            name: '@porsche-design-system/utilities',
            message: 'Please use @porsche-design-system/utilities-v2 instead since the one used is not performant.',
          },
          {
            name: '@porsche-design-system/utilities-v2',
            importNames: ['color'],
            message: 'Please use getThemedColors() instead.',
          },
          {
            name: '@porsche-design-system/utilities-v2',
            importNames: [
              'border',
              'borderRadius',
              'borderWidth',
              'fontSize',
              'gridWidth',
              'spacing',
              'spacingFluid',
              'spacingStatic',
              'theme',
              'themeLight',
              'themeDark',
            ],
            message:
              'Please use individual variables instead, e.g. `spacingFluidSmall instead of `spacing.fluid.small` for better tree-shaking and smaller chunk sizes.',
          },
        ],
      },
    ],
    'linebreak-style': 'off',
    'max-classes-per-file': ['error', 1],
    'max-len': 'off',
    'new-parens': 'off',
    'newline-per-chained-call': 'off',
    'no-bitwise': 'error',
    'no-caller': 'error',
    'no-cond-assign': 'error',
    'no-console': 'error',
    'fp/no-throw': 'error',
    'no-debugger': 'error',
    'no-empty': 'error',
    'no-eval': 'error',
    'no-extra-semi': 'off',
    'no-fallthrough': 'off',
    'no-invalid-this': 'off',
    'no-irregular-whitespace': 'off',
    'no-multiple-empty-lines': 'off',
    'no-new-wrappers': 'error',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'no-throw-literal': 'error',
    'no-trailing-spaces': 'off',
    'no-undef-init': 'error',
    'no-underscore-dangle': 'error',
    'no-unsafe-finally': 'error',
    'no-unused-expressions': 'error',
    'no-unused-labels': 'error',
    'no-unused-vars': 'off',
    'no-var': 'error',
    'object-shorthand': 'error',
    'one-var': ['error', 'never'],
    'prefer-arrow/prefer-arrow-functions': 'error',
    'prefer-const': 'error',
    'react/jsx-uses-vars': 'error',
    'quote-props': 'off',
    radix: 'error',
    'space-before-function-paren': 'off',
    'space-in-parens': ['off', 'never'],
    'spaced-comment': 'error',
    'use-isnan': 'error',
    'valid-typeof': 'off',
  },
};
