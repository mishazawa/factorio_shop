import {
  NO_ACTIVE_LAYER,
  ZOOM_HIDE_GRID,
  ZOOM_MIN_MAX_ABS,
  ZOOM_SENSITIVITY,
} from "@app/constants";
import { createReactlessStore } from ".";
import { SelectBoxHandle } from "./selection";
import { clamp, cloneDeep, throttle } from "lodash/fp";
import { Coords } from "./common";

type MouseState = {
  left: boolean;
  right: boolean;
  center: boolean;
};

type KeyboardState = {
  13: boolean;
};

export type FrameState = {
  hover: number;
  active: number;
  region: number; // id btw
  selection: {
    resize: boolean;
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
  pan: Coords;
};

export function resetFrame() {
  return {
    hover: NO_ACTIVE_LAYER,
    active: NO_ACTIVE_LAYER,
    region: NO_ACTIVE_LAYER,
    selection: {
      resize: false,
      handle: null,
      translate: false,
      locked: false,
    },
    mouse: {
      prev: {
        left: false,
        right: false,
        center: false,
      },
      curr: {
        left: false,
        right: false,
        center: false,
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
    pan: { x: 0, y: 0 },
  };
}

export const frameState = createReactlessStore<FrameState>(resetFrame());

const throttledScroll = throttle(16, (direction: number) => {
  frameState.update((fs) => {
    fs.zoom.level = clamp(fs.zoom.level + direction, -50, 10);
    fs.zoom.value = clamp(
      1 + fs.zoom.level * ZOOM_SENSITIVITY,
      ...ZOOM_MIN_MAX_ABS
    );
    fs.zoom.hideGrid = fs.zoom.level >= ZOOM_HIDE_GRID;
  });
});

export function zoom(direction: number) {
  throttledScroll(direction);
}
export function pan(delta: Coords) {
  if (!delta.x && delta.y) return;
  frameState.update((fs) => {
    fs.pan = cloneDeep(delta);
  });
}

export function getOrigin() {
  return frameState.read().pan;
}
