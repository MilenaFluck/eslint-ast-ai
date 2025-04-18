export default {
  displayName: 'rule-creator-api',
  coverageDirectory: '../../coverage/apps/rule-creator-api',
  preset: '../../jest.preset-node.js',
  reporters: [
    'default',
    [
      'jest-sonar',
      {
        outputDirectory: './reports/apps/rule-creator-api',
        outputName: 'sonar-report.xml',
      },
    ],
    [
      'jest-junit',
      {
        outputDirectory: './reports/apps/rule-creator-api',
        outputName: 'junit-report.xml',
        suiteName: 'Rule Creator Api Tests',
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
