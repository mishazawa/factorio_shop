import {
  assignOnlyPositiveValue,
  outline,
  snapToGrid,
  toWorldSpace,
  translate,
} from "./utils";

import { NO_ACTIVE_LAYER, DEBUG } from "@app/constants";
import { BBox, Vec4, Xform } from "@store/common";
import { frameState } from "@store/frame";
import { applyTransform, copyXform } from "@store/layers";
import {
  selectionState,
  SelectBoxHandle,
  updateSelectionBBox,
} from "@store/selection";

import { flow, partial, values } from "lodash/fp";
import { aabb, getMouse } from "./renderer";

const DEBUG_LINE = 1;
const DEBUG_GREEN: [number, number, number] = [0, 255, 0];

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

  if (!selection.resize) {
    frameState.update((fs) => {
      fs.selection.handle = getManipulatorIntersection(
        selectionState.read().collisions
      );

      fs.selection.resize =
        !!fs.selection.handle && fs.selection.handle !== "C";
      fs.selection.translate = fs.selection.handle === "C";

      result = fs.selection.resize || fs.selection.translate;
    });
  }

  return result;
}

export function cropImage() {
  const { active } = frameState.read();
  // const { xform } = selectionState.read();
  if (active === NO_ACTIVE_LAYER) return;
}

export function onCropPress() {
  const { active, selection } = frameState.read();
  if (active === NO_ACTIVE_LAYER) return;
  if (selection.translate) {
    translateSelection();
  }

  if (selection.resize && selection.handle) {
    extendSelection(selection.handle);
  }
}

export function onCropRelease() {
  const { selection, active } = frameState.read();
  if (active === NO_ACTIVE_LAYER) return;

  if (selection.resize || selection.translate) {
    updateSelectionBBox();
  }

  frameState.update((fs) => {
    fs.selection.resize = false;
    fs.selection.handle = null;
  });
}

export function onSelectionPress() {
  const { active, selection } = frameState.read();
  if (active === NO_ACTIVE_LAYER) return;

  if (selection.translate) {
    const _ = flow(
      translateSelection,
      () => selectionState.read().xform,
      partial(copyXform, [active])
    )(false);
  }

  if (selection.resize && selection.handle) {
    const _ = flow(
      extendSelection,
      () => selectionState.read().xform,
      partial(copyXform, [active])
    )(selection.handle!);
  }
}

export function onSelectionRelease() {
  const { selection, active } = frameState.read();
  if (active === NO_ACTIVE_LAYER) return;

  if (selection.resize) {
    const _ = flow(
      updateSelectionBBox, //
      () => selectionState.read(),
      ({ xform, bbox }) => applyTransform(active, xform, bbox)
    )();
  }

  if (selection.translate) {
    const _ = flow(
      translateSelection,
      updateSelectionBBox,
      () => selectionState.read(),
      ({ xform, bbox }) => applyTransform(active, xform, bbox)
    )(true);
  }

  frameState.update((fs) => {
    fs.selection.resize = false;
    fs.selection.handle = null;
  });
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
    if (aabb(bounds[handle as SelectBoxHandle]))
      return handle as SelectBoxHandle;
  }
  return null;
}

function resizeTop(box: Xform) {
  const { y } = toWorldSpace(getMouse());

  assignOnlyPositiveValue(box.size.y + box.position.y - y, (result) => {
    box.size.y = result;
    box.position.y = box.position.y - (box.position.y - y);
  });
}

function resizeLeft(box: Xform) {
  const { x } = toWorldSpace(getMouse());

  assignOnlyPositiveValue(box.size.x + box.position.x - x, (result) => {
    box.size.x = result;
    box.position.x = box.position.x - (box.position.x - x);
  });
}

function resizeRight(box: Xform) {
  const { x } = toWorldSpace(getMouse());
  assignOnlyPositiveValue(x - box.position.x, (result) => {
    box.size.x = result;
  });
}

function resizeBottom(box: Xform) {
  const { y } = toWorldSpace(getMouse());
  assignOnlyPositiveValue(y - box.position.y, (result) => {
    box.size.y = result;
  });
}
