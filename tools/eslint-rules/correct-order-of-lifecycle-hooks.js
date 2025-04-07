export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure Angular lifecycle hooks are in the correct order in components',
      category: 'Angular',
    },
    messages: {
      incorrectLifecycleOrder: "Lifecycle hooks should be declared in the following order: ngOnChanges, ngOnInit, ngDoCheck, ngAfterContentInit, ngAfterContentChecked, ngAfterViewInit, ngAfterViewChecked, ngOnDestroy.",
    },
  },

  create(context) {
    const lifecycleOrder = [
      'ngOnChanges',
      'ngOnInit',
      'ngDoCheck',
      'ngAfterContentInit',
      'ngAfterContentChecked',
      'ngAfterViewInit',
      'ngAfterViewChecked',
      'ngOnDestroy',
    ];

    let hooksInOrder = [];
    let isComponent = false;

    return {
      'ClassDeclaration': (node) => {
        const decorators = node.decorators || [];
        isComponent = decorators.some(decorator =>
          decorator.expression &&
          decorator.expression.callee &&
          decorator.expression.callee.name === 'Component'
        );
      },

      MethodDefinition(node) {
        if (isComponent && node.key && node.key.name && lifecycleOrder.includes(node.key.name)) {
          const currentHook = node.key.name;

          const currentHookIndex = lifecycleOrder.indexOf(currentHook);
          for (let i = 0; i < hooksInOrder.length; i++) {
            const previousHook = hooksInOrder[i];
            const previousHookIndex = lifecycleOrder.indexOf(previousHook);

            if (previousHookIndex > currentHookIndex) {
              context.report({
                node,
                messageId: 'incorrectLifecycleOrder',
              });
              return;
            }
          }

          hooksInOrder.push(currentHook);
        }
      },
    };
  },
};
