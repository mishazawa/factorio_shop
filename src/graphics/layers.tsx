import { DEBUG, NO_ACTIVE_LAYER } from "@app/constants";
import { frameState, resetFrame } from "@store/frame";
import { layersState, useLayersStore } from "@store/layers";

import { image, outline } from "./utils";
import { checkAABB } from "./raycast";
import { createSelection } from "@store/selection";

export function drawLayers() {
  const store = layersState.read();
  const layers = useLayersStore.getState().layers;

  const sprites = store.sprites;
  const images = store.images;
  // draw layers in reverse order
  // lower indices on top of higher indices
  for (let i = layers.length - 1; i >= 0; i--) {
    const lay = layers[i];

    image(
      images[lay],
      sprites[lay].xform.position.x,
      sprites[lay].xform.position.y,
      sprites[lay].xform.size.x,
      sprites[lay].xform.size.y,
      sprites[lay].crop.position.x,
      sprites[lay].crop.position.y,
      sprites[lay].crop.size.x,
      sprites[lay].crop.size.y
    );
  }
}

export function onLayerHover() {
  const layers = useLayersStore.getState().layers;
  const sprites = layersState.read().sprites;

  for (let i = 0; i < layers.length; i++) {
    const lay = layers[i];
    if (checkAABB(sprites[lay].bbox)) {
      if (DEBUG) {
        const { active } = frameState.read();

        outline(
          sprites[lay].xform.position.x,
          sprites[lay].xform.position.y,
          sprites[lay].xform.size.x,
          sprites[lay].xform.size.y,
          1,
          active === lay ? [0, 255, 0] : [0, 0, 255]
        );
      }

      frameState.update((fs) => {
        fs.hover = lay;
      });

      return;
    }
  }
  frameState.update((fs) => {
    fs.hover = NO_ACTIVE_LAYER;
  });
}

export function onLayerClick() {
  frameState.update((fs) => {
    fs.active = fs.hover === NO_ACTIVE_LAYER ? NO_ACTIVE_LAYER : fs.hover;
    if (fs.active === NO_ACTIVE_LAYER) {
      resetFrame();
      return fs;
    }
    createSelection(layersState.read().sprites[fs.active]);
  });

  return false;
}

export function onLayerPress() {}
