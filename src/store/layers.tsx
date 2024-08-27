import { produce } from "immer";
import { create } from "zustand";
import { BBox, Sprite, Xform, xtobb } from "./common";
import { createReactlessStore } from ".";

import { clamp, cloneDeep } from "lodash";

export type SpriteObject = {
  locked: boolean;
  filename: string;
  width: number;
  height: number;
  xform: Xform;
  bbox: BBox;
  crop: Xform;
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

export function createLayer(
  value: Sprite,
  metadata: File,
  dom: HTMLImageElement
): [number] {
  const { sprites } = layersState.update((draft) => {
    draft.images.push(value);
    draft.sprites.push(createBlankSprite(metadata, dom));
  });
  // prevent to return values < 0
  return [clamp(sprites.length - 1, 0, Infinity)];
}

export function copyXform(i: number, xform: Xform) {
  layersState.update((draft) => {
    draft.sprites[i].xform = cloneDeep(xform);
  });
}

export function copyBBox(i: number, bbox: BBox, abbox: BBox) {
  layersState.update((draft) => {
    draft.sprites[i].bbox = cloneDeep(bbox);
  });
}

export function applyTransform(i: number, xform: Xform, bbox: BBox) {
  layersState.update((draft) => {
    draft.sprites[i].xform = cloneDeep(xform);
    draft.sprites[i].bbox = cloneDeep(bbox);
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
    crop: {
      position: { x: 0, y: 0 },
      size: { x: dom.width, y: dom.height }, // maybe change this later
    },
    bbox: xtobb({
      position: { x: 0, y: 0 },
      size: { x: dom.width, y: dom.height }, // maybe change this later
    }),
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
