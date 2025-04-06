import eslint from '@eslint/js';
import * as tseslint from 'typescript-eslint';
import * as angular from 'angular-eslint';
import customEslintPlugin from './eslint-rules/custom-eslint-plugin.js';

export default tseslint.config(
  {
    files: ['**/*.ts'],
    plugins: { custom: customEslintPlugin },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      /*** Alternative in-built Lösung: ***/
      // "no-console": ["error", { "allow": ["warn", "error", "info"] }],
      "custom/no-console-log": "error",
      "custom/use-jest-imports": "warn",
      "custom/correct-order-of-lifecycle-hooks": "error"
    },
  },
  {
    files: ['**/*.html'],
    plugins: { custom: customEslintPlugin },
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);
