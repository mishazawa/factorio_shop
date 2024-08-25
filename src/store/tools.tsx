import { create } from "zustand";
import { createReactlessStore } from ".";
import { ToolMode, ToolsStore, ToolsStoreFunc } from "./types";
import { produce } from "immer";

export const toolsStore = createReactlessStore<ToolsStore>({
  mode: "NONE",
});

export const useToolsStore = create<ToolsStore & ToolsStoreFunc>((set) => ({
  mode: "NONE",
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
  toolsStore.update((s) => {
    s.mode = mode;
  });
}
