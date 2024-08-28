import { IconButton } from "./Buttons";

import { setMode, useToolsStore } from "@store/tools";
import MOVE_TOOL_ICON from "@assets/icons/translate.svg";
import CROP_TOOL_ICON from "@assets/icons/crop.svg";
import { LayerList } from "./LayerList";
import { LayerProperties } from "./LayerProperties";

export function Tools() {
  const activeMode = useToolsStore((s) => s.mode);
  const isPanelOpen = useToolsStore((s) => s.isLayerPanelOpened);

  return (
    <div className="Props-wrapper bordered-dark-convex">
      <div className="Left-side">
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
        <div className="Layers-wrapper">
          <h1>Layers</h1>
          <LayerList />
        </div>
      </div>
      <div
        className={`Right-side bordered-dark-sides inset-shadow ${
          isPanelOpen ? "open" : "closed"
        }`}
      >
        <LayerProperties />
      </div>
    </div>
  );
}
