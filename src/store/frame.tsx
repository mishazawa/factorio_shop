import { NO_ACTIVE_LAYER } from "@app/constants";
import { createReactlessStore } from ".";
import { SelectBoxHandle } from "./selection";

export type FrameState = {
  hover: number;
  active: number;
  selection: {
    drag: boolean;
    translate: boolean;
    locked: boolean;
    handle: null | SelectBoxHandle;
  };
  mouse: {
    prev: {
      left: boolean;
      right: boolean;
    };
    curr: {
      left: boolean;
      right: boolean;
    };
  };
};

export function resetFrame() {
  return {
    hover: NO_ACTIVE_LAYER,
    active: NO_ACTIVE_LAYER,
    selection: {
      drag: false,
      handle: null,
      translate: false,
      locked: false,
    },
    mouse: {
      prev: {
        left: false,
        right: false,
      },
      curr: {
        left: false,
        right: false,
      },
    },
  };
}

export const frameState = createReactlessStore<FrameState>(resetFrame());
