import { createReactlessStore } from ".";
import { clamp } from "../utils";
import { produce } from "immer";
import { create } from "zustand";
import {
  LayersReactiveStoreData,
  LayersReactiveStoreFunc,
  ImagesStore,
  Sprite,
  SpriteObject,
  Xform,
} from "./types";

export const realtimeStore = createReactlessStore<ImagesStore>({
  images: [],
  sprites: [],
});

export function addImage(
  value: Sprite,
  metadata: File,
  dom: HTMLImageElement
): [number] {
  const { sprites } = realtimeStore.update((draft) => {
    draft.images.push(value);
    draft.sprites.push(createBlankSprite(metadata, dom));
  });
  // prevent to return values < 0
  return [clamp(sprites.length - 1)];
}

export function transformImage(i: number, xform: Xform) {
  realtimeStore.update((draft) => {
    draft.sprites[i].xform = xform;
  });
}

export const removeImage = (index: number) => {
  realtimeStore.update((draft) => {
    draft.images.splice(index, 1);
    draft.sprites.splice(index, 1);
  });
};

function createBlankSprite(
  metadata: File,
  dom: HTMLImageElement
): SpriteObject {
  return {
    locked: false,
    filename: metadata.name,
    width: dom.width,
    height: dom.height,
    xform: {
      position: { x: 0, y: 0 },
      scale: { x: 1, y: 1 },
    },
  };
}

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
