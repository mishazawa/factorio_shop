import { produce } from "immer";
import { create } from "zustand";
import { Sprite, Xform } from "./common";
import { createReactlessStore } from ".";
import { clamp } from "@app/utils";

export type SpriteObject = {
  locked: boolean;
  filename: string;
  width: number;
  height: number;
  xform: Xform;
};

type LayersStore = {
  images: Sprite[];
  sprites: SpriteObject[];
};

type LayersReactiveStoreData = {
  layers: number[];
};

type LayersReactiveStoreFunc = {
  add: (value: number) => void;
  reorder: (value: number[]) => void;
  remove: (value: number) => void;
};

export const layersState = createReactlessStore<LayersStore>({
  images: [],
  sprites: [],
});

export function addImage(
  value: Sprite,
  metadata: File,
  dom: HTMLImageElement
): [number] {
  const { sprites } = layersState.update((draft) => {
    draft.images.push(value);
    draft.sprites.push(createBlankSprite(metadata, dom));
  });
  // prevent to return values < 0
  return [clamp(sprites.length - 1)];
}

export function transformImage(i: number, xform: Xform) {
  layersState.update((draft) => {
    draft.sprites[i].xform = xform;
  });
}

export const removeImage = (index: number) => {
  layersState.update((draft) => {
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
      size: { x: dom.width, y: dom.height }, // maybe change this later
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
