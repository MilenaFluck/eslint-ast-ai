import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { Framework, frameworkToRessourcesMap, Ressources } from '../model';
import {
  createDefault,
  RuleCreatorStateModel,
  RuleCreatorStateUtil,
  TestResult,
} from './model';
import { RuleCreatorHttpService } from './rule-creator-http.service';
import { RuleCreatorActions } from './rule-creator.actions';

export const RULE_CREATOR_STATE_TOKEN = new StateToken<RuleCreatorStateModel>(
  'rule_creator'
);

@State<RuleCreatorStateModel>({
  name: RULE_CREATOR_STATE_TOKEN,
  defaults: createDefault(),
})
@Injectable()
export class RuleCreatorState {
  @Selector()
  static ressources(state: RuleCreatorStateModel): Ressources | undefined {
    const framework = state.creatorForm.model?.framework ?? Framework.NONE;
    return frameworkToRessourcesMap.get(framework);
  }

  @Selector()
  static testResultStatus(state: RuleCreatorStateModel): TestResult | null {
    return state.testResult?.status ?? null;
  }

  @Selector()
  static testResultDateTime(state: RuleCreatorStateModel): string | null {
    return state.testResult?.dateTime ?? null;
  }

  @Selector()
  static testPassed(state: RuleCreatorStateModel): boolean {
    return state.testResult?.status === TestResult.PASSED;
  }

  constructor(
    private readonly ruleCreatorHttpService: RuleCreatorHttpService
  ) {}

  @Action(RuleCreatorActions.Create)
  create(ctx: StateContext<RuleCreatorStateModel>): void {
    const createData = ctx.getState().creatorForm.model;
    if (createData) {
      const prompt = RuleCreatorStateUtil.createPrompt(createData);
      this.ruleCreatorHttpService.sendMessage(prompt).subscribe((result) => {
        console.log(result);
      });
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

  @Action(RuleCreatorActions.Test)
  test(ctx: StateContext<RuleCreatorStateModel>): void {}
}
