export namespace PromptConfig {
  export const example = `export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow the use of console.log',
      category: 'Possible Errors',
    },
    messages: {
      noConsoleLog: "No console method if it is '{{ methodName }}'. Und was ich den Entwicklerinnen sonst noch so erzählen möchte..."
    }
  },
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee &&
          node.callee.object &&
          node.callee.object.name === 'console' &&
          node.callee.property &&
          node.callee.property.name === 'log'
        ) {
          context.report({
            node,
            messageId: 'noConsoleLog',
            data: {
              methodName: node.callee.property.name,
            }
          });
        }
      }
    };
  }
};`;

  export const exampleTest = `import { RuleTester } from 'eslint';
import rule from './no-console-log.js';

const ruleTester = new RuleTester();

ruleTester.run('no-console-log', rule, {
  valid: [
    \`console.error('This is fine');\`,
    \`console.info('Also allowed');\`,
    \`log('not a console call');\`,
  ],
  invalid: [
    {
      code: \`console.log('This is bad');\`,
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
});`;
}
