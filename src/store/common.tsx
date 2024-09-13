import { COLLISION_WIDTH_HALF } from "@app/constants";
import { WritableDraft } from "immer";
import p5 from "p5";

export type Coords = { x: number; y: number };

// drawing purpose
export type Xform = {
  position: Coords;
  size: Coords;
};

// collision/interaction purpose
export type BBox = {
  ax: number;
  ay: number;
  bx: number;
  by: number;
};

export type Sprite = p5.Image;

export type Vec4 = [number, number, number, number];

export function emptyXform() {
  return { position: { x: 0, y: 0 }, size: { x: 0, y: 0 } };
}

export function emptyBBox() {
  return { ax: 0, ay: 0, bx: 0, by: 0 };
}
// calculate absolute bbox
export function xtobb({ position, size }: Xform, abs = false): BBox {
  if (abs) {
    return {
      ax: Math.min(position.x, position.x + size.x),
      ay: Math.min(position.y, position.y + size.y),
      bx: Math.max(position.x, position.x + size.x),
      by: Math.max(position.y, position.y + size.y),
    };
  }
  return {
    ax: position.x,
    ay: position.y,
    bx: position.x + size.x,
    by: position.y + size.y,
  };
}

export function generateCollider(bbox: Vec4, mask: Vec4): BBox {
  return {
    ax: bbox[0] + COLLISION_WIDTH_HALF * mask[0],
    ay: bbox[1] + COLLISION_WIDTH_HALF * mask[1],
    bx: bbox[2] + COLLISION_WIDTH_HALF * mask[2],
    by: bbox[3] + COLLISION_WIDTH_HALF * mask[3],
  };
}

export type InternalSetFunction<T> = {
  _SET: (cb: (draft: WritableDraft<T>) => void) => void;
};
