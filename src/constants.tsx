export const DEBUG = !!process.env.REACT_APP_DEBUG;
export const RESPONSIVE_CANVAS = true;
export const CANVAS_SIZE_MAX = 8192; // lag too much
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
export const REGION_TRANSFORM = "REGION_TRANSFORM";
export const KBD_ENTER = 13;
export const ZOOM_MIN_MAX_ABS: [number, number] = [0.1, 10]; // scaled values
export const ZOOM_DIRECTION = -1;
export const ZOOM_SENSITIVITY = 0.1 * ZOOM_DIRECTION;
export const ZOOM_HIDE_GRID = 8;
export const PIXEL_DENSITY = 1;

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

export const DEFAULT_LAYER_TYPE = "Sprite";

export const WHITELIST_TYPES = [
  "Sprite",
  "RotatedSprite",
  "SpriteSheet",
  "Animation",
  "RotatedAnimation",
  "AnimationSheet",
];

export const LUA_PLACEHOLDER_FILENAME = "<path to %%%>";

export const IGNORED_PARAMETERS = [
  "layers",
  "stripes",
  "hr_version",
  "filename",
  "filenames",
];
