import { produce } from "immer";
import { ReactlessStore } from "./types";

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
