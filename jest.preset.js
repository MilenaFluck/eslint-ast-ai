const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  globals: {},
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  collectCoverageFrom: ['**/src/lib/**/*.ts', '**/src/app/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/gen/', '/demo/', '.testdata.ts'],
  coverageReporters: ['text', 'json', 'lcov', 'cobertura'],
  snapshotFormat: { escapeString: false, printBasicPrototype: false },
};
