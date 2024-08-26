import { DEBUG, COLLISION_WIDTH_HALF, COLLISION_WIDTH } from "@app/constants";
import { createReactlessStore } from ".";
import { Vec4, Xform } from "./common";
import { SpriteObject } from "./layers";

export type SelectBoxHandle = "T" | "R" | "B" | "L" | "TR" | "TL" | "BR" | "BL";

export type SelectBox = Xform;

type SelectionStore = {
  box: SelectBox;
  collisions: Vec4[];
  DEBUG_collisions: Vec4[];
};

export const selectionState = createReactlessStore<SelectionStore>({
  box: cleanSelection(),
  collisions: calculateCollisionsLUT(cleanSelection()),
  DEBUG_collisions: [],
});

export function updateSelectionBox(sprite: SpriteObject): SelectionStore {
  return selectionState.update((draft) => {
    draft.box = cleanSelection(
      sprite.xform.position.x,
      sprite.xform.position.y,
      sprite.xform.size.x,
      sprite.xform.size.y
    );
  });
}

export function reset() {
  selectionState.update((draft) => {
    draft.box = cleanSelection();
    draft.collisions = calculateCollisionsLUT(draft.box).map((v) => toAABB(v));
    if (DEBUG) {
      draft.DEBUG_collisions = calculateCollisionsLUT(draft.box);
    }
  });
}

export function refreshSelection() {
  selectionState.update((draft) => {
    fixNegativeOffsets(draft.box);
    if (DEBUG) {
      draft.DEBUG_collisions = calculateCollisionsLUT(draft.box);
    }
    draft.collisions = calculateCollisionsLUT(draft.box).map((v) => toAABB(v));
  });
}

function cleanSelection(
  x: number = 0,
  y: number = 0,
  left: number = 100,
  top: number = 100
): SelectBox {
  return {
    position: {
      x,
      y,
    },
    size: {
      x: left,
      y: top,
    },
  };
}

function toAABB(a: Vec4): Vec4 {
  return [a[0], a[1], a[0] + a[2], a[1] + a[3]];
}

function calculateCollisionsLUT(box: SelectBox): Vec4[] {
  const [x0, y0, x1, y1] = [
    box.position.x,
    box.position.y,
    box.size.x,
    box.size.y,
  ];
  return [
    [
      x0 - COLLISION_WIDTH_HALF,
      y0 - COLLISION_WIDTH_HALF,
      COLLISION_WIDTH,
      COLLISION_WIDTH,
    ],
    [
      x0 - COLLISION_WIDTH_HALF + x1,
      y0 - COLLISION_WIDTH_HALF,
      COLLISION_WIDTH,
      COLLISION_WIDTH,
    ],
    [
      x0 - COLLISION_WIDTH_HALF,
      y0 - COLLISION_WIDTH_HALF + y1,
      COLLISION_WIDTH,
      COLLISION_WIDTH,
    ],
    [
      x0 - COLLISION_WIDTH_HALF + x1,
      y0 - COLLISION_WIDTH_HALF + y1,
      COLLISION_WIDTH,
      COLLISION_WIDTH,
    ],
    [
      x0 + COLLISION_WIDTH_HALF,
      y0 - COLLISION_WIDTH_HALF,
      x1 - COLLISION_WIDTH - 1,
      COLLISION_WIDTH,
    ],
    [
      x0 - COLLISION_WIDTH_HALF,
      y0 + COLLISION_WIDTH_HALF,
      COLLISION_WIDTH,
      y1 - COLLISION_WIDTH - 1,
    ],
    [
      x0 - COLLISION_WIDTH_HALF + x1,
      y0 + COLLISION_WIDTH_HALF,
      COLLISION_WIDTH,
      y1 - COLLISION_WIDTH - 1,
    ],
    [
      x0 + COLLISION_WIDTH_HALF,
      y0 - COLLISION_WIDTH_HALF + y1,
      x1 - COLLISION_WIDTH - 1,
      COLLISION_WIDTH,
    ],
  ];
}

function fixNegativeOffsets(box: SelectBox) {
  if (box.size.x < 0) {
    box.position.x += box.size.x;
    box.size.x = Math.abs(box.size.x);
  }
  if (box.size.y < 0) {
    box.position.y += box.size.y;
    box.size.y = Math.abs(box.size.y);
  }
}
