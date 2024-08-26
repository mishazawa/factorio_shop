import { produce } from "immer";
import { create } from "zustand";
import { createReactlessStore } from ".";

type ToolsStore = {
  mode: ToolMode;
};

type ToolsStoreFunc = {
  setMode: (m: ToolMode) => void;
};

export type ToolMode = "TRANSFORM" | "CROP" | "NONE";

export const toolsState = createReactlessStore<ToolsStore>({
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
  toolsState.update((s) => {
    s.mode = mode;
  });
}
