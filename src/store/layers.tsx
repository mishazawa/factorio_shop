import { produce, WritableDraft } from "immer";
import { create } from "zustand";
import { BBox, Sprite, Xform, xtobb } from "./common";
import { createReactlessStore } from ".";
// todo rewrite this mess!!!!!

import {
  clamp,
  cloneDeep,
  findIndex,
  has,
  join,
  last,
  uniqueId,
} from "lodash/fp";
import { LayerId, useFactorioApi } from "./api";
import { createSelection } from "./selection";
import { REGION_TRANSFORM, TILE_DIMENSIONS } from "@app/constants";
import { openLayerPanel, setMode } from "./tools";
import { frameState } from "./frame";
import { Property } from "./factorio-api.types";
import { createLink } from "./link-tracker";

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

type LinkType = "tuple";

type ReferenceLinkObject = {
  type: LinkType;
  path: string | null;
};

export type RegionObject = {
  id: string;
  type: RegionType;
  xform: Xform;
  bind: ReferenceLinkObject;
  color: [number, number, number];
};

type LayersStore = {
  images: Sprite[];
  sprites: SpriteObject[];
  regions: RegionObject[];
};

type ReferenceLinkState = {
  stage: "NONE" | "LOOKING_FOR_PARAMETER" | "ERROR";
  id: string | null;
  parameter: string | null;
};

type LayersReactiveStoreData = {
  layers: number[];
  regions: Record<string, string>;
  currentEditableRegionId: string | null;
  lastUpdate: number;
  referenceLinkState: ReferenceLinkState;
};

type LayersReactiveStoreFunc = {
  add: (value: number) => void;
  reorder: (value: number[]) => void;
  remove: (value: number) => void;
  attachRegion: (layer: string, region: string) => void;
  setRegionId: (id: string | null) => void;
  _SET: (cb: (draft: WritableDraft<LayersReactiveStoreData>) => void) => void;
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
  lastUpdate: -1,
  referenceLinkState: resetReferenceLinkState(),
  _SET: (cb: (draft: WritableDraft<LayersReactiveStoreData>) => void) =>
    set(produce(cb)),
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
  attachRegion(layer: string, region: string) {
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
        draft.lastUpdate = Math.random();
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

  const { attachRegion } = useLayersStore.getState();
  attachRegion(layer, region.id);
}

function createBlankRegion(t: RegionType = "selection"): RegionObject {
  return {
    id: uniqueId("region-"),
    type: t,
    xform: {
      position: { x: 0, y: 0 },
      size: { x: TILE_DIMENSIONS, y: TILE_DIMENSIONS },
    },
    bind: {
      type: "tuple",
      path: null,
    },
    color: [255, 0, 0],
  };
}

// todo rewrite this mess
// 1. set region id for UI or reset
// 2. find xform for selected region
// 3. create selection object
// 4. set REGION_TRANSFORM mode
// 5. activate layer for drawing selection (maybe rewrite this also)
export function activateRegion(id: string | null) {
  setRegionId(id);
  if (!id) return;

  const regionIdx = findIndex(
    (reg) => reg.id === id,
    layersState.read().regions
  );

  createSelection(layersState.read().regions[regionIdx]!);

  setMode(REGION_TRANSFORM);

  const layerId = useLayersStore.getState().regions[id];

  frameState.update((fs) => {
    fs.region = regionIdx;
    fs.active = findIndex((l) => l.id === layerId, layersState.read().sprites);
  });
}

export function setRegionId(id: string | null) {
  useLayersStore.getState().setRegionId(id);
}

export function updateRegionXform(idx: number, xform: Xform) {
  layersState.update((draft) => {
    if (has(["regions", idx], draft)) {
      draft.regions[idx].xform = cloneDeep(xform);
      setRegionId(null);
      setRegionId(draft.regions[idx].id);
    }
  });
}

export function startLink(id: string, parameter: string) {
  const layerId = useLayersStore.getState().regions[id];
  useFactorioApi.getState().setActiveLayer(layerId);
  openLayerPanel(true);

  useLayersStore.getState()._SET((draft) => {
    draft.referenceLinkState.stage = "LOOKING_FOR_PARAMETER";
    draft.referenceLinkState.id = id;
    draft.referenceLinkState.parameter = parameter;
  });
}
export function finishLink(property: Property) {
  useLayersStore.getState()._SET((draft) => {
    if (draft.referenceLinkState.stage !== "LOOKING_FOR_PARAMETER") {
      return;
    }

    const regIdx = findIndex(
      ({ id }) => draft.referenceLinkState.id === id,
      layersState.read().regions
    );

    if (regIdx < 0) {
      draft.referenceLinkState = resetReferenceLinkState();
      return;
    }

    const layerId = useFactorioApi.getState().activeLayerId;

    createLink(
      join(".", [
        "regions",
        regIdx,
        "xform",
        draft.referenceLinkState.parameter,
      ]),
      join(".", [layerId, "attributes", property.name])
    );

    draft.referenceLinkState = resetReferenceLinkState();
  });
}

function resetReferenceLinkState(): ReferenceLinkState {
  return {
    stage: "NONE",
    id: null,
    parameter: null,
  };
}
