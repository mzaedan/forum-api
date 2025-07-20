/* eslint-disable linebreak-style */
// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import daStyle from 'eslint-config-dicodingacademy';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      js,
      react: pluginReact,
    },
    rules: {
      'eol-last': 'off',
      'linebreak-style': 0,
      'react/react-in-jsx-scope': 'off',
    },
    extends: [
      js.configs.recommended,
    ],
  },
  {
    files: ['**/*.{js,jsx}'],
    ...pluginReact.configs.flat.recommended,
  },
  daStyle,
]);
