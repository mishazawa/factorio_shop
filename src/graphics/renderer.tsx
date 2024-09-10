import { BBox, Coords } from "@store/common";

import p5 from "p5";
import { toWorldSpace } from "./utils";
import { identity } from "lodash/fp";
import {
  onMouseClick,
  onMouseOut,
  onMouseOver,
  onMouseRelease,
  state as mouseState,
} from "./mouse";
import { onMouseScroll } from "./tools/pan";
import { PIXEL_DENSITY, RESPONSIVE_CANVAS } from "@app/constants";

type Renderer = p5;

export let renderer: p5 & Renderer = null!;
export let canvas: p5.Renderer = null!;

export function init(p: p5) {
  renderer = identity(p);

  canvas = renderer.createCanvas(0, 0);
  canvas.mouseWheel(onMouseScroll);
  canvas.mousePressed(onMouseClick);
  canvas.mouseReleased(onMouseRelease);

  canvas.mouseOver(onMouseOver);
  canvas.mouseOut(onMouseOut);

  renderer.rectMode(renderer.CORNER);
  renderer.frameRate(60);
  renderer.windowResized = windowResized;

  // initial resize
  windowResized();
}

export function setCanvas(c: p5.Renderer) {
  canvas = identity(c);
}

export function aabb({ ax, ay, bx, by }: BBox) {
  const mouse = toWorldSpace(getMouse());
  return mouse.x >= ax && mouse.x <= bx && mouse.y >= ay && mouse.y <= by;
}
export function isMouseInteraction(btn: p5.LEFT | p5.RIGHT | p5.CENTER) {
  return (
    mouseState.hover && renderer.mouseIsPressed && renderer.mouseButton === btn
  );
}

export function isKeyPressed(btn: number) {
  return renderer.keyIsDown(btn);
}

export function getMouse(): Coords {
  return { x: renderer.mouseX, y: renderer.mouseY };
}

function windowResized() {
  if (!RESPONSIVE_CANVAS) return;

  const [canvasWidth, canvasHeight] = [
    renderer.windowWidth,
    renderer.windowHeight,
  ];

  const canvas = renderer.createCanvas(canvasWidth, canvasHeight);

  canvas.position(
    (renderer.windowWidth - canvasWidth) / 2,
    (renderer.windowHeight - canvasHeight) / 2
  );

  renderer.pixelDensity(PIXEL_DENSITY);

  setCanvas(canvas);
}
