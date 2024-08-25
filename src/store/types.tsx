import { WritableDraft } from "immer";
import p5 from "p5";

export type Xform = {
  position: { x: number; y: number };
  scale: { x: number; y: number };
};

export type SelectBoxManipulator =
  | "T"
  | "R"
  | "B"
  | "L"
  | "TR"
  | "TL"
  | "BR"
  | "BL";

export type SelectBox = Pick<Xform, "position"> & {
  offset: {
    left: number;
    top: number;
  };
};

export type SelectionStore = {
  box: SelectBox;
  collisions: Vec4[];
  DEBUG_collisions: Vec4[];
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

export type ReactlessStore<T> = {
  data: T;
  update: (callback: (args: WritableDraft<T>) => void) => T;
  read: () => T;
};

export type Vec4 = [number, number, number, number];

export type FrameState = {
  hover: number;
  active: number;
  selection: {
    drag: boolean;
    translate: boolean;
    locked: boolean;
    handle: null | SelectBoxManipulator;
  };
  lastSelectedLayer: number;
  lastHoveredLayer: number;
  isDrag: boolean;
  selectionManipulator: null | SelectBoxManipulator;
};

export type ToolsStore = {
  mode: ToolMode;
};

export type ToolsStoreFunc = {
  setMode: (m: ToolMode) => void;
};

export type ToolMode = "TRANSFORM" | "CROP" | "NONE";
