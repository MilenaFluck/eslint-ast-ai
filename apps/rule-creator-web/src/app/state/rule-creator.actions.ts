import { ModuleSystem } from '../model';

export namespace RuleCreatorActions {
  export class Create {
    static readonly type = '[Rule] Create';
  }

  export class Export {
    static readonly type = '[Rule] Export';

    constructor(public readonly moduleSystem: ModuleSystem) {}
  }

  export class Lint {
    static readonly type = '[Rule] Lint';
  }

  export class RemoveKey {
    static readonly type = '[API Key] Remove';
  }

  export class AddKey {
    static readonly type = '[API Key] Add';

    constructor(public readonly apiKey: string) {}
  }
}
