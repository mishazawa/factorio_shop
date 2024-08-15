import p5 from "p5";
import { RESPONSIVE_CANVAS } from "../constants";

export function updateCanvasDimensions(p5: p5) {
  return {
    canvasWidth: p5.windowWidth,
    canvasHeight: p5.windowHeight,
  };
}

export function onWindowResize(p5: p5) {
  if (!RESPONSIVE_CANVAS) return () => {};
  return () => {
    const { canvasWidth, canvasHeight } = updateCanvasDimensions(p5);
    const c = p5.createCanvas(canvasWidth, canvasHeight);

    const x = (p5.windowWidth - canvasWidth) / 2;
    const y = (p5.windowHeight - canvasHeight) / 2;
    c.position(x, y);

    p5.pixelDensity(window.devicePixelRatio);
  };
}
