import p5 from "p5";

import { Coords, Xform } from "@store/common";
import {
  GRID_COLOR,
  GRID_WIDTH,
  KBD_ENTER,
  OUTLINE_COLOR,
  OUTLINE_WIDTH,
  TILE_DIMENSIONS,
} from "@app/constants";
import { useFactorioApi } from "@store/api";
import { createLayer, useLayersStore, removeImage } from "@store/layers";
import {
  getMouse,
  isKeyPressed,
  isMouseInteraction,
  renderer as R,
} from "./renderer";
import { frameState, getOrigin } from "@store/frame";
import { cloneDeep, flow, round } from "lodash/fp";
import { ToolMode, toolsState } from "@store/tools";

type PImage = p5.Image & {
  canvas: HTMLCanvasElement;
  drawingContext: CanvasRenderingContext2D;
  modified: boolean;
};

export function drawOrigin() {
  R.push();
  R.strokeWeight(1);
  R.stroke([255, 0, 0]);
  R.line(0, 0, TILE_DIMENSIONS, 0);
  R.stroke([0, 0, 255]);
  R.line(0, 0, 0, TILE_DIMENSIONS);
  R.pop();
}

export function outline(
  x: number,
  y: number,
  w: number,
  h: number,
  stroke: number = OUTLINE_WIDTH,
  color: [number, number, number] = OUTLINE_COLOR
) {
  R.push();
  R.noFill();
  R.strokeWeight(stroke);
  R.stroke(color);
  R.rect(x, y, w, h);
  R.pop();
}

export function grid(dim: number = TILE_DIMENSIONS) {
  const { hideGrid } = frameState.read().zoom;
  if (hideGrid) return;
  const orig = getOrigin();
  const zr = getZoomRatio();

  const widthZoom = R.width * zr.x + orig.x;
  const heightZoom = R.height * zr.y + orig.y;

  R.push();
  R.stroke(...GRID_COLOR);
  R.strokeWeight(GRID_WIDTH);

  // vertical lines
  let cursor = Math.round(orig.y / TILE_DIMENSIONS) * TILE_DIMENSIONS;
  while (cursor < heightZoom) {
    R.line(orig.x, cursor, widthZoom, cursor);
    cursor += dim;
  }

  // horizontal lines
  cursor = Math.round(orig.x / TILE_DIMENSIONS) * TILE_DIMENSIONS;

  while (cursor < widthZoom) {
    R.line(cursor, orig.y, cursor, heightZoom);
    cursor += dim;
  }

  R.pop();
}

export function image(img: p5.Image, x: number, y: number, ...args: number[]) {
  R.image(img, x, y, ...args);
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
  const { x, y } = toWorldSpace({ x: R.mouseX, y: R.mouseY });
  const { x: px, y: py } = toWorldSpace({ x: R.pmouseX, y: R.pmouseY });
  return {
    ...xform,
    position: {
      x: x + (xform.position.x - px),
      y: y + (xform.position.y - py),
    },
  };
}

export function assignOnlyPositiveValue(v: number, cb: (v: number) => void) {
  return v < 0 ? null : cb(v);
}

export function sequence(...fns: (() => boolean)[]) {
  for (let i = 0; i < fns.length; i++) {
    if (fns[i]()) return;
  }
}

export function loadPImage(file: File) {
  const reader = new FileReader();
  const fileImage = new Image();
  const processingImage = new p5.Image(1, 1) as PImage;

  reader.addEventListener(
    "load",
    () => {
      fileImage.src = reader.result as string;
    },
    false
  );

  fileImage.onload = () => {
    processingImage.width = processingImage.canvas.width = fileImage.width;
    processingImage.height = processingImage.canvas.height = fileImage.height;

    processingImage.drawingContext.drawImage(fileImage, 0, 0);
    processingImage.modified = true;

    // add data to realtime storage and track layers in UI storage
    const [index, sprite] = createLayer(processingImage, file, fileImage);
    useLayersStore.getState().add(index);
    useFactorioApi.getState().createLayer(sprite?.id);
  };

  reader.readAsDataURL(file);
}

export function unloadPImage(layerIndex: number) {
  const id = removeImage(layerIndex);
  useLayersStore.getState().remove(layerIndex);
  useFactorioApi.getState().removeLayer(id);
}

export function addCoords(a: Coords, b: Coords) {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
}

export function subCoords(a: Coords, b: Coords) {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
}

export function scaleCoords(a: Coords, b: Coords) {
  return {
    x: a.x * b.x,
    y: a.y * b.y,
  };
}

export function roundCoords(a: Coords) {
  return {
    x: round(a.x),
    y: round(a.y),
  };
}

export function getZoomRatio() {
  const { value: zoom } = frameState.read().zoom;
  return {
    x: R.width / (R.width * zoom),
    y: R.height / (R.height * zoom),
  };
}

export const getScaledMouseCoords = flow(
  () => [getMouse(), getZoomRatio()], // get values of mouse and zoom
  ([a, b]) => scaleCoords(a, b) // scale to zoom level
);

export function toWorldSpace(coords: Coords) {
  const zoomRatio = getZoomRatio();
  const orig = getOrigin();
  return addCoords(scaleCoords(zoomRatio, coords), orig);
}

export function withMode(mode: ToolMode, callback: (a: void) => void) {
  if (toolsState.read().mode === mode) callback();
}

export function withButton(
  cb: () => void,
  btn: p5.LEFT | p5.RIGHT | p5.CENTER
) {
  if (isMouseInteraction(btn)) cb();
}

export function DEBUG_CLICK() {
  // const { x, y } = toWorldSpace(getMouse());
  // outline(x, y, 10, 10, 3, [55, 66, 77]);
}

export function isLeaveState(prev: boolean, curr: boolean) {
  return !curr && curr !== prev;
}

// export function isEnteredState(prev: boolean, curr: boolean) {
//   return curr && curr !== prev;
// }

export function withButtonState(
  cb: () => void,
  btn: p5.LEFT | p5.RIGHT | p5.CENTER
) {
  const { mouse } = frameState.read();
  if (mouse.curr[btn]) cb();
}

export function updateContols(p: p5) {
  frameState.update((fs) => {
    fs.keyboard.curr[KBD_ENTER] = isKeyPressed(p.ENTER);
  });
}

export function swapContols() {
  frameState.update((fs) => {
    fs.mouse.prev = cloneDeep(fs.mouse.curr);
    fs.keyboard.prev = cloneDeep(fs.keyboard.curr);
  });
}
