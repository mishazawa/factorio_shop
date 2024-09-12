import p5 from "p5";

import {
  DEBUG_CLICK,
  grid as drawGrid,
  drawOrigin,
  swapContols,
  isLeaveState,
  updateContols,
  withMode,
} from "./utils";

import { cropImage, drawSelection } from "./selection";

import { drawLayers, onLayerHover } from "./layers";
import {
  TRANSFORM,
  BACKGROUND_COLOR,
  CROP,
  KBD_ENTER,
  REGION_TRANSFORM,
} from "@app/constants";

import { frameState } from "@store/frame";
import { onMouseMove } from "./mouse";

export function draw(p: p5) {
  return () => {
    beforeFrame(p);

    drawLayers();
    drawGrid();

    withMode(TRANSFORM, () => {
      onLayerHover();
      drawSelection();
    });

    withMode(REGION_TRANSFORM, () => {
      drawSelection();
    });

    withMode(CROP, () => {
      onLayerHover();
      drawSelection();
      onCropApply(p.ENTER);
    });

    // update each frame
    // because event based approach is not smooth
    onMouseMove();

    DEBUG_CLICK();

    drawOrigin();
    afterFrame(p);
  };
}

function onCropApply(_btn: number) {
  const { keyboard } = frameState.read();

  if (isLeaveState(keyboard.prev[KBD_ENTER], keyboard.curr[KBD_ENTER])) {
    cropImage();
  }
}

function beforeFrame(p: p5) {
  const { zoom, pan } = frameState.read();
  p.background(BACKGROUND_COLOR);
  p.scale(zoom.value);

  // push here and pop after frame
  p.push();
  p.translate(-pan.x, -pan.y);

  updateContols(p);
}

function afterFrame(p: p5) {
  // pop stuff which was pushed before frame
  p.pop();

  swapContols();
}
