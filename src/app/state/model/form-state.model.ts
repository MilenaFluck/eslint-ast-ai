export interface FormState<T> {
  model: T | undefined;
  dirty: boolean;
  status: unknown;
  errors: {
    [k: string]: string;
  };
}

export namespace FormStateUtil {
  export function createDefault<T>(): FormState<T> {
    return create();
  }

  export function create<T>(model?: T): FormState<T> {
    return {
      model: model ? model : undefined,
      dirty: false,
      status: '',
      errors: {},
    };
  }
}
