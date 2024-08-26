import p5 from "p5";

export type Xform = {
  position: { x: number; y: number };
  size: { x: number; y: number };
};

export type Sprite = p5.Image;

export type Vec4 = [number, number, number, number];
