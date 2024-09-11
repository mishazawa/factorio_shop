import { produce } from "immer";
import { create } from "zustand";
import { BBox, Sprite, Xform, xtobb } from "./common";
import { createReactlessStore } from ".";

import { clamp, cloneDeep, has, last, uniqueId } from "lodash/fp";
import { LayerId } from "./api";

export type SpriteObject = {
  id: string;
  locked: boolean;
  filename: string;
  width: number;
  height: number;
  xform: Xform;
  bbox: BBox;
  crop: Xform;
};

export type RegionType = "selection" | "scale";

export const REGION_TYPES: [RegionType, RegionType] = ["selection", "scale"];

export type RegionObject = {
  id: string;
  type: RegionType;
  xform: Xform;
  bind: never;
  color: [number, number, number];
};

type LayersStore = {
  images: Sprite[];
  sprites: SpriteObject[];
  regions: RegionObject[];
};

type LayersReactiveStoreData = {
  layers: number[];
  regions: Record<string, string>;
  currentEditableRegionId: string | null;
};

type LayersReactiveStoreFunc = {
  add: (value: number) => void;
  reorder: (value: number[]) => void;
  remove: (value: number) => void;
  bindRegion: (layer: string, region: string) => void;
  setRegionId: (id: string | null) => void;
};

export const layersState = createReactlessStore<LayersStore>({
  images: [],
  sprites: [],
  regions: [],
});

export const useLayersStore = create<
  LayersReactiveStoreData & LayersReactiveStoreFunc
>((set) => ({
  layers: [],
  regions: {},
  currentEditableRegionId: null,
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
  bindRegion(layer: string, region: string) {
    return set(
      produce((draft) => {
        draft.regions[region] = layer;
      })
    );
  },
  setRegionId(id: string | null) {
    return set(
      produce((draft) => {
        draft.currentEditableRegionId = id;
      })
    );
  },
}));

export function createLayer(
  value: Sprite,
  metadata: File,
  dom: HTMLImageElement
): [number, SpriteObject] {
  const { sprites } = layersState.update((draft) => {
    draft.images.push(value);
    draft.sprites.push(createBlankSprite(metadata, dom));
  });
  // prevent to return values < 0
  return [clamp(sprites.length - 1, 0, Infinity), last(sprites)!];
}

export function copyXform(i: number, xform: Xform) {
  layersState.update((draft) => {
    if (has(["sprites", i], draft)) {
      draft.sprites[i].xform = cloneDeep(xform);
    }
  });
}

export function copyBBox(i: number, bbox: BBox) {
  layersState.update((draft) => {
    if (has(["sprites", i], draft)) {
      draft.sprites[i].bbox = cloneDeep(bbox);
    }
  });
}

export function applyTransform(i: number, xform: Xform, bbox: BBox) {
  layersState.update((draft) => {
    if (has(["sprites", i], draft)) {
      draft.sprites[i].xform = cloneDeep(xform);
      draft.sprites[i].bbox = cloneDeep(bbox);
    }
  });
}

export const removeImage = (index: number): LayerId => {
  let id: LayerId = -1;
  layersState.update((draft) => {
    draft.images.splice(index, 1);
    const [spr] = draft.sprites.splice(index, 1);
    id = spr.id;
  });
  return id;
};

function createBlankSprite(
  metadata: File,
  dom: HTMLImageElement
): SpriteObject {
  return {
    id: uniqueId("layer-"),
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

export function createRegion(layer: string) {
  const region = createBlankRegion();

  layersState.update((ls) => {
    ls.regions.push(region);
  });

  const { bindRegion } = useLayersStore.getState();
  bindRegion(layer, region.id);
}

function createBlankRegion(t: RegionType = "selection"): RegionObject {
  return {
    id: uniqueId("region-"),
    type: t,
    xform: {
      position: { x: 0, y: 0 },
      size: { x: 1, y: 1 },
    },
    bind: null!,
    color: [255, 0, 0],
  };
}
