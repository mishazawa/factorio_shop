import { BBox } from "@store/common";
import p5 from "p5";

let _PROC: p5 = null!;

export function initRaycast(p: p5) {
  _PROC = p;
}

export function checkAABB({ ax, ay, bx, by }: BBox) {
  return (
    _PROC.mouseX >= ax &&
    _PROC.mouseX <= bx &&
    _PROC.mouseY >= ay &&
    _PROC.mouseY <= by
  );
}

export function isMouseInteraction(btn: p5.LEFT | p5.RIGHT) {
  return _PROC.mouseIsPressed && _PROC.mouseButton === btn;
}
