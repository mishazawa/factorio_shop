import p5 from "p5";

import { grid as drawGrid, initUtils } from "./utils";
import { initRaycast, isMouseInteraction } from "./raycast";
import {
  drawSelection,
  initSelection,
  onSelectionClick,
  onSelectionPress,
  onSelectionRelease,
} from "./selection";
import { drawLayers, onLayerClick, onLayerHover, onLayerPress } from "./layers";
import { TRANSFORM, BACKGROUND_COLOR } from "@app/constants";
import { onWindowResize } from "@app/utils";
import { frameState } from "@store/frame";
import { toolsState } from "@store/tools";

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
    beforeFrame(p);

    drawLayers();
    drawGrid();

    withTransformMode(() => {
      onLayerHover();
      onMouseClick(onLeftMouseClick, p.LEFT);
      onMousePress(onLeftMousePress, p.LEFT);
      onMouseRelease(onLeftMouseRelease, p.LEFT);
      drawSelection();
    });

    afterFrame();
  };
}

function withTransformMode(callback: () => void) {
  if (toolsState.read().mode !== TRANSFORM) return;
  callback();
}

function onMouseClick(cb: () => void, btn: p5.LEFT | p5.RIGHT) {
  if (!isMouseClick(btn)) return;
  cb();
}

function onMousePress(cb: () => void, btn: p5.LEFT | p5.RIGHT) {
  if (!isMouseInteraction(btn)) return;
  cb();
}

function onMouseRelease(cb: () => void, btn: p5.LEFT | p5.RIGHT) {
  if (isMouseInteraction(btn)) return;
  cb();
}

function onLeftMouseClick() {
  // if selection was clicker do not perform any layer ops
  // kind of prevent bubbling =)
  // todo: maybe join layers and selection
  // because selection in kind of special case of layer
  if (onSelectionClick()) return;
  onLayerClick();
}

function onLeftMousePress() {
  onSelectionPress();
  onLayerPress();
}

function onLeftMouseRelease() {
  onSelectionRelease();
}

function beforeFrame(p: p5) {
  p.background(BACKGROUND_COLOR);

  frameState.update((fs) => {
    fs.mouse.curr.left = isMouseInteraction(p.LEFT);
    fs.mouse.curr.right = isMouseInteraction(p.RIGHT);
  });
}
function afterFrame() {
  frameState.update((fs) => {
    fs.mouse.prev.left = fs.mouse.curr.left;
    fs.mouse.prev.right = fs.mouse.curr.right;
  });
}

function isMouseClick(btn: p5.LEFT | p5.RIGHT) {
  const { mouse } = frameState.read();
  switch (btn) {
    case "left":
      return mouse.curr.left && mouse.curr.left !== mouse.prev.left;
    case "right":
      return mouse.curr.right && mouse.curr.right !== mouse.prev.right;
  }
}
