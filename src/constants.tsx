export const DEBUG = !!process.env.REACT_APP_DEBUG;
export const RESPONSIVE_CANVAS = true;
export const TILE_DIMENSIONS = 32;
export const BACKGROUND_COLOR = 250;
export const GRID_COLOR: [number, number, number] = [188, 188, 188];
export const GRID_WIDTH = 1;
export const OUTLINE_WIDTH = 2;
export const OUTLINE_COLOR: [number, number, number] = [255, 204, 0];
export const COLLISION_WIDTH_HALF = 10;
export const NO_ACTIVE_LAYER = -1;
export const TRANSFORM = "TRANSFORM";
export const CROP = "CROP";
export const KBD_ENTER = 13;

export const UINT8 = {
  int: true,
  min: 0,
  max: 255,
};

export const INT16 = {
  int: true,
  min: -32768,
  max: 32767,
};

export const WHITELIST_TYPES = [
  "SpriteParameters",
  "AnimationParameters",
  "Animation",
  "AnimationSheet",
  "RotatedAnimation",
  "RotatedSprite",
  "Sprite",
  "SpriteNWaySheet",
  "SpriteSheet",
];
