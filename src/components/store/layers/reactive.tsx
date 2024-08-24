import { produce } from "immer";
import { create } from "zustand";
import { LayersReactiveStoreData, LayersReactiveStoreFunc } from "../types";

export const useLayersStore = create<
  LayersReactiveStoreData & LayersReactiveStoreFunc
>((set) => ({
  layers: [],
  add(value: number) {
    return set(
      produce((draft) => {
        draft.layers.push(value);
      })
    );
  },
  remove(value: number) {
    return set(
      produce((draft) => {
        const index = draft.layers.indexOf(value);
        if (index < 0) return;
        // seems to be OK for now.
        draft.layers.splice(index, 1);
        draft.layers = draft.layers.map((l: number) => (l > value ? l - 1 : l));
      })
    );
  },
  reorder(value: number[]) {
    return set(
      produce((draft) => {
        draft.layers = value;
      })
    );
  },
}));
