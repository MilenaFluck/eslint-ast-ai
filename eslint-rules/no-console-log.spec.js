import { RuleTester } from 'eslint';
import rule from './no-console-log.js'; // adjust path based on your structure

const ruleTester = new RuleTester();

ruleTester.run('no-console-log', rule, {
  valid: [
    `console.error('This is fine');`,
    `console.info('Also allowed');`,
    `log('not a console call');`,
  ],
  invalid: [
    {
      code: `console.log('This is bad');`,
      errors: [
        {
          messageId: 'noConsoleLog',
          data: {
            methodName: 'log'
          }
        }
      ]
    }
  ]
});
