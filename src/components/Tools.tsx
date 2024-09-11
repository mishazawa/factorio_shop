import { IconButton } from "./Buttons";

import { setMode, useToolsStore } from "@store/tools";
import MOVE_TOOL_ICON from "@assets/icons/translate.svg";
import CROP_TOOL_ICON from "@assets/icons/crop.svg";
import { LayerList } from "./LayerList";
import { Region } from "./parameters/Region";

export function Tools() {
  const activeMode = useToolsStore((s) => s.mode);

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
        <div className="Region-params-wrapper d-flex col align-start">
          <h1>Region properties</h1>
          <div className="parameters d-flex bordered-dark-concave align-start">
            <Region />
          </div>
        </div>
        <div className="Layers-wrapper">
          <h1>Layers</h1>
          <LayerList />
        </div>
      </div>
    </div>
  );
}
