import { FormState, FormStateUtil } from './form-state.model';
import { RuleCreatorForm } from './rule-creator-form.model';
import { RuleForm } from './rule-form.model';
import { TestResult } from './test-result.enum';

export interface RuleCreatorStateModel {
  creatorForm: FormState<RuleCreatorForm>;
  ruleForm: FormState<RuleForm>;
  testResult: { status: TestResult; dateTime: string } | null;
}

export function createDefault(): RuleCreatorStateModel {
  return {
    creatorForm: FormStateUtil.create(),
    ruleForm: FormStateUtil.create(),
    testResult: null,
  };
}
