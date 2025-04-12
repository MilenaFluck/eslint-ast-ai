import { BuildTool, Category, EslintVersion, Framework, RuleType } from '../../model';
import { FileType } from '../../model/file-type.enum';

export interface RuleCreatorForm {
  framework: Framework;
  description: string;
  category: Category;
  type: RuleType;
  failureExample: string;
  buildTool: BuildTool;
  esLintVersion: EslintVersion;
  fileTypes: FileType[];
  fixable: boolean;
}
