import p5 from "p5";

import { Xform } from "@store/common";
import {
  GRID_COLOR,
  GRID_WIDTH,
  OUTLINE_COLOR,
  OUTLINE_WIDTH,
  RESPONSIVE_CANVAS,
  TILE_DIMENSIONS,
} from "@app/constants";
import { useFactorioApi } from "@store/api";
import { createLayer, useLayersStore, removeImage } from "@store/layers";

type PImage = p5.Image & {
  canvas: HTMLCanvasElement;
  drawingContext: CanvasRenderingContext2D;
  modified: boolean;
};

let _PROC: p5 = null!;

export function initUtils(p: p5) {
  _PROC = p;
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

export function assignOnlyPositiveValue(v: number, cb: (v: number) => void) {
  return v < 0 ? null : cb(v);
}

export function sequence(...fns: (() => boolean)[]) {
  for (let i = 0; i < fns.length; i++) {
    if (fns[i]()) return;
  }
}

export function updateCanvasDimensions(p5: p5) {
  return {
    canvasWidth: p5.windowWidth,
    canvasHeight: p5.windowHeight,
  };
}

export function onWindowResize(p5: p5) {
  if (!RESPONSIVE_CANVAS) return () => {};
  return () => {
    const { canvasWidth, canvasHeight } = updateCanvasDimensions(p5);
    const c = p5.createCanvas(canvasWidth, canvasHeight);

    const x = (p5.windowWidth - canvasWidth) / 2;
    const y = (p5.windowHeight - canvasHeight) / 2;
    c.position(x, y);

    p5.pixelDensity(window.devicePixelRatio);
  };
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
