import { createReactlessStore } from ".";
import {
  BBox,
  emptyBBox,
  emptyXform,
  generateCollider,
  Xform,
  xtobb,
} from "./common";
import { RegionObject, SpriteObject } from "./layers";
import { cloneDeep } from "lodash/fp";

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
  bbox: BBox; // for transformations

  collisions: Record<SelectBoxHandle, BBox>;
};

export const selectionState = createReactlessStore<SelectionStore>({
  xform: emptyXform(),
  bbox: emptyBBox(),

  collisions: collisionLUT(emptyBBox()),
});

export function createSelection(
  obj: SpriteObject | RegionObject
): SelectionStore {
  return selectionState.update((draft) => {
    draft.xform = cloneDeep(obj.xform);
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
  return {
    C: generateCollider([bbox.ax, bbox.ay, bbox.bx, bbox.by], [1, 1, -1, -1]),
    TL: generateCollider([bbox.ax, bbox.ay, bbox.ax, bbox.ay], [-1, -1, 1, 1]),
    TR: generateCollider([bbox.bx, bbox.ay, bbox.bx, bbox.ay], [-1, -1, 1, 1]),
    BL: generateCollider([bbox.ax, bbox.by, bbox.ax, bbox.by], [-1, -1, 1, 1]),
    BR: generateCollider([bbox.bx, bbox.by, bbox.bx, bbox.by], [-1, -1, 1, 1]),
    L: generateCollider([bbox.ax, bbox.ay, bbox.ax, bbox.by], [-1, 1, 1, -1]),
    R: generateCollider([bbox.bx, bbox.ay, bbox.bx, bbox.by], [-1, 1, 1, -1]),
    T: generateCollider([bbox.ax, bbox.ay, bbox.bx, bbox.ay], [1, -1, -1, 1]),
    B: generateCollider([bbox.ax, bbox.by, bbox.bx, bbox.by], [1, -1, -1, 1]),
  };
}
