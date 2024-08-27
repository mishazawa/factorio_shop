import p5 from "p5";

// drawing purpose
export type Xform = {
  position: { x: number; y: number };
  size: { x: number; y: number };
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
export function xtobb({ position, size }: Xform): BBox {
  return {
    ax: Math.min(position.x, position.x + size.x),
    ay: Math.min(position.y, position.y + size.y),
    bx: Math.max(position.x, position.x + size.x),
    by: Math.max(position.y, position.y + size.y),
  };
}
