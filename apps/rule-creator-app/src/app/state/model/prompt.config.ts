export namespace PromptConfig {
  export const exampleEsModules = `import { Rule } from 'eslint';

export function useJestImports(context: Rule.RuleContext): Rule.RuleListener {
  return {
    ImportDeclaration(node) {
      node.specifiers.forEach((specifier) => {
        if (
          node.source.raw?.toString().match(/('@ngneat\\/spectator['\\s/])/gi) &&
          !node.source.raw
            ?.toString()
            .match(/('@ngneat\\/spectator\\/jest['\\s/])/gi)
        ) {
          context.report({
            node,
            message: \`By default, Spectator uses Jasmine for creating spies. Please use import path @ngneat/spectator/jest in order to let Spectator create Jest-compatible spies.\`,
            fix: function (fixer) {
              return fixer.replaceText(node.source, "'@ngneat/spectator/jest'");
            },
          });
        }
      });
    },
  };
}
`;

  export const exampleCommonJs = `const { Rule } = require('eslint');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Use @ngneat/spectator/jest for jest compatibility',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        if (
          typeof source === 'string' &&
          source === '@ngneat/spectator'
        ) {
          context.report({
            node,
            message:
              'Please use import path @ngneat/spectator/jest to create Jest-compatible spies.',
            fix(fixer) {
              return fixer.replaceText(node.source, "'@ngneat/spectator/jest'");
            },
          });
        }
      },
    };
  },
};
`;

  export const badExampleCode = `import { createComponent } from '@ngneat/spectator';`;

  export const responseFormat = `
Please return the following data as a valid JSON object with the following keys: {
"ruleEsModules": "<the rule definition as a string for es modules>",
"ruleCommonJs": "<the rule definition as a string for common js>",
                       "badExampleCode": "<a bad example where the rule will throw an error>"
                      }`

  export const responseFormatExample = `{
  "ruleEsModules": "import { Rule } from 'eslint';\\n\\nexport function useJestImports(context: Rule.RuleContext): Rule.RuleListener {\\n  return {\\n    ImportDeclaration(node) {\\n      const sourceValue = node.source.value;\\n      if (\\n        sourceValue === '@ngneat/spectator' &&\\n        !sourceValue.includes('jest')\\n      ) {\\n        context.report({\\n          node,\\n          message: 'By default, Spectator uses Jasmine for creating spies. Please use import path @ngneat/spectator/jest in order to let Spectator create Jest-compatible spies.',\\n          fix: function (fixer) {\\n            return fixer.replaceText(node.source, \\"'@ngneat/spectator/jest'\\");\\n          },\\n        });\\n      }\\n    },\\n  };\\n}",
  "ruleCommonJs": "import { Rule } from 'eslint';\\n\\nexport function useJestImports(context: Rule.RuleContext): Rule.RuleListener {\\n  return {\\n    ImportDeclaration(node) {\\n      const sourceValue = node.source.value;\\n      if (\\n        sourceValue === '@ngneat/spectator' &&\\n        !sourceValue.includes('jest')\\n      ) {\\n        context.report({\\n          node,\\n          message: 'By default, Spectator uses Jasmine for creating spies. Please use import path @ngneat/spectator/jest in order to let Spectator create Jest-compatible spies.',\\n          fix: function (fixer) {\\n            return fixer.replaceText(node.source, \\"'@ngneat/spectator/jest'\\");\\n          },\\n        });\\n      }\\n    },\\n  };\\n}",
  "badExampleCode": "import { createComponent } from '@ngneat/spectator';"
}`

  export const forTesting = `
  module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Use @ngneat/spectator/jest for jest compatibility',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        if (
          typeof source === 'string' &&
          source === '@ngneat/spectator'
        ) {
          context.report({
            node,
            message:
              'Please use import path @ngneat/spectator/jest to create Jest-compatible spies.',
            fix(fixer) {
              return fixer.replaceText(node.source, "'@ngneat/spectator/jest'");
            },
          });
        }
      },
    };
  },
};`
}
