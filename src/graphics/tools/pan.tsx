import { getOrigin, pan, zoom } from "@store/frame";
import { flow, identity, partial } from "lodash/fp";
import {
  getScaledMouseCoords,
  subCoords,
  addCoords,
  roundCoords,
} from "../utils";
import { comply } from ".";

const state = {
  origin: { x: 0, y: 0 },
  mouse: { x: 0, y: 0 },
};

function click() {
  state.mouse = getScaledMouseCoords();
  state.origin = getOrigin();
}

function release() {}

function move() {
  return flow(
    getScaledMouseCoords,
    partial(subCoords, [state.mouse]), // calc delta
    partial(addCoords, [state.origin]), // add to origin
    roundCoords, // round to pixels
    pan // commit
  )(); // for the sake of text alignment
}

export default comply({
  mode: identity,
  click,
  release,
  move,
});

export function onMouseScroll({ deltaY: delta }: { deltaY: number }) {
  zoom(Math.sign(delta));
}
