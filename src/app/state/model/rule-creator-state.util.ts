import { Framework, frameworkToRessourcesMap } from '../../model';
import { PromptConfig } from './prompt.config';
import { RuleCreatorForm } from './rule-creator-form.model';

export namespace RuleCreatorStateUtil {
  export function exportToJsFile(jsString: string, filename: string) {
    const blob = new Blob([jsString], { type: 'application/javascript' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.js`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  export function createPrompt(createData: RuleCreatorForm): string {
    const fixable = createData.fixable ? 'Set a fixable: \'code\', and add a fix option in the context.report.' : '';
    const failureExample = createData.failureExample ? `This is an example of when the rule should actively throw an error:
    ${createData.failureExample}. Make sure the rule would detect such an error.` : '';
    const framework = createData.framework === Framework.NONE ? '' : `This is a framework-specific rule for
    ${createData.framework}. You can assume that I am using the eslint-plugin for ${createData.framework}.`;
    const ressources = `The following documentation might be helpful: ${frameworkToRessourcesMap.get(createData.framework)}.`;
    return `I want to write a custom lint rule with ESLint in JavaScript. The rule should be set up like this
    example: ${PromptConfig.example}. The rule should do the following: ${createData.description}. ${failureExample} The category is ${createData.category}
    and the type is ${createData.type}. ${fixable} ${framework} ${ressources} I also need you to write a test for the created rule. Here is an example test: ${PromptConfig.exampleTest}.
    After creating the test make sure the test would run successfully. If not check on the rule and the test again according to requirements.
    Please return the rule and the test for the rule as JSON-object like this: { rule: ruleCideAsString; test: ruleTestCodeAsString }.`;
  }
}
