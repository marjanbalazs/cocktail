module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    "plugin:import/typescript",
  ],
  rules: {
  },
};
