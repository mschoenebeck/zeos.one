module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'google',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'plugins': [
    '@typescript-eslint',
  ],
  'rules': {
    'linebreak-style': 0,
    'require-jsdoc': 0,
    'object-curly-spacing': 0,
    'eslint-disable-next-line': 0,
    'valid-jsdoc': 0,
    'new-cap': 0,
  },
  'overrides': [
    {
      'files': ['src/**'],
      'rules': {
        'quotes': [2, 'single'],
        'max-len': [2, { code: 140, ignorePattern: '^import .*' }],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
      },
    },
  ],
};
