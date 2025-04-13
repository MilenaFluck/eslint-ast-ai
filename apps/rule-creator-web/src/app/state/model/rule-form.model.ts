import { FileType } from '../../model/file-type.enum';

export interface RuleForm {
  ruleEsModules: string;
  ruleCommonJs: string;
  badExampleCode: string;
  fileType: FileType;
}
