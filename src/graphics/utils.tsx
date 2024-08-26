import p5 from "p5";

import { castAABB } from "./raycast";
import { Xform } from "@store/common";
import {
  GRID_COLOR,
  GRID_WIDTH,
  OUTLINE_COLOR,
  OUTLINE_WIDTH,
  TILE_DIMENSIONS,
} from "@app/constants";

let _PROC: p5 = null!;

export function initUtils(p: p5) {
  _PROC = p;
}

export function hover(x: number, y: number, w: number, h: number) {
  if (castAABB(x, y, x + w, y + h)) {
    return true;
  }
  return false;
}

export function outline(
  x: number,
  y: number,
  w: number,
  h: number,
  stroke: number = OUTLINE_WIDTH,
  color: [number, number, number] = OUTLINE_COLOR
) {
  _PROC.push();
  _PROC.noFill();
  _PROC.strokeWeight(stroke);
  _PROC.stroke(color);
  _PROC.rect(x, y, w, h);
  _PROC.pop();
}

export function grid(dim: number = TILE_DIMENSIONS) {
  _PROC.push();
  _PROC.stroke(...GRID_COLOR);
  _PROC.strokeWeight(GRID_WIDTH);

  // vertical lines
  let cursor = dim;
  while (cursor < _PROC.height) {
    _PROC.line(0, cursor, _PROC.width, cursor);
    cursor += dim;
  }

  // horizontal lines
  cursor = dim;
  while (cursor < _PROC.width) {
    _PROC.line(cursor, 0, cursor, _PROC.height);
    cursor += dim;
  }

  _PROC.pop();
}

export function image(img: p5.Image, x: number, y: number, ...args: number[]) {
  _PROC.image(img, x, y, ...args);
}

export function snapToGrid(xform: Xform) {
  return {
    ...xform,
    position: {
      x: Math.round(xform.position.x / TILE_DIMENSIONS) * TILE_DIMENSIONS,
      y: Math.round(xform.position.y / TILE_DIMENSIONS) * TILE_DIMENSIONS,
    },
  };
}

export function translate(xform: Xform) {
  return {
    ...xform,
    position: {
      x: _PROC.mouseX + (xform.position.x - _PROC.pmouseX),
      y: _PROC.mouseY + (xform.position.y - _PROC.pmouseY),
    },
  };
}

export function resize(box: Xform) {
  return {
    position: {
      x: box.position.x,
      y: box.position.y,
    },
    size: {
      x: box.size.x,
      y: box.size.y,
    },
  };
}
