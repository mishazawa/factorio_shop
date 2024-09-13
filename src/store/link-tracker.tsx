import { create } from "zustand";
import { InternalSetFunction } from "./common";
import { produce, WritableDraft } from "immer";

type Draft = WritableDraft<LinkTrackerStore>;

type LinkObject = {
  src: string;
  dst: string;
  type: "tuple";
};

type LinkTrackerStore = {
  links: LinkObject[];
};

const initialState = { links: [] };

export const useLinkTracker = create<
  LinkTrackerStore & InternalSetFunction<LinkTrackerStore>
>((set) => ({
  ...initialState,
  _SET: (fn: (d: Draft) => void) => set(produce(fn)),
}));

export function createLink(src: string, dst: string) {
  useLinkTracker.getState()._SET((draft) => {
    draft.links.push({
      type: "tuple",
      src,
      dst,
    });
  });
}
