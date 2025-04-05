import noConsoleLog from './no-console-log.js';
import useJestImports from './use-jest-imports.js';

const plugin = {
  rules: {
    'no-console-log': noConsoleLog,
    'use-jest-imports': useJestImports,
  }
};

export default plugin;
