import { Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken } from '@ngxs/store';
import { createDefault, RuleCreatorStateModel } from './model';
import { RuleCreatorActions } from './rule-creator.actions';

export const RULE_CREATOR_STATE_TOKEN = new StateToken<RuleCreatorStateModel>('rule_creator');

@State<RuleCreatorStateModel>({
  name: RULE_CREATOR_STATE_TOKEN,
  defaults: createDefault()
})
@Injectable()
export class RuleCreatorState {

  @Action(RuleCreatorActions.Export)
  export(ctx: StateContext<RuleCreatorStateModel>): void {
    const state = ctx.getState();
    const rule = state.ruleForm.model?.rule;
    const ruleTest = state.ruleForm.model?.ruleTest;
    if (rule) this.exportToJsFile(rule, 'rule');
    if (ruleTest) this.exportToJsFile(ruleTest, 'rule.spec');
  }

  private exportToJsFile(jsString: string, filename: string) {
    const blob = new Blob([jsString], { type: 'application/javascript' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.js`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
