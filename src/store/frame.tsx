import {
  NO_ACTIVE_LAYER,
  ZOOM_HIDE_GRID,
  ZOOM_MIN_MAX_ABS,
  ZOOM_SENSITIVITY,
} from "@app/constants";
import { createReactlessStore } from ".";
import { SelectBoxHandle } from "./selection";
import { clamp, cloneDeep } from "lodash";

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
    value: number;
    hideGrid: boolean;
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
      value: 1,
      hideGrid: false,
    },
  };
}

export const frameState = createReactlessStore<FrameState>(resetFrame());

export function zoom(direction: number) {
  frameState.update((fs) => {
    fs.zoom.level = clamp(fs.zoom.level + direction, -50, 10);
    fs.zoom.value = clamp(
      1 + fs.zoom.level * ZOOM_SENSITIVITY,
      ...ZOOM_MIN_MAX_ABS
    );
    fs.zoom.hideGrid = fs.zoom.level >= ZOOM_HIDE_GRID;
  });
}

export function expireFrameContols() {
  frameState.update((fs) => {
    fs.mouse.prev = cloneDeep(fs.mouse.curr);
    fs.keyboard.prev = cloneDeep(fs.keyboard.curr);
  });
}
