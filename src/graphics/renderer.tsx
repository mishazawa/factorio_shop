import { BBox, Coords } from "@store/common";

import p5 from "p5";
import { toWorldSpace } from "./utils";
import { identity } from "lodash/fp";

type Renderer = p5;

export let renderer: p5 & Renderer = null!;

export function init(p: p5) {
  renderer = identity(p);
}

export function aabb({ ax, ay, bx, by }: BBox) {
  const mouse = toWorldSpace(getMouse());
  return mouse.x >= ax && mouse.x <= bx && mouse.y >= ay && mouse.y <= by;
}
export function isMouseInteraction(btn: p5.LEFT | p5.RIGHT | p5.CENTER) {
  return renderer.mouseIsPressed && renderer.mouseButton === btn;
}

export function isKeyPressed(btn: number) {
  return renderer.keyIsDown(btn);
}

export function getMouse(): Coords {
  return { x: renderer.mouseX, y: renderer.mouseY };
}
