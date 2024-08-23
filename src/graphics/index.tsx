import p5 from "p5";
import { onWindowResize } from "../components/utils";
import {
  realtimeStore as rts,
  transformImage,
} from "../components/store/layers/realtime";
import { useLayersStore } from "../components/store/layers/reactive";
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
    const layers = useLayersStore.getState().layers;

    const sprites = store.sprites;
    const images = store.images;
    // clear screen
    p.background(250);

    // draw layers in reverse order
    // lower indices on top of higher indices
    for (let i = layers.length - 1; i >= 0; i--) {
      const lay = layers[i];

      p.image(
        images[lay],
        sprites[lay].xform.position.x,
        sprites[lay].xform.position.y
      );
    }

    // if there is no already selected layer ->
    // then perform ops
    // else ->
    // outline `lastSelectedLayer`
    if (frameState.lastSelectedLayer === NO_LAYER) {
      // perform operations on each sprite
      // cast rays from top to bottom
      for (let i = 0; i < layers.length; i++) {
        const lay = layers[i];

        // only one sprite can be hovered at the same time
        // if aabb check passed -> then end of loop
        // todo: layer ordering
        if (
          hover(
            sprites[lay].xform.position.x,
            sprites[lay].xform.position.y,
            sprites[lay].width,
            sprites[lay].height
          )
        ) {
          outline(
            sprites[lay].xform.position.x,
            sprites[lay].xform.position.y,
            sprites[lay].width,
            sprites[lay].height
          );

          frameState.lastSelectedLayer = lay;
          break;
        }
      }
    } else {
      outline(
        sprites[frameState.lastSelectedLayer].xform.position.x,
        sprites[frameState.lastSelectedLayer].xform.position.y,
        sprites[frameState.lastSelectedLayer].width,
        sprites[frameState.lastSelectedLayer].height
      );
    }

    // if mouse button pressed -> then move sprite freely with mouse
    if (isLeftMouseInteraction() && frameState.lastSelectedLayer !== NO_LAYER) {
      transformImage(
        frameState.lastSelectedLayer,
        translate(sprites[frameState.lastSelectedLayer].xform)
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
        snapToGrid(sprites[frameState.lastSelectedLayer].xform)
      );

      frameState.lastSelectedLayer = NO_LAYER;
    }

    grid();
  };
}
