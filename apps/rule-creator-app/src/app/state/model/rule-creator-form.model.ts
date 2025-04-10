import { BuildTool, Category, EslintVersion, Framework, RuleType } from '../../model';

export interface RuleCreatorForm {
  framework: Framework;
  description: string;
  category: Category;
  type: RuleType;
  failureExample: string;
  buildTool: BuildTool;
  esLintVersion: EslintVersion;
  fixable: boolean;
}
