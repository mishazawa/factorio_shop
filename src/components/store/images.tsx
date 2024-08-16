import p5 from "p5";
// import { create } from "zustand";
import { createReactlessStore } from ".";

type Sprite = p5.Image;
type SpriteObject = {
  locked: boolean;
  filename: string;
  width: number;
  height: number;
  xform: {
    position: { x: number; y: number };
    scale: { x: number; y: number };
  };
};

type ImagesStore = {
  count: number;
  images: Sprite[];
  sprites: SpriteObject[];
};

// type ImagesStoreUi = {};

export const realtimeStore = createReactlessStore<ImagesStore>({
  images: [],
  sprites: [],
  count: 0,
});

// export const reactiveStore = create();

export const addImage = (
  value: Sprite,
  metadata: File,
  dom: HTMLImageElement
) => {
  realtimeStore.update((draft) => {
    draft.images.push(value);
    draft.sprites.push(createBlankSprite(metadata, dom));
    draft.count++;
  });
};

export const removeImage = (index: number) => {};

function createBlankSprite(
  metadata: File,
  dom: HTMLImageElement
): SpriteObject {
  return {
    locked: false,
    filename: metadata.name,
    width: dom.width,
    height: dom.height,
    xform: {
      position: { x: 0, y: 0 },
      scale: { x: 1, y: 1 },
    },
  };
}
