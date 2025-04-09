import { Rule } from 'eslint';

export function useJestImports(context: Rule.RuleContext): Rule.RuleListener {
  return {
    ImportDeclaration(node) {
      node.specifiers.forEach((specifier) => {
        if (
          node.source.raw?.toString().match(/('@ngneat\/spectator['\s/])/gi) &&
          !node.source.raw
            ?.toString()
            .match(/('@ngneat\/spectator\/jest['\s/])/gi)
        ) {
          context.report({
            node,
            message: `By default, Spectator uses Jasmine for creating spies. Please use import path @ngneat/spectator/jest in order to let Spectator create Jest-compatible spies.`,
            fix: function (fixer) {
              return fixer.replaceText(node.source, "'@ngneat/spectator/jest'");
            },
          });
        }
      });
    },
  };
}
