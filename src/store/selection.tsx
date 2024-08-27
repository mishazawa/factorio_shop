import { COLLISION_WIDTH_HALF } from "@app/constants";
import { createReactlessStore } from ".";
import { BBox, emptyBBox, emptyXform, Xform, xtobb } from "./common";
import { SpriteObject } from "./layers";
import { cloneDeep } from "lodash";

export type SelectBoxHandle =
  | "T"
  | "R"
  | "B"
  | "L"
  | "TR"
  | "TL"
  | "BR"
  | "BL"
  | "C";

type SelectionStore = {
  xform: Xform;
  bbox: BBox;
  collisions: Record<SelectBoxHandle, BBox>;
};

export const selectionState = createReactlessStore<SelectionStore>({
  xform: emptyXform(),
  bbox: emptyBBox(),
  collisions: collisionLUT(emptyBBox()),
});

export function createSelection(sprite: SpriteObject): SelectionStore {
  return selectionState.update((draft) => {
    draft.xform = cloneDeep(sprite.xform);
    draft.bbox = xtobb(draft.xform);
    draft.collisions = collisionLUT(draft.bbox);
  });
}

export function updateSelectionXform(sprite: SpriteObject): SelectionStore {
  return selectionState.update((draft) => {
    draft.xform = cloneDeep(sprite.xform);
  });
}
export function updateSelectionBBox(): SelectionStore {
  return selectionState.update((draft) => {
    draft.bbox = xtobb(draft.xform);
    draft.collisions = collisionLUT(draft.bbox);
  });
}

function collisionLUT(bbox: BBox) {
  const top_left: BBox = {
    ax: bbox.ax - COLLISION_WIDTH_HALF,
    ay: bbox.ay - COLLISION_WIDTH_HALF,
    bx: bbox.ax + COLLISION_WIDTH_HALF,
    by: bbox.ay + COLLISION_WIDTH_HALF,
  };

  const top_right: BBox = {
    ax: bbox.bx - COLLISION_WIDTH_HALF,
    ay: bbox.ay - COLLISION_WIDTH_HALF,
    bx: bbox.bx + COLLISION_WIDTH_HALF,
    by: bbox.ay + COLLISION_WIDTH_HALF,
  };

  const bottom_left: BBox = {
    ax: bbox.ax - COLLISION_WIDTH_HALF,
    ay: bbox.by - COLLISION_WIDTH_HALF,
    bx: bbox.ax + COLLISION_WIDTH_HALF,
    by: bbox.by + COLLISION_WIDTH_HALF,
  };

  const bottom_right: BBox = {
    ax: bbox.bx - COLLISION_WIDTH_HALF,
    ay: bbox.by - COLLISION_WIDTH_HALF,
    bx: bbox.bx + COLLISION_WIDTH_HALF,
    by: bbox.by + COLLISION_WIDTH_HALF,
  };

  const center: BBox = {
    ax: bbox.ax + COLLISION_WIDTH_HALF,
    ay: bbox.ay + COLLISION_WIDTH_HALF,
    bx: bbox.bx - COLLISION_WIDTH_HALF,
    by: bbox.by - COLLISION_WIDTH_HALF,
  };

  const left: BBox = {
    ax: bbox.ax - COLLISION_WIDTH_HALF,
    ay: bbox.ay + COLLISION_WIDTH_HALF,
    bx: bbox.ax + COLLISION_WIDTH_HALF,
    by: bbox.by - COLLISION_WIDTH_HALF,
  };

  const right: BBox = {
    ax: bbox.bx - COLLISION_WIDTH_HALF,
    ay: bbox.ay + COLLISION_WIDTH_HALF,
    bx: bbox.bx + COLLISION_WIDTH_HALF,
    by: bbox.by - COLLISION_WIDTH_HALF,
  };

  const top: BBox = {
    ax: bbox.ax + COLLISION_WIDTH_HALF,
    ay: bbox.ay - COLLISION_WIDTH_HALF,
    bx: bbox.bx - COLLISION_WIDTH_HALF,
    by: bbox.ay + COLLISION_WIDTH_HALF,
  };

  const bottom: BBox = {
    ax: bbox.ax + COLLISION_WIDTH_HALF,
    ay: bbox.by - COLLISION_WIDTH_HALF,
    bx: bbox.bx - COLLISION_WIDTH_HALF,
    by: bbox.by + COLLISION_WIDTH_HALF,
  };

  return {
    C: center,
    TL: top_left,
    TR: top_right,
    BL: bottom_left,
    BR: bottom_right,
    L: left,
    R: right,
    T: top,
    B: bottom,
  };
}
