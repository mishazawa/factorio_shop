import { produce, WritableDraft } from "immer";

type ReactlessStore<T> = {
  data: T;
  update: (callback: (args: WritableDraft<T>) => void) => void;
  read: () => T;
};

export function createReactlessStore<T>(initialState: T): ReactlessStore<T> {
  return {
    data: { ...initialState },
    update(callback) {
      this.data = produce(this.data, callback);
    },
    read() {
      return this.data;
    },
  };
}
