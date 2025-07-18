import eslintConfig from '@pynext-turbo/eslint-config-custom';

export default [
  ...eslintConfig,
  {
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
];