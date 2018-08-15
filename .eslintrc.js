module.exports = {
  extends: [
    'cooperka/react-native',
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:flowtype/recommended',
  ],
  env: {
    browser: true,
    jest: true,
  },
  plugins: ['flowtype'],
  rules: {
    'no-underscore-dangle': 0,
    'import/no-unresolved': [
      2,
      {
        ignore: ['react', 'react-native'],
      },
    ],
    'import/no-extraneous-dependencies': 0,
    'import/extensions': 0,
    'react/no-unused-prop-types': 0,
    'react/no-typos': 0,
    'react/default-props-match-prop-types': 0,
    'prettier/prettier': [
      'error',
      {
        printWidth: 80,
        semi: true,
        singleQuote: true,
        trailingComma: 'all',
        useTabs: false,
      },
    ],
  },
};
