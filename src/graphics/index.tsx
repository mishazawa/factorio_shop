import p5 from "p5";
import { onWindowResize } from "../components/utils";
import { grid, initUtils } from "./utils";
import { initRaycast } from "./raycast";
import { initSelection, selection } from "./selection";
import { layers } from "./layers";

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
    layers();
    grid();
    selection();
  };
}
