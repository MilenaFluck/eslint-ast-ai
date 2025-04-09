import { Injectable } from '@angular/core';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { catchError, mergeMap, ObservableInput, of } from 'rxjs';
import { Framework, frameworkToRessourcesMap, Ressources } from '../model';
import { createDefault, RuleCreatorStateModel, RuleCreatorStateUtil, TestResult, } from './model';
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
  static testResultDateTime(state: RuleCreatorStateModel): Date | null {
    return state.testResult?.dateTime ?? null;
  }

  @Selector()
  static testPassed(state: RuleCreatorStateModel): boolean {
    return state.testResult?.status === TestResult.PASSED;
  }

  constructor(
    private readonly ruleCreatorHttpService: RuleCreatorHttpService,
  ) {}

  @Action(RuleCreatorActions.Create)
  create(ctx: StateContext<RuleCreatorStateModel>): ObservableInput<any> {
    const state = ctx.getState();
    const createData = state.creatorForm.model;

    if (createData) {
      const prompt = RuleCreatorStateUtil.createPrompt(createData);

      if (!state.apiKey) {
        return of(null);
      }

      return this.ruleCreatorHttpService.sendMessage(prompt, state.apiKey)
        .pipe(
          mergeMap(result => {
            const resultMessage = result.message;
            const promptResult = resultMessage;
            const rule = promptResult.rule;
            const ruleTest = promptResult.ruleTest;
            ctx.dispatch(new UpdateFormValue({
              value: { rule, ruleTest },
              path: 'rule_creator.ruleForm'
            }));

            return of(null); // Returning an observable to complete the action
          })
        );
    }

    return of(null); // Return observable if createData is falsy
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
  test(ctx: StateContext<RuleCreatorStateModel>): ObservableInput<any> {
    const ruleForm = ctx.getState().ruleForm.model;
    if (!ruleForm) return of(null);
    return this.ruleCreatorHttpService.runTest(ruleForm.rule, ruleForm.ruleTest).pipe(
      mergeMap(result => {
        ctx.patchState({
          testResult: { status: TestResult.PASSED, dateTime: new Date() }
        });
        return of(result);
      }),
      catchError(error => {
        ctx.patchState({
          testResult: { status: TestResult.FAILED, dateTime: new Date() }
        });
        return of(null);
      })
    );
  }


  @Action(RuleCreatorActions.RemoveKey)
  removeKey(ctx: StateContext<RuleCreatorStateModel>): void {
    ctx.patchState({
      apiKey: null
    })
  }

  @Action(RuleCreatorActions.AddKey)
  addKey(ctx: StateContext<RuleCreatorStateModel>, { apiKey }: RuleCreatorActions.AddKey): void {
    ctx.patchState({
      apiKey
    })
  }
}
