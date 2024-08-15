import p5 from "p5";
import { onWindowResize } from "../components/utils";
import { TILE_DIMENSIONS, GRID_COLOR, GRID_WIDTH } from "../constants";

export function setup(p: p5) {
  return () => {
    p.createCanvas(0, 0);
    onWindowResize(p)();
    p.rectMode(p.CORNER);
  };
}

export function draw(p: p5) {
  return () => {
    p.background(250);
    drawGrid(p);
  };
}

function drawGrid(p: p5) {
  p.push();
  p.stroke(...GRID_COLOR);
  p.strokeWeight(GRID_WIDTH);

  let cursor = TILE_DIMENSIONS;

  while (cursor < p.height) {
    p.line(0, cursor, p.width, cursor);
    cursor += TILE_DIMENSIONS;
  }

  cursor = TILE_DIMENSIONS;
  while (cursor < p.width) {
    p.line(cursor, 0, cursor, p.height);
    cursor += TILE_DIMENSIONS;
  }
  p.pop();
}
