import noConsoleLog from './no-console-log.js';
import useJestImports from './use-jest-imports.js';
import correctOrderOfLifecycleHooks from './correct-order-of-lifecycle-hooks.js';

const plugin = {
  rules: {
    'no-console-log': noConsoleLog,
    'use-jest-imports': useJestImports,
    'correct-order-of-lifecycle-hooks': correctOrderOfLifecycleHooks,
  }
};

export default plugin;
