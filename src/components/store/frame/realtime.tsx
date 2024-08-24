import { createReactlessStore } from "..";
import { NO_ACTIVE_LAYER } from "../../../constants";
import { FrameState } from "../types";

export const realtimeStore = createReactlessStore<FrameState>({
  lastSelectedLayer: NO_ACTIVE_LAYER,
  isDrag: false,
  selectionManipulator: null,
});
