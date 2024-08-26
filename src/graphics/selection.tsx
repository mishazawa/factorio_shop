import p5 from "p5";
import { outline, resize, snapToGrid, translate } from "./utils";

import { castAABB } from "./raycast";
import { NO_ACTIVE_LAYER, DEBUG, MANIPULATOR_ORDER } from "@app/constants";
import { Vec4 } from "@app/store/common";
import { frameState } from "@app/store/frame";
import { layersState } from "@app/store/layers";
import {
  reset,
  selectionState,
  SelectBox,
  refreshSelection,
  updateSelectionBox,
  SelectBoxHandle,
} from "@app/store/selection";

let _PROC: p5 = null!;

const DEBUG_LINE = 1;
const DEBUG_GREEN: [number, number, number] = [0, 255, 0];

export function initSelection(p: p5) {
  _PROC = p;
  reset();
}

export function drawSelection() {
  if (frameState.read().active === NO_ACTIVE_LAYER) return;
  const { box } = selectionState.read();
  outline(
    box.position.x,
    box.position.y,
    box.size.x,
    box.size.y,
    3,
    [255, 0, 0]
  );
}

export function onSelectionClick() {
  const { active, selection } = frameState.read();
  if (active === NO_ACTIVE_LAYER) return;

  if (!selection.drag) {
    frameState.update((fs) => {
      fs.selection.handle = getManipulatorIntersection(
        selectionState.read().collisions
      );
      fs.selection.drag = !!fs.selection.handle;
      fs.selection.translate = !fs.selection.handle;
    });
  }
}

export function onSelectionPress() {
  const { active, selection } = frameState.read();
  if (active === NO_ACTIVE_LAYER) return;

  if (selection.translate) {
    translateLayer(active);
  }

  if (selection.drag && selection.handle) {
    DEBUG_selection(selection.handle);
    extendSelection(selection.handle);
    // resize sprite
    resizeLayer(active, selectionState.read().box);
  }
}

function translateLayer(layer: number, snap: boolean = false) {
  layersState.update((draft) => {
    draft.sprites[layer].xform = (!snap ? translate : snapToGrid)(
      draft.sprites[layer].xform
    );
  });
}

function resizeLayer(layer: number, selection: SelectBox) {
  layersState.update((draft) => {
    draft.sprites[layer].xform = resize(selection);
  });
}

export function onSelectionRelease() {
  const { selection, active } = frameState.read();

  if (selection.drag) {
    refreshSelection();
    frameState.update((fs) => {
      fs.selection.drag = false;
      fs.selection.handle = null;
    });
  }

  if (active === NO_ACTIVE_LAYER) return;

  if (selection.translate) {
    translateLayer(active, true);
    updateSelectionBox(layersState.read().sprites[active]);
    refreshSelection();
  }
}

function extendSelection(manipulator: SelectBoxHandle) {
  selectionState.update(({ box }) => {
    switch (manipulator) {
      case "T":
        resizeTop(box);
        break;
      case "R":
        resizeRight(box);
        break;
      case "B":
        resizeBottom(box);
        break;
      case "L":
        resizeLeft(box);
        break;
      case "TR":
        resizeTop(box);
        resizeRight(box);
        break;
      case "TL":
        resizeTop(box);
        resizeLeft(box);
        break;
      case "BR":
        resizeBottom(box);
        resizeRight(box);
        break;
      case "BL":
        resizeBottom(box);
        resizeLeft(box);
        break;
    }
  });
}

function DEBUG_selection(manipulator: SelectBoxHandle) {
  if (!DEBUG) return;
  const [
    tl_box,
    tr_box,
    bl_box,
    br_box,
    tl_tr_box,
    tl_bl_box,
    tr_br_box,
    br_bl_box,
  ] = selectionState.read().DEBUG_collisions;

  switch (manipulator) {
    case "T":
      outline(...tl_tr_box, DEBUG_LINE, DEBUG_GREEN);
      break;
    case "R":
      outline(...tr_br_box, DEBUG_LINE, DEBUG_GREEN);
      break;
    case "B":
      outline(...br_bl_box, DEBUG_LINE, DEBUG_GREEN);
      break;
    case "L":
      outline(...tl_bl_box, DEBUG_LINE, DEBUG_GREEN);
      break;
    case "TR":
      outline(...tr_box, DEBUG_LINE, DEBUG_GREEN);
      break;
    case "TL":
      outline(...tl_box, DEBUG_LINE, DEBUG_GREEN);
      break;
    case "BR":
      outline(...br_box, DEBUG_LINE, DEBUG_GREEN);
      break;
    case "BL":
      outline(...bl_box, DEBUG_LINE, DEBUG_GREEN);
      break;
  }
}

function getManipulatorIntersection(
  collisions: Vec4[]
): SelectBoxHandle | null {
  for (let i = 0; i < collisions.length; i++) {
    if (castAABB(...collisions[i]))
      return MANIPULATOR_ORDER[i] as SelectBoxHandle;
  }

  return null;
}

function resizeTop(box: SelectBox) {
  box.size.y = box.size.y + box.position.y - _PROC.mouseY;
  box.position.y = box.position.y - (box.position.y - _PROC.mouseY);
}

function resizeLeft(box: SelectBox) {
  box.size.x = box.size.x + box.position.x - _PROC.mouseX;
  box.position.x = box.position.x - (box.position.x - _PROC.mouseX);
}

function resizeRight(box: SelectBox) {
  box.size.x = _PROC.mouseX - box.position.x;
}

function resizeBottom(box: SelectBox) {
  box.size.y = _PROC.mouseY - box.position.y;
}
