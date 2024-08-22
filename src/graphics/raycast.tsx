import p5 from "p5";

let _PROC: p5 = null!;

export function initRaycast(p: p5) {
  _PROC = p;
}

export function castAABB(x: number, y: number, w: number, h: number) {
  return (
    _PROC.mouseX >= x &&
    _PROC.mouseX <= w &&
    _PROC.mouseY >= y &&
    _PROC.mouseY <= h
  );
}
