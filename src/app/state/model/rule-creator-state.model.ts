import { FormState, FormStateUtil } from './form-state.model';
import { RuleCreatorForm } from './rule-creator-form.model';
import { RuleForm } from './rule-form.model';

export interface RuleCreatorStateModel {
  creatorForm: FormState<RuleCreatorForm>;
  ruleForm: FormState<RuleForm>;
}

export function createDefault(): RuleCreatorStateModel {
  return {
    creatorForm: FormStateUtil.create(),
    ruleForm: FormStateUtil.create()
  }
}
