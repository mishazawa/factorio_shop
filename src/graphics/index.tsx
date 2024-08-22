import p5 from "p5";
import { onWindowResize } from "../components/utils";
import {
  realtimeStore as rts,
  transformImage,
} from "../components/store/images";
import { grid, init, hover, outline } from "./utils";
import { isLeftMouseInteraction, snapToGrid, translate } from "./raycast";

export function setup(p: p5) {
  return () => {
    p.createCanvas(0, 0);
    onWindowResize(p)();
    p.rectMode(p.CORNER);
    init(p); // important call.
  };
}

const NO_LAYER = -1;
const frameState = {
  lastSelectedLayer: NO_LAYER,
};

export function draw(p: p5) {
  return () => {
    const store = rts.read();
    // clear screen
    p.background(250);

    // draw layers
    for (let i = 0; i < store.count; i++) {
      p.image(
        store.images[i],
        store.sprites[i].xform.position.x,
        store.sprites[i].xform.position.y
      );
    }

    // if there is no already selected layer ->
    // then perform ops
    // else ->
    // outline `lastSelectedLayer`
    if (frameState.lastSelectedLayer === NO_LAYER) {
      // perform operations on each sprite
      for (let i = 0; i < store.count; i++) {
        // only one sprite can be hovered at the same time
        // if aabb check passed -> then end of loop
        // todo: layer ordering
        if (
          hover(
            store.sprites[i].xform.position.x,
            store.sprites[i].xform.position.y,
            store.sprites[i].width,
            store.sprites[i].height
          )
        ) {
          outline(
            store.sprites[i].xform.position.x,
            store.sprites[i].xform.position.y,
            store.sprites[i].width,
            store.sprites[i].height
          );
          frameState.lastSelectedLayer = i;
          break;
        }
      }
    } else {
      outline(
        store.sprites[frameState.lastSelectedLayer].xform.position.x,
        store.sprites[frameState.lastSelectedLayer].xform.position.y,
        store.sprites[frameState.lastSelectedLayer].width,
        store.sprites[frameState.lastSelectedLayer].height
      );
    }

    // if mouse button pressed -> then move sprite freely with mouse
    if (isLeftMouseInteraction() && frameState.lastSelectedLayer !== NO_LAYER) {
      transformImage(
        frameState.lastSelectedLayer,
        translate(store.sprites[frameState.lastSelectedLayer].xform)
      );
    }

    // if mouse button released, but layer not updated -> then snap to grid
    // and clean frame state
    if (
      !isLeftMouseInteraction() &&
      frameState.lastSelectedLayer !== NO_LAYER
    ) {
      transformImage(
        frameState.lastSelectedLayer,
        snapToGrid(store.sprites[frameState.lastSelectedLayer].xform)
      );
      frameState.lastSelectedLayer = NO_LAYER;
    }

    grid();
  };
}
