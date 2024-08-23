import p5 from "p5";

export type Xform = {
  position: { x: number; y: number };
  scale: { x: number; y: number };
};

export type Sprite = p5.Image;
export type SpriteObject = {
  locked: boolean;
  filename: string;
  width: number;
  height: number;
  xform: Xform;
};

export type ImagesStore = {
  images: Sprite[];
  sprites: SpriteObject[];
};

export type LayersReactiveStoreData = {
  layers: number[];
};

export type LayersReactiveStoreFunc = {
  add: (value: number) => void;
  reorder: (value: number[]) => void;
  remove: (value: number) => void;
};
