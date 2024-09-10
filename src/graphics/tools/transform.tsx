import { partial } from "lodash/fp";
import { sequence, withMode } from "../utils";
import { TRANSFORM } from "@app/constants";
import { onLayerClick, onLayerPress } from "../layers";
import {
  onSelectionClick,
  onSelectionPress,
  onSelectionRelease,
} from "../selection";
import { comply } from ".";

const mode = partial(withMode, [TRANSFORM]);

// if selection was clicked do not perform layer ops
// kind of event propagation
// todo: maybe join layers and selection
// because selection in kind of special case of layer
function click() {
  sequence(onSelectionClick, onLayerClick);
}

function release() {
  onSelectionRelease();
}

function move() {
  onSelectionPress();
  onLayerPress();
}

export default comply({
  mode,
  click: () => mode(click),
  release: () => mode(release),
  move: () => mode(move),
});
