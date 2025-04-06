export default {
  meta: {
    type: 'problem', // The rule type, indicating it identifies issues
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
      // Detect if the file contains an Angular component by checking for the @Component decorator
      'ClassDeclaration': (node) => {
        const decorators = node.decorators || [];
        isComponent = decorators.some(decorator =>
          decorator.expression &&
          decorator.expression.callee &&
          decorator.expression.callee.name === 'Component'
        );
      },

      MethodDefinition(node) {
        // Check if the method is a lifecycle hook and if the class is an Angular component
        if (isComponent && node.key && node.key.name && lifecycleOrder.includes(node.key.name)) {
          const currentHook = node.key.name;

          // Compare the current hook with all previous hooks to ensure correct order
          const currentHookIndex = lifecycleOrder.indexOf(currentHook);
          for (let i = 0; i < hooksInOrder.length; i++) {
            const previousHook = hooksInOrder[i];
            const previousHookIndex = lifecycleOrder.indexOf(previousHook);

            if (previousHookIndex > currentHookIndex) {
              // Report if the previous hook comes after the current hook, violating the order
              context.report({
                node,
                messageId: 'incorrectLifecycleOrder',
              });
              return; // No need to check further if we already found an issue
            }
          }

          // Add the hook to the array if it's in the correct order
          hooksInOrder.push(currentHook);
        }
      },
    };
  },
};
