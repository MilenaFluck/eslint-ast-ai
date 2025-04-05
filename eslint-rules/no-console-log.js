module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow the use of console.log',
      category: 'Possible Errors',
      recommended: true
    },
    schema: []
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
            message: 'Unexpected console.log statement. Und was ich den Entwicklerinnen sonst noch so erzählen möchte...',
          });
        }
      }
    };
  }
};
