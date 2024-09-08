import { BBox, Coords } from "@store/common";
import { assignIn } from "lodash";
import p5 from "p5";

type Renderer = {
  processing: p5;
};

function createRenderer(p: p5): p5 & Renderer {
  return assignIn(p, { processing: p });
}

export let renderer: p5 & Renderer = null!;

export function init(p: p5) {
  renderer = createRenderer(p);
}

export function aabb({ ax, ay, bx, by }: BBox) {
  return (
    renderer.mouseX >= ax &&
    renderer.mouseX <= bx &&
    renderer.mouseY >= ay &&
    renderer.mouseY <= by
  );
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
