import { FormState, FormStateUtil } from './form-state.model';
import { LintResultModel } from './lint-result.model';
import { RuleCreatorForm } from './rule-creator-form.model';
import { RuleForm } from './rule-form.model';
import { LintResult } from './lint-result.enum';

export interface RuleCreatorStateModel {
  creatorForm: FormState<RuleCreatorForm>;
  ruleForm: FormState<RuleForm>;
  lintResult: { messages: LintResultModel[]; dateTime: Date; status: LintResult } | null;
  apiKey: string | null;
}

export function createDefault(): RuleCreatorStateModel {
  return {
    creatorForm: FormStateUtil.create(),
    ruleForm: FormStateUtil.create(),
    lintResult: null,
    apiKey: null,
  };
}
