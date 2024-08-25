import { hover, image, outline } from "./utils";
import { realtimeStore as rts, useLayersStore } from "../store/layers";

import { DEBUG, NO_ACTIVE_LAYER } from "../constants";
import { realtimeStore as frameStateStore } from "../store/frame";
import { refreshSelection, updateSelectionBox } from "../store/selection";

export function drawLayers() {
  const store = rts.read();
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
      sprites[lay].xform.position.y
    );
  }
}

export function onLayerHover() {
  const layers = useLayersStore.getState().layers;
  const sprites = rts.read().sprites;

  for (let i = 0; i < layers.length; i++) {
    const lay = layers[i];
    if (
      hover(
        sprites[lay].xform.position.x,
        sprites[lay].xform.position.y,
        sprites[lay].width,
        sprites[lay].height
      )
    ) {
      if (DEBUG) {
        const { active } = frameStateStore.read();
        outline(
          sprites[lay].xform.position.x,
          sprites[lay].xform.position.y,
          sprites[lay].width,
          sprites[lay].height,
          1,
          active === lay ? [0, 255, 0] : [0, 0, 255]
        );
      }

      frameStateStore.update((fs) => {
        fs.hover = lay;
      });

      return;
    }
  }
  frameStateStore.update((fs) => {
    fs.hover = NO_ACTIVE_LAYER;
  });
}

export function onLayerClick() {
  const { selection } = frameStateStore.read();
  if (selection.drag) return;

  frameStateStore.update((fs) => {
    fs.active = fs.hover === NO_ACTIVE_LAYER ? NO_ACTIVE_LAYER : fs.hover;

    if (fs.active !== NO_ACTIVE_LAYER) {
      updateSelectionBox(rts.read().sprites[fs.active]);
      refreshSelection();
    }
  });
}
