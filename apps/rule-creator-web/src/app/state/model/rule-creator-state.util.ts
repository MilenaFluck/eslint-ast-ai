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
    const fixable = createData.fixable
      ? "Set a fixable: 'code', and add a fix option in the context.report."
      : '';
    const failureExample = createData.failureExample
      ? `This is an example of when the rule should actively throw an error:
    ${createData.failureExample}. Make sure the rule would detect such an error.`
      : `I need you to write a bad example where the rule will throw an error, if I did not provide one.
      Here is an example for bad code for the provided example-rule: ${PromptConfig.badExampleCode}.`;
    const framework =
      createData.framework === Framework.NONE
        ? ''
        : `This is a framework-specific rule for
    ${createData.framework}. You can assume that I am using the eslint-plugin for ${createData.framework}.`;
    const ressources = `The following documentation might be helpful: ${frameworkToRessourcesMap.get(
      createData.framework
    )}.`;
    const fileTypes = createData.fileTypes.length > 0 ? `Make sure the rule only applies to files with extensions ${createData.fileTypes.join(', .')}.` : ''
    return `I want to write a custom lint rule with ESLint in JavaScript. The rule should be set up like this
    example for Es Modules: ${PromptConfig.exampleEsModules} and this ${PromptConfig.exampleCommonJs} fpr CommonJs. I need both versions of the rule.
    Create the ES Module version first and then convert to Common JS version of the rule. The rule should do the following: ${createData.description}. ${failureExample}
    ${fileTypes}. The category is ${createData.category}
    and the type is ${createData.type}. ${fixable} ${framework} ${ressources}
    After creating the test make sure the test would run successfully. If not check on the rule and the test again according to requirements. Also make sure the
    rule is compatible with EsLint Version ${createData.esLintVersion}. It has to be compatible with any minor or patch of the stated major version.
    ${PromptConfig.responseFormat}. Here is a valid example: ${PromptConfig.responseFormatExample}. Do not give me anything but the JSON Object as string!
    After you have created the rule revalidate if the rule works.`;
  }
}
