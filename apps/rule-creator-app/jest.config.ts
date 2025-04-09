export default {
  displayName: 'rule-creator-app',
  coverageDirectory: '../../coverage/apps/rule-creator-app',
  preset: '../../jest.preset-angular.js',
  reporters: [
    'default',
    [
      'jest-sonar',
      {
        outputDirectory: './reports/apps/rule-creator-app',
        outputName: 'sonar-report.xml',
      },
    ],
    [
      'jest-junit',
      {
        outputDirectory: './reports/apps/rule-creator-app',
        outputName: 'junit-report.xml',
        suiteName: 'Rule Creator Web Tests',
      },
    ],
    [
      'jest-slow-test-reporter',
      {
        numTests: 10,
        warnOnSlowerThan: 300,
        color: true,
      },
    ],
  ],
};
