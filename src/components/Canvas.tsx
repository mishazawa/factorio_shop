import p5 from "p5";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { draw, setup } from "@app/graphics";
import { onWindowResize } from "@app/utils";

function sketch(p5: p5) {
  p5.setup = setup(p5);
  p5.draw = draw(p5);
  p5.windowResized = onWindowResize(p5);
}

export function Canvas() {
  return (
    <div className="Canvas-wrapper">
      <ReactP5Wrapper sketch={sketch} />
    </div>
  );
}
