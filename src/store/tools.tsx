import { produce } from "immer";
import { create } from "zustand";
import { createReactlessStore } from ".";
import { NO_ACTIVE_LAYER } from "@app/constants";

type ToolsStore = {
  mode: ToolMode;
  isLayerPanelOpened: boolean;
  index: number;
};

type ToolsStoreFunc = {
  setMode: (m: ToolMode) => void;
};

export type ToolMode = "TRANSFORM" | "CROP" | "NONE";

export const toolsState = createReactlessStore<Pick<ToolsStore, "mode">>({
  mode: "NONE",
});

export const useToolsStore = create<ToolsStore & ToolsStoreFunc>((set) => ({
  mode: "NONE",
  isLayerPanelOpened: false,
  index: NO_ACTIVE_LAYER,
  setMode(mode: ToolMode) {
    set(
      produce((draft) => {
        draft.mode = mode;
      })
    );
  },
}));

export function setMode(mode: ToolMode) {
  useToolsStore.getState().setMode(mode);
  toolsState.update((s) => {
    s.mode = mode;
  });
}

export function openLayerPanel(value: boolean) {
  useToolsStore.setState({ isLayerPanelOpened: value });
}
export function setLayerPanelValue(index: number) {
  useToolsStore.setState({ index });
}
