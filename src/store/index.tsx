import { produce, WritableDraft } from "immer";

export type ReactlessStore<T> = {
  data: T;
  update: (callback: (args: WritableDraft<T>) => void) => T;
  read: () => T;
};

export function createReactlessStore<T>(initialState: T): ReactlessStore<T> {
  return {
    data: { ...initialState },
    update(callback) {
      this.data = produce(this.data, callback);
      return this.data;
    },
    read() {
      return this.data;
    },
  };
}
