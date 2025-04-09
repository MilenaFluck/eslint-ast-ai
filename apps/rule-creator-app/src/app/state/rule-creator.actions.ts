export namespace RuleCreatorActions {
  export class Create {
    static readonly type = '[Rule] Create';
  }

  export class Export {
    static readonly type = '[Rule] Export';
  }

  export class Test {
    static readonly type = '[Rule] Test';
  }

  export class RemoveKey {
    static readonly type = '[API Key] Remove';
  }

  export class AddKey {
    static readonly type = '[API Key] Add';

    constructor(public readonly apiKey: string) {}
  }
}
