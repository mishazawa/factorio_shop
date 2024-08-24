import p5 from "p5";
import { outline } from "./utils";
import {
  SelectBox,
  SelectBoxManipulator,
  Vec4,
} from "../components/store/types";
import { castAABB, isLeftMouseInteraction } from "./raycast";
import {
  refreshSelection,
  reset,
  realtimeStore as rts,
} from "../components/store/selection/realime";
import { DEBUG, MANIPULATOR_ORDER } from "../constants";
import { realtimeStore as frameStateStore } from "../components/store/frame/realtime";

let _PROC: p5 = null!;

const DEBUG_LINE = 1;
const DEBUG_GREEN: [number, number, number] = [0, 255, 0];

export function initSelection(p: p5) {
  _PROC = p;
  reset();
}

function draw() {
  const { box } = rts.read();
  outline(
    box.position.x,
    box.position.y,
    box.offset.left,
    box.offset.top,
    3,
    [255, 0, 0]
  );
}

export function selection() {
  draw();

  const { isDrag, selectionManipulator } = frameStateStore.read();
  if (isLeftMouseInteraction() && isDrag) {
    if (selectionManipulator) {
      DEBUG_selection(selectionManipulator);
      extendSelection(selectionManipulator);
    } else {
      frameStateStore.update((fs) => {
        fs.isDrag = false;
      });
    }
  }

  if (isLeftMouseInteraction() && !isDrag) {
    frameStateStore.update((fs) => {
      fs.selectionManipulator = getManipulatorIntersection(
        rts.read().collisions
      );
      fs.isDrag = !!fs.selectionManipulator;
    });
  }

  if (!isLeftMouseInteraction() && isDrag) {
    refreshSelection();

    frameStateStore.update((fs) => {
      fs.isDrag = false;
      fs.selectionManipulator = null;
    });
  }
}

function extendSelection(manipulator: SelectBoxManipulator) {
  rts.update(({ box }) => {
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

function DEBUG_selection(manipulator: SelectBoxManipulator) {
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
  ] = rts.read().DEBUG_collisions;

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
): SelectBoxManipulator | null {
  for (let i = 0; i < collisions.length; i++) {
    if (castAABB(...collisions[i]))
      return MANIPULATOR_ORDER[i] as SelectBoxManipulator;
  }

  return null;
}

function resizeTop(box: SelectBox) {
  box.offset.top = box.offset.top + box.position.y - _PROC.mouseY;
  box.position.y = box.position.y - (box.position.y - _PROC.mouseY);
}

function resizeLeft(box: SelectBox) {
  box.offset.left = box.offset.left + box.position.x - _PROC.mouseX;
  box.position.x = box.position.x - (box.position.x - _PROC.mouseX);
}

function resizeRight(box: SelectBox) {
  box.offset.left = _PROC.mouseX - box.position.x;
}

function resizeBottom(box: SelectBox) {
  box.offset.top = _PROC.mouseY - box.position.y;
}
