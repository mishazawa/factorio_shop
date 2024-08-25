import p5 from "p5";
import { onWindowResize } from "../utils";
import { grid as drawGrid, initUtils } from "./utils";
import { initRaycast, isMouseInteraction } from "./raycast";
import {
  drawSelection,
  initSelection,
  onSelectionClick,
  onSelectionRelease,
} from "./selection";
import { drawLayers, onLayerClick, onLayerHover } from "./layers";
import { toolsStore } from "../store/tools";
import { TRANSFORM } from "../constants";

export function setup(p: p5) {
  return () => {
    p.createCanvas(0, 0);
    onWindowResize(p)();
    p.rectMode(p.CORNER);
    // important calls
    initUtils(p);
    initRaycast(p);
    initSelection(p);
  };
}

export function draw(p: p5) {
  return () => {
    // clear screen
    p.background(250);

    drawLayers();
    drawGrid();

    withTransformMode(() => {
      onLayerHover();
      onMousePress(onLeftMousePress, p.LEFT);
      onMouseRelease(onLeftMouseRelease, p.LEFT);
      drawSelection();
    });
  };
}

function withTransformMode(callback: () => void) {
  if (toolsStore.read().mode !== TRANSFORM) return;
  callback();
}

function onMousePress(cb: () => void, btn: p5.LEFT | p5.RIGHT) {
  if (!isMouseInteraction(btn)) return;
  cb();
}

function onMouseRelease(cb: () => void, btn: p5.LEFT | p5.RIGHT) {
  if (isMouseInteraction(btn)) return;
  cb();
}

function onLeftMousePress() {
  onSelectionClick();
  onLayerClick();
}

function onLeftMouseRelease() {
  onSelectionRelease();
}
