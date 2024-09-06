import { NO_ACTIVE_LAYER } from "@app/constants";
import { createReactlessStore } from ".";
import { SelectBoxHandle } from "./selection";

type MouseState = {
  left: boolean;
  right: boolean;
};

type KeyboardState = {
  13: boolean;
};

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
    prev: MouseState;
    curr: MouseState;
  };
  keyboard: {
    prev: KeyboardState;
    curr: KeyboardState;
  };
  zoom: {
    level: number;
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
    keyboard: {
      prev: {
        13: false,
      },
      curr: {
        13: false,
      },
    },
    zoom: {
      level: 1,
    },
  };
}

export const frameState = createReactlessStore<FrameState>(resetFrame());
