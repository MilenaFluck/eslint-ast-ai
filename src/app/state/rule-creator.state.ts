import { Injectable } from '@angular/core';
import { State, StateToken } from '@ngxs/store';
import { createDefault, RuleCreatorStateModel } from './model';

export const RULE_CREATOR_STATE_TOKEN = new StateToken<RuleCreatorStateModel>('rule_creator');

@State<RuleCreatorStateModel>({
  name: RULE_CREATOR_STATE_TOKEN,
  defaults: createDefault()
})
@Injectable()
export class RuleCreatorState {
}
