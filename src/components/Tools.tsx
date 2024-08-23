import { IconButton } from "./Buttons";

import MOVE_TOOL_ICON from "../assets/icons/translate.svg";
import RESIZE_TOOL_ICON from "../assets/icons/resize.svg";
import CROP_TOOL_ICON from "../assets/icons/crop.svg";
import { LayerList } from "./LayerList";

export function Tools() {
  return (
    <div className="Props-wrapper bordered-dark-convex">
      <div className="Tools-wrapper">
        <IconButton icon={MOVE_TOOL_ICON} tooltip="translate" />
        <IconButton icon={RESIZE_TOOL_ICON} tooltip="resize" />
        <IconButton icon={CROP_TOOL_ICON} tooltip="crop" />
      </div>
      <LayerList />
    </div>
  );
}
