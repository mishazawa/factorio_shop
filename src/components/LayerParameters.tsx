import { useFactorioApi } from "@store/api";
import { IconButton } from "./Buttons";
import EYE_SLASH from "@assets/icons/eye-slash.svg";
import { openLayerPanel, useToolsStore } from "@store/tools";

import { Parameters } from "./parameters";
import { Dropdown } from "./parameters/Dropdown";

export function LayerParameters() {
  const types = useFactorioApi((s) => s.editorTypes);
  const current = useFactorioApi((s) => s.current);
  const setCurrentType = useFactorioApi((s) => s.setCurrentType);
  const isPanelOpen = useToolsStore((s) => s.isLayerPanelOpened);

  return (
    <div
      className={`Right-side bordered-dark-sides inset-shadow ${
        isPanelOpen ? "open" : "closed"
      }`}
    >
      <div className="Layer-props scrollbar">
        <div className="lp-padding gap ">
          <div className="d-flex between">
            <h1>Layer properties</h1>
            <IconButton
              icon={EYE_SLASH}
              tooltip="close"
              className="Danger-button"
              onClick={() => openLayerPanel(false)}
            />
          </div>
          <div>
            <span>Type</span>
            <Dropdown
              current={current}
              options={types.map((v) => v.name)}
              onClick={setCurrentType}
            />
          </div>
          <Parameters current={current} options={types} />
        </div>
      </div>
    </div>
  );
}
