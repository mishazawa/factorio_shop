import { isMouseInteraction, renderer as R } from "./renderer";

import T from "./tools/transform";
import P from "./tools/pan";
import C from "./tools/crop";

import { withButtonState } from "./utils";
import { frameState } from "@store/frame";
import p5 from "p5";

export const state = {
  hover: false,
};

// not work in beforeFrame callback
function updateMouseButtons(p: p5) {
  frameState.update((fs) => {
    fs.mouse.curr.left = isMouseInteraction(p.LEFT);
    fs.mouse.curr.right = isMouseInteraction(p.RIGHT);
    fs.mouse.curr.center = isMouseInteraction(p.CENTER);
  });
}
export function onMouseClick() {
  updateMouseButtons(R);
  withButtonState(P.click, R.CENTER);
  withButtonState(T.click, R.LEFT);
  withButtonState(C.click, R.LEFT);
}

export function onMouseMove() {
  updateMouseButtons(R);
  withButtonState(P.move, R.CENTER);
  withButtonState(T.move, R.LEFT);
  withButtonState(C.move, R.LEFT);
}
export function onMouseRelease() {
  updateMouseButtons(R);
  withButtonState(P.release, R.CENTER);
  withButtonState(T.release, R.LEFT);
  withButtonState(C.release, R.LEFT);
}

export function onMouseOver() {
  state.hover = true;
}
export function onMouseOut() {
  state.hover = false;
}
