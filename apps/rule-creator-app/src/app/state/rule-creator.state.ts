import { Injectable } from '@angular/core';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { createForm } from 'openai/uploads';
import { mergeMap, Observable, ObservableInput, of } from 'rxjs';
import {
  BuildTool,
  buildToolToRessourcesMap,
  Framework,
  frameworkToRessourcesMap,
  ModuleSystem,
  Ressources,
  RessourcesBuildTool
} from '../model';
import { createDefault, LintResult, LintResultModel, RuleCreatorStateModel, RuleCreatorStateUtil, } from './model';
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
  static ressourcesBuildTool(state: RuleCreatorStateModel): RessourcesBuildTool | undefined {
    const buildTool = state.creatorForm.model?.buildTool ?? BuildTool.NONE;
    return buildToolToRessourcesMap.get(buildTool);
  }

  @Selector()
  static lintResultStatus(state: RuleCreatorStateModel): LintResult | null {
    return state.lintResult?.status ?? null;
  }

  @Selector()
  static lintResultMessages(state: RuleCreatorStateModel): LintResultModel[] {
    return state.lintResult?.messages ?? [];
  }

  @Selector()
  static lintResultDateTime(state: RuleCreatorStateModel): Date | null {
    return state.lintResult?.dateTime ?? null;
  }

  @Selector()
  static lintPassed(state: RuleCreatorStateModel): boolean {
    return state.lintResult?.status === LintResult.PASSED;
  }

  constructor(
    private readonly ruleCreatorHttpService: RuleCreatorHttpService,
  ) {}

  @Action(RuleCreatorActions.Create)
  create(ctx: StateContext<RuleCreatorStateModel>): ObservableInput<any> {
    const state = ctx.getState();
    const createData = state.creatorForm.model;
console.log(state.apiKey, createData);
    if (createData) {
      const prompt = RuleCreatorStateUtil.createPrompt(createData);

      if (!state.apiKey) {
        return of(null);
      }

      ctx.patchState({
        lintResult: null
      });

      return this.ruleCreatorHttpService.sendMessage(prompt, state.apiKey)
        .pipe(
          mergeMap(result => {
            const resultMessage = result.message;
            const promptResult = resultMessage;
            const ruleEsModules = promptResult.ruleEsModules;
            const ruleCommonJs = promptResult.ruleCommonJs;
            const badExampleCode = promptResult.badExampleCode;
            ctx.dispatch(new UpdateFormValue({
              value: { ruleEsModules, ruleCommonJs, badExampleCode },
              path: 'rule_creator.ruleForm'
            }));

            return of(null);
          })
        );
    }

    return of(null);
  }


  @Action(RuleCreatorActions.Export)
  export(ctx: StateContext<RuleCreatorStateModel>, { moduleSystem }: RuleCreatorActions.Export): void {
    const ruleFormModel = ctx.getState().ruleForm.model;
    const rule = (moduleSystem === ModuleSystem.ES_MODULES ) ? ruleFormModel?.ruleEsModules : ruleFormModel?.ruleCommonJs;
    if (rule) RuleCreatorStateUtil.exportToJsFile(rule, 'rule');
  }

  @Action(RuleCreatorActions.Lint)
  lint(ctx: StateContext<RuleCreatorStateModel>): Observable<any> {
    const ruleForm = ctx.getState().ruleForm.model;
    if (!ruleForm) return of(null);

    const ruleCommonJs = ruleForm.ruleCommonJs.replace(/^.*?(module\.exports)/s, '$1')
    return this.ruleCreatorHttpService.lint(ruleCommonJs, ruleForm.badExampleCode).pipe(
      mergeMap(result => {
        const status = result.length > 0 ? LintResult.FAILED : LintResult.PASSED;

        ctx.patchState({
          lintResult: {
            messages: (result as LintResultModel[]),
            dateTime: new Date(),
            status: status
          }
        });

        return of(result);
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
