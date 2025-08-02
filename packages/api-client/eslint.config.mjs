import eslintConfig from '@pynext-turbo/eslint-config-custom';

const config = [
  ...eslintConfig,
  {
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
];

export default config;