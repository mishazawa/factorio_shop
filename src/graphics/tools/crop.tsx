import { partial } from "lodash/fp";
import { comply } from ".";
import { onCropPress, onCropRelease, onSelectionClick } from "../selection";
import { REGION_TRANSFORM } from "@app/constants";
import { sequence, withMode } from "../utils";
import { onLayerClick } from "../layers";

// todo rename file
const mode = partial(withMode, [REGION_TRANSFORM]);

// copypaste from transform
function click() {
  sequence(onSelectionClick, onLayerClick);
}

function move() {
  onCropPress();
}

function release() {
  onCropRelease();
}

export default comply({
  mode,
  click: () => mode(click),
  move: () => mode(move),
  release: () => mode(release),
});
