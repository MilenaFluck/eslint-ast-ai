export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce imports from "@ngneat/jest" instead of "@ngneat" for Jest-based tests', // A description of the rule
      category: 'Best Practices',
    },
    messages: {
      incorrectImport: 'Please use "@ngneat/jest" instead of "@ngneat" to ensure Jest-compatible spies and testing utilities.', // Error message when rule is violated
    },
    fixable: 'code',
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        node.specifiers.forEach((specifier) => {
          if (
            node.source.raw?.toString().match(/('@ngneat\/spectator['\s/])/gi) &&
            !node.source.raw?.toString().match(/('@ngneat\/spectator\/jest['\s/])/gi)
          ) {
            context.report({
              node,
              messageId: 'incorrectImport',
              // Auto fix Logik: ändert Import-Pfad zu '@ngneat/jest'
              fix(fixer) {
                return fixer.replaceText(node.source, "'@ngneat/spectator/jest'");
              }
            });
          }
        });
      }
    };
  }
};
