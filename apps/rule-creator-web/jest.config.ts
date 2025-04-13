export default {
  displayName: 'rule-creator-web',
  coverageDirectory: '../../coverage/apps/rule-creator-web',
  preset: '../../jest.preset-angular.js',
  reporters: [
    'default',
    [
      'jest-sonar',
      {
        outputDirectory: './reports/apps/rule-creator-web',
        outputName: 'sonar-report.xml',
      },
    ],
    [
      'jest-junit',
      {
        outputDirectory: './reports/apps/rule-creator-web',
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
