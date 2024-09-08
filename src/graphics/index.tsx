import p5 from "p5";

import {
  addCoords,
  DEBUG_box,
  grid as drawGrid,
  drawOrigin,
  getScaledMouseCoords,
  onWindowResize,
  roundCoords,
  sequence,
  subCoords,
} from "./utils";

import {
  cropImage,
  drawSelection,
  onCropPress,
  onCropRelease,
  onSelectionClick,
  onSelectionPress,
  onSelectionRelease,
} from "./selection";

import { drawLayers, onLayerClick, onLayerHover, onLayerPress } from "./layers";
import { TRANSFORM, BACKGROUND_COLOR, CROP, KBD_ENTER } from "@app/constants";

import {
  expireFrameContols,
  frameState,
  getOrigin,
  pan,
  zoom,
} from "@store/frame";
import { ToolMode, toolsState } from "@store/tools";
import { init, isKeyPressed, isMouseInteraction } from "./renderer";
import { flow } from "lodash";

export function setup(p: p5) {
  return () => {
    p.createCanvas(0, 0);
    onWindowResize(p)();
    p.rectMode(p.CORNER);
    // important calls
    init(p);
  };
}

export function draw(p: p5) {
  return () => {
    beforeFrame(p);
    drawOrigin();

    onMouseClick(onMiddleMouseClick, p.CENTER);
    onMousePress(onMiddleMousePress, p.CENTER);

    drawLayers();

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

    DEBUG_box();
    afterFrame(p);
    drawGrid();
  };
}

function withMode(mode: ToolMode, callback: () => void) {
  if (toolsState.read().mode !== mode) return;
  callback();
}

function onMouseClick(cb: () => void, btn: p5.LEFT | p5.RIGHT | p5.CENTER) {
  if (!isMouseClick(btn)) return;
  cb();
}

function onMousePress(cb: () => void, btn: p5.LEFT | p5.RIGHT | p5.CENTER) {
  if (!isMouseInteraction(btn)) return;
  cb();
}

function onMouseRelease(cb: () => void, btn: p5.LEFT | p5.RIGHT | p5.CENTER) {
  if (isMouseInteraction(btn)) return;
  if (isMouseRelease(btn)) cb();
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
  p.scale(frameState.read().zoom.value);
  p.push();
  p.translate(-frameState.read().pan.x, -frameState.read().pan.y);

  frameState.update((fs) => {
    fs.mouse.curr.left = isMouseInteraction(p.LEFT);
    fs.mouse.curr.right = isMouseInteraction(p.RIGHT);
    fs.mouse.curr.center = isMouseInteraction(p.CENTER);

    fs.keyboard.curr[KBD_ENTER] = isKeyPressed(p.ENTER);
  });
}

function afterFrame(p: p5) {
  p.pop();
  expireFrameContols();
}

function isMouseClick(btn: p5.LEFT | p5.RIGHT | p5.CENTER) {
  const { mouse } = frameState.read();
  return isEnteredState(mouse.prev[btn], mouse.curr[btn]);
}

function isMouseRelease(btn: p5.LEFT | p5.RIGHT | p5.CENTER) {
  const { mouse } = frameState.read();
  return isLeaveState(mouse.prev[btn], mouse.curr[btn]);
}

function isEnteredState(prev: boolean, curr: boolean) {
  return curr && curr !== prev;
}
function isLeaveState(prev: boolean, curr: boolean) {
  return !curr && curr !== prev;
}

export function onMouseScroll({ delta }: { delta: number }) {
  zoom(Math.sign(delta));
}

let old_origin = { x: 0, y: 0 };
let ms = { x: 0, y: 0 };

function onMiddleMouseClick() {
  ms = getScaledMouseCoords();
  old_origin = getOrigin();
}

const panningFn = flow([
  getScaledMouseCoords,
  (v) => subCoords(ms, v), // calc delta
  (v) => addCoords(old_origin, v), // add to origin
  roundCoords, // round to pixels
  pan, // commit
]);

function onMiddleMousePress() {
  panningFn();
}
