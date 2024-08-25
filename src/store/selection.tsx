import { createReactlessStore } from ".";
import { COLLISION_WIDTH, COLLISION_WIDTH_HALF, DEBUG } from "../constants";
import { SelectBox, SelectionStore, SpriteObject, Vec4 } from "./types";

export const realtimeStore = createReactlessStore<SelectionStore>({
  box: cleanSelection(),
  collisions: calculateCollisionsLUT(cleanSelection()),
  DEBUG_collisions: [],
});

export function updateSelectionBox(sprite: SpriteObject): SelectionStore {
  return realtimeStore.update((draft) => {
    draft.box = cleanSelection(
      sprite.xform.position.x,
      sprite.xform.position.y,
      sprite.width,
      sprite.height
    );
  });
}

export function reset() {
  realtimeStore.update((draft) => {
    draft.box = cleanSelection();
    draft.collisions = calculateCollisionsLUT(draft.box).map((v) => toAABB(v));
    if (DEBUG) {
      draft.DEBUG_collisions = calculateCollisionsLUT(draft.box);
    }
  });
}

export function refreshSelection() {
  realtimeStore.update((draft) => {
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
    offset: {
      left,
      top,
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
    box.offset.left,
    box.offset.top,
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
  if (box.offset.left < 0) {
    box.position.x += box.offset.left;
    box.offset.left = Math.abs(box.offset.left);
  }
  if (box.offset.top < 0) {
    box.position.y += box.offset.top;
    box.offset.top = Math.abs(box.offset.top);
  }
}
