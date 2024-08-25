import { createReactlessStore } from ".";
import { NO_ACTIVE_LAYER } from "../constants";
import { FrameState } from "./types";

export const realtimeStore = createReactlessStore<FrameState>({
  hover: NO_ACTIVE_LAYER,
  active: NO_ACTIVE_LAYER,
  selection: {
    drag: false,
    handle: null,
    translate: false,
    locked: false,
  },
  lastSelectedLayer: NO_ACTIVE_LAYER,
  lastHoveredLayer: NO_ACTIVE_LAYER,
  isDrag: false,
  selectionManipulator: null,
});
