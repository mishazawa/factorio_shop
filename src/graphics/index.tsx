import p5 from "p5";

import { grid as drawGrid, initUtils, sequence } from "./utils";
import { initRaycast, isKeyPressed, isMouseInteraction } from "./raycast";
import {
  cropImage,
  drawSelection,
  initSelection,
  onCropPress,
  onCropRelease,
  onSelectionClick,
  onSelectionPress,
  onSelectionRelease,
} from "./selection";
import { drawLayers, onLayerClick, onLayerHover, onLayerPress } from "./layers";
import { TRANSFORM, BACKGROUND_COLOR, CROP, KBD_ENTER } from "@app/constants";
import { onWindowResize } from "@app/utils";
import { frameState } from "@store/frame";
import { ToolMode, toolsState } from "@store/tools";
import { cloneDeep } from "lodash";

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

    withMode(TRANSFORM, () => {
      onLayerHover();
      onMouseClick(onLeftMouseClick, p.LEFT);
      onMousePress(onLeftMousePress, p.LEFT);
      onMouseRelease(onLeftMouseRelease, p.LEFT);
      drawSelection();
    });

    withMode(CROP, () => {
      onLayerHover();
      onMouseClick(onLeftMouseClick, p.LEFT);
      onMousePress(onLeftMousePressCrop, p.LEFT);
      onMouseRelease(onLeftMouseReleaseCrop, p.LEFT);
      drawSelection();
      onCropApply(p.ENTER);
    });

    afterFrame();
  };
}

function withMode(mode: ToolMode, callback: () => void) {
  if (toolsState.read().mode !== mode) return;
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
  // if selection was clicked do not perform layer ops
  // kind of event propagation
  // todo: maybe join layers and selection
  // because selection in kind of special case of layer
  sequence(onSelectionClick, onLayerClick);
}

function onLeftMousePress() {
  onSelectionPress();
  onLayerPress();
}

function onLeftMousePressCrop() {
  onCropPress();
}
function onLeftMouseReleaseCrop() {
  onCropRelease();
}

function onCropApply(btn: number) {
  const { keyboard } = frameState.read();

  if (isLeaveState(keyboard.prev[KBD_ENTER], keyboard.curr[KBD_ENTER])) {
    cropImage();
  }
}

function onLeftMouseRelease() {
  onSelectionRelease();
}

function beforeFrame(p: p5) {
  p.background(BACKGROUND_COLOR);

  frameState.update((fs) => {
    fs.mouse.curr.left = isMouseInteraction(p.LEFT);
    fs.mouse.curr.right = isMouseInteraction(p.RIGHT);

    fs.keyboard.curr[KBD_ENTER] = isKeyPressed(p.ENTER);
  });
}
function afterFrame() {
  frameState.update((fs) => {
    fs.mouse.prev = cloneDeep(fs.mouse.curr);
    fs.keyboard.prev = cloneDeep(fs.keyboard.curr);
  });
}

function isMouseClick(btn: p5.LEFT | p5.RIGHT) {
  const { mouse } = frameState.read();
  return isEnteredState(mouse.prev[btn], mouse.curr[btn]);
}

function isEnteredState(prev: boolean, curr: boolean) {
  return curr && curr !== prev;
}
function isLeaveState(prev: boolean, curr: boolean) {
  return !curr && curr !== prev;
}
