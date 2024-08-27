import p5 from "p5";
import { outline, snapToGrid, translate } from "./utils";

import { checkAABB } from "./raycast";
import { NO_ACTIVE_LAYER, DEBUG } from "@app/constants";
import { BBox, Vec4, Xform } from "@store/common";
import { frameState } from "@store/frame";
import { applyTransform, copyXform } from "@store/layers";
import {
  selectionState,
  SelectBoxHandle,
  updateSelectionBBox,
} from "@store/selection";
import { values } from "lodash";

let _PROC: p5 = null!;

const DEBUG_LINE = 1;
const DEBUG_GREEN: [number, number, number] = [0, 255, 0];

export function initSelection(p: p5) {
  _PROC = p;
}

export function drawSelection() {
  if (frameState.read().active === NO_ACTIVE_LAYER) return;

  DEBUG_selection();

  const { xform } = selectionState.read();
  outline(
    xform.position.x,
    xform.position.y,
    xform.size.x,
    xform.size.y,
    3,
    [255, 0, 0]
  );
}

export function onSelectionClick(): boolean {
  let result = false;
  const { active, selection } = frameState.read();
  if (active === NO_ACTIVE_LAYER) return result;

  if (!selection.drag) {
    frameState.update((fs) => {
      fs.selection.handle = getManipulatorIntersection(
        selectionState.read().collisions
      );

      fs.selection.drag = !!fs.selection.handle && fs.selection.handle !== "C";
      fs.selection.translate = fs.selection.handle === "C";

      result = fs.selection.drag || fs.selection.translate;
    });
  }

  return result;
}

export function onSelectionPress() {
  const { active, selection } = frameState.read();
  if (active === NO_ACTIVE_LAYER) return;

  if (selection.translate) {
    const { xform } = selectionState.read();
    translateSelection();
    copyXform(active, xform);
  }

  if (selection.drag && selection.handle) {
    const { xform } = selectionState.read();

    extendSelection(selection.handle);
    copyXform(active, xform);
  }
}

export function onSelectionRelease() {
  const { selection, active } = frameState.read();
  if (active === NO_ACTIVE_LAYER) return;

  if (selection.drag) {
    updateSelectionBBox();

    const { xform, bbox } = selectionState.read();

    applyTransform(active, xform, bbox);

    frameState.update((fs) => {
      fs.selection.drag = false;
      fs.selection.handle = null;
    });
  }

  if (selection.translate) {
    const { xform, bbox } = selectionState.read();
    translateSelection(true);
    updateSelectionBBox();
    applyTransform(active, xform, bbox);
  }
}

function translateSelection(snap: boolean = false) {
  selectionState.update((draft) => {
    draft.xform = (!snap ? translate : snapToGrid)(draft.xform);
  });
}

function extendSelection(manipulator: SelectBoxHandle) {
  selectionState.update(({ xform }) => {
    switch (manipulator) {
      case "T":
        resizeTop(xform);
        break;
      case "R":
        resizeRight(xform);
        break;
      case "B":
        resizeBottom(xform);
        break;
      case "L":
        resizeLeft(xform);
        break;
      case "TR":
        resizeTop(xform);
        resizeRight(xform);
        break;
      case "TL":
        resizeTop(xform);
        resizeLeft(xform);
        break;
      case "BR":
        resizeBottom(xform);
        resizeRight(xform);
        break;
      case "BL":
        resizeBottom(xform);
        resizeLeft(xform);
        break;
    }
  });
}

function DEBUG_selection() {
  if (!DEBUG) return;
  values(selectionState.read().collisions).map(({ ax, ay, bx, by }) =>
    outline(...([ax, ay, bx - ax, by - ay] as Vec4), DEBUG_LINE, DEBUG_GREEN)
  );
}

function getManipulatorIntersection(
  bounds: Record<SelectBoxHandle, BBox>
): SelectBoxHandle | null {
  for (const handle in bounds) {
    if (checkAABB(bounds[handle as SelectBoxHandle]))
      return handle as SelectBoxHandle;
  }
  return null;
}

function resizeTop(box: Xform) {
  box.size.y = box.size.y + box.position.y - _PROC.mouseY;
  box.position.y = box.position.y - (box.position.y - _PROC.mouseY);
}

function resizeLeft(box: Xform) {
  box.size.x = box.size.x + box.position.x - _PROC.mouseX;
  box.position.x = box.position.x - (box.position.x - _PROC.mouseX);
}

function resizeRight(box: Xform) {
  box.size.x = _PROC.mouseX - box.position.x;
}

function resizeBottom(box: Xform) {
  box.size.y = _PROC.mouseY - box.position.y;
}
