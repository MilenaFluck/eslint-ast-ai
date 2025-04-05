module.exports = {
  // enthält metadata für eine Regel
  meta: {
    type: 'problem', // alternativ "suggestion" oder "layout"
    /***
     - **Problem**: Die Regel identifiziert Code, der entweder einen Fehler verursacht oder zu verwirrendem Verhalten führen könnte.
     EntwicklerInnen sollten dies als hohe Priorität ansehen, um es zu beheben.
     - **Vorschlag**: Die Regel identifiziert Dinge, die besser gemacht werden könnten, aber keine Fehler verursachen, wenn der Code nicht
     geändert wird.
     - **Layout**: Die Regel kümmert sich um Whitespace, Semikolons, Kommas und Klammern – alles, was das Aussehen des Codes betrifft,
     aber nicht seine Ausführung.
     ***/
    docs: {
      description: 'disallow the use of console.log', // Eine kurze Beschreibung der Regel
      category: 'Possible Errors', // Einteilung in logische Kategorien: z. B. "Best Practices", "Stylistic Issues", "Angular"
    },
    // Das `messages`-Objekt in den Metadaten einer ESLint-Regel definiert Fehlermeldungen mit dynamischen, platzhalterbasierten Nachrichten,
    // die an spezifische Code-Verstöße angepasst werden können.
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
};
