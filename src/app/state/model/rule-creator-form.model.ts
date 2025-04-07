import { Category, Framework, RuleType } from '../../model';

export interface RuleCreatorForm {
  framework: Framework;
  description: string;
  category: Category;
  type: RuleType;
  failureExample: string;
  fixable: boolean;
}
