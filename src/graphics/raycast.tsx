import p5 from "p5";
import { Xform } from "../components/store/images";
import { TILE_DIMENSIONS } from "../constants";

let _PROC: p5 = null!;

export function initRaycast(p: p5) {
  _PROC = p;
}

export function castAABB(x: number, y: number, w: number, h: number) {
  return (
    _PROC.mouseX >= x &&
    _PROC.mouseX <= w &&
    _PROC.mouseY >= y &&
    _PROC.mouseY <= h
  );
}

export function isLeftMouseInteraction() {
  return _PROC.mouseIsPressed && _PROC.mouseButton === _PROC.LEFT;
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

export function snapToGrid(xform: Xform) {
  return {
    ...xform,
    position: {
      x: Math.round(xform.position.x / TILE_DIMENSIONS) * TILE_DIMENSIONS,
      y: Math.round(xform.position.y / TILE_DIMENSIONS) * TILE_DIMENSIONS,
    },
  };
}
