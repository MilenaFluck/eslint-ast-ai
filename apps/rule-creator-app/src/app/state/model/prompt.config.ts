export namespace PromptConfig {
  export const example = `import { Rule } from 'eslint';

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

  export const exampleTest = `import { RuleTester } from 'eslint';
import { useJestImports } from './path-to-your-rule-file'; // Adjust the import path

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('useJestImports', useJestImports, {
  valid: [
    {
      code: "import { createComponent } from '@ngneat/spectator/jest';", // Valid import using jest
    },
    {
      code: "import { createComponent } from '@ngneat/spectator';", // Valid import without needing fix
    },
  ],

  invalid: [
    {
      code: "import { createComponent } from '@ngneat/spectator';",
      errors: [
        {
          message:
            "By default, Spectator uses Jasmine for creating spies. Please use import path @ngneat/spectator/jest in order to let Spectator create Jest-compatible spies.",
          type: 'ImportDeclaration',
        },
      ],
      output: "import { createComponent } from '@ngneat/spectator/jest';", // Expect this change as a fix
    },
    {
      code: "import { createComponent } from '@ngneat/spectator/xyz';", // Shouldn't trigger the rule because it's not @ngneat/spectator
      errors: [],
    },
  ],
});`;

  export const responseFormat = `Please return the following data as a valid JSON object with the following keys: { "rule": "<the rule definition as a string>",
                       "ruleTest": "<the test case for the rule as a string>"
                      }`

  export const responseFormatExample = `{
  "rule": "import { Rule } from 'eslint';\\n\\nexport function useJestImports(context: Rule.RuleContext): Rule.RuleListener {\\n  return {\\n    ImportDeclaration(node) {\\n      const sourceValue = node.source.value;\\n      if (\\n        sourceValue === '@ngneat/spectator' &&\\n        !sourceValue.includes('jest')\\n      ) {\\n        context.report({\\n          node,\\n          message: 'By default, Spectator uses Jasmine for creating spies. Please use import path @ngneat/spectator/jest in order to let Spectator create Jest-compatible spies.',\\n          fix: function (fixer) {\\n            return fixer.replaceText(node.source, \\"'@ngneat/spectator/jest'\\");\\n          },\\n        });\\n      }\\n    },\\n  };\\n}",
  "ruleTest": "import { RuleTester } from 'eslint';\\nimport { useJestImports } from './path-to-your-rule-file';\\n\\nconst ruleTester = new RuleTester({\\n  parserOptions: {\\n    ecmaVersion: 2020,\\n    sourceType: 'module',\\n  },\\n});\\n\\nruleTester.run('useJestImports', useJestImports, {\\n  valid: [\\n    {\\n      code: \\"import { createComponent } from '@ngneat/spectator/jest';\\",\\n    },\\n    {\\n      code: \\"import { createComponent } from '@ngneat/spectator/xyz';\\",\\n    },\\n  ],\\n  invalid: [\\n    {\\n      code: \\"import { createComponent } from '@ngneat/spectator';\\",\\n      errors: [\\n        {\\n          message: \\"By default, Spectator uses Jasmine for creating spies. Please use import path @ngneat/spectator/jest in order to let Spectator create Jest-compatible spies.\\",\\n          type: 'ImportDeclaration',\\n        }\\n      ],\\n      output: \\"import { createComponent } from '@ngneat/spectator/jest';\\"\\n    }\\n  ]\\n});"
}`
}
