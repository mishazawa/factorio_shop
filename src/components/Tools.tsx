import { IconButton } from "./Buttons";

import { setMode, useToolsStore } from "@store/tools";
import MOVE_TOOL_ICON from "@assets/icons/translate.svg";
import CROP_TOOL_ICON from "@assets/icons/crop.svg";
import { LayerList } from "./LayerList";

export function Tools() {
  const activeMode = useToolsStore((s) => s.mode);
  return (
    <div className="Props-wrapper bordered-dark-convex">
      <div className="Tools-wrapper">
        <IconButton
          icon={MOVE_TOOL_ICON}
          tooltip="transform"
          onClick={() => setMode("TRANSFORM")}
          className={`${activeMode === "TRANSFORM" ? "activeTool" : ""}`}
        />
        <IconButton
          icon={CROP_TOOL_ICON}
          tooltip="crop"
          onClick={() => setMode("CROP")}
          className={`${activeMode === "CROP" ? "activeTool" : ""}`}
        />
      </div>
      <LayerList />
    </div>
  );
}
