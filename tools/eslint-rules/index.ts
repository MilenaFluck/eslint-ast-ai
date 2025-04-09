import { useJestImports } from './rules/use-jest-imports';

module.exports = {
  rules: {
    'use-jest-imports': {
      meta: {
        fixable: 'code',
      },
      create: useJestImports,
    },
  },
};
