import { Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken } from '@ngxs/store';
import { createDefault, RuleCreatorStateModel, RuleCreatorStateUtil } from './model';
import { RuleCreatorActions } from './rule-creator.actions';

export const RULE_CREATOR_STATE_TOKEN = new StateToken<RuleCreatorStateModel>('rule_creator');

@State<RuleCreatorStateModel>({
  name: RULE_CREATOR_STATE_TOKEN,
  defaults: createDefault()
})
@Injectable()
export class RuleCreatorState {

  @Action(RuleCreatorActions.Create)
  create(ctx: StateContext<RuleCreatorStateModel>): void {
    const createData = ctx.getState().creatorForm.model;
    if (createData) {
      const prompt = RuleCreatorStateUtil.createPrompt(createData);
    }
  }

  @Action(RuleCreatorActions.Export)
  export(ctx: StateContext<RuleCreatorStateModel>): void {
    const state = ctx.getState();
    const rule = state.ruleForm.model?.rule;
    const ruleTest = state.ruleForm.model?.ruleTest;
    if (rule) RuleCreatorStateUtil.exportToJsFile(rule, 'rule');
    if (ruleTest) RuleCreatorStateUtil.exportToJsFile(ruleTest, 'rule.spec');
  }

}
