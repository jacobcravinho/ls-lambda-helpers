module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    'jest/globals': true,
  },
  extends: ['eslint:recommended', 'prettier', 'plugin:jest/recommended'],
  parserOptions: {
    ecmaVersion: 13,
  },
  plugins: ['jest'],
  rules: {},
};
