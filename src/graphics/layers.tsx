import p5 from "p5";
import { SpriteObject } from "../components/store/types";
import { hover, image, outline, snapToGrid, translate } from "./utils";
import {
  realtimeStore as rts,
  transformImage,
} from "../components/store/layers/realtime";
import { useLayersStore } from "../components/store/layers/reactive";
import { isLeftMouseInteraction } from "./raycast";
import { NO_ACTIVE_LAYER } from "../constants";
import { realtimeStore as frameStateStore } from "../components/store/frame/realtime";

export function layers() {
  const store = rts.read();
  const layers = useLayersStore.getState().layers;

  const sprites = store.sprites;
  const images = store.images;

  draw(layers, sprites, images);
  interaction(layers, sprites);
  postProcessing(sprites);
}

function draw(layers: number[], sprites: SpriteObject[], images: p5.Image[]) {
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

function interaction(layers: number[], sprites: SpriteObject[]) {
  const { lastSelectedLayer } = frameStateStore.read();
  // if there is already selected layer ->
  // outline `lastSelectedLayer`
  if (lastSelectedLayer !== NO_ACTIVE_LAYER) {
    outline(
      sprites[lastSelectedLayer].xform.position.x,
      sprites[lastSelectedLayer].xform.position.y,
      sprites[lastSelectedLayer].width,
      sprites[lastSelectedLayer].height
    );
    return;
  }

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

      frameStateStore.update((fs) => {
        fs.lastSelectedLayer = lay;
      });

      break;
    }
  }
}

function postProcessing(sprites: SpriteObject[]) {
  const { lastSelectedLayer } = frameStateStore.read();

  if (isLeftMouseInteraction() && lastSelectedLayer !== NO_ACTIVE_LAYER) {
    transformImage(
      lastSelectedLayer,
      translate(sprites[lastSelectedLayer].xform)
    );
  }

  // if mouse button released, but layer not updated -> then snap to grid
  // and clean frame state
  if (!isLeftMouseInteraction() && lastSelectedLayer !== NO_ACTIVE_LAYER) {
    transformImage(
      lastSelectedLayer,
      snapToGrid(sprites[lastSelectedLayer].xform)
    );

    frameStateStore.update((fs) => {
      fs.lastSelectedLayer = NO_ACTIVE_LAYER;
    });
  }
}
