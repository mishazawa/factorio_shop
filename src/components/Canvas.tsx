import p5 from "p5";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { draw } from "@app/graphics";
import { init as setup } from "@app/graphics/renderer";
function sketch(p5: p5) {
  p5.setup = () => setup(p5);
  p5.draw = draw(p5);
}

export function Canvas() {
  return (
    <div className="Canvas-wrapper">
      <ReactP5Wrapper sketch={sketch} />
    </div>
  );
}
