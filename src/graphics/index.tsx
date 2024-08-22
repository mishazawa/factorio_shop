import p5 from "p5";
import { onWindowResize } from "../components/utils";
import { realtimeStore as rts } from "../components/store/images";
import { grid, init, hoverOutline } from "./utils";

export function setup(p: p5) {
  return () => {
    p.createCanvas(0, 0);
    onWindowResize(p)();
    p.rectMode(p.CORNER);
    init(p); // important call.
  };
}

export function draw(p: p5) {
  return () => {
    const store = rts.read();
    p.background(250);

    for (let i = 0; i < store.count; i++) {
      p.image(
        store.images[i],
        store.sprites[i].xform.position.x,
        store.sprites[i].xform.position.y
      );
    }

    for (let i = 0; i < store.count; i++) {
      if (
        hoverOutline(
          store.sprites[i].xform.position.x,
          store.sprites[i].xform.position.y,
          store.sprites[i].width,
          store.sprites[i].height
        )
      ) {
        break;
      }
    }

    grid();
  };
}
