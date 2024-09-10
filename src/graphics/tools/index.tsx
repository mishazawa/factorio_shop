import { identity } from "lodash/fp";

type FnCallback = () => void;

export interface Tool {
  mode: (fn: FnCallback) => void;
  click: FnCallback;
  release: FnCallback;
  move: FnCallback;
}

export const comply = identity<Tool>;
