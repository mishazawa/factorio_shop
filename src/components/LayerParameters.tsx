import { useFactorioApi } from "@store/api";
import { openLayerPanel, useToolsStore } from "@store/tools";

import HIDE_ICON from "@assets/icons/chevron-r.svg";

import { IconButton } from "./Buttons";
import { Parameters } from "./parameters";
import { Dropdown } from "./parameters/Dropdown";

export function LayerParameters() {
  const types = useFactorioApi((s) => s.editorTypes);
  const apiTypes = useFactorioApi((s) => s.api?.types!);
  const layerIndex = useFactorioApi((s) => s.activeLayerId);
  const setLayerType = useFactorioApi((s) => s.setLayerType);

  const layerParams = useFactorioApi((s) => s.layers[layerIndex]);
  const isPanelOpen = useToolsStore((s) => s.isLayerPanelOpened);

  return (
    layerParams && (
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
                icon={HIDE_ICON}
                tooltip="close"
                className="Danger-button"
                onClick={() => openLayerPanel(false)}
              />
            </div>
            <div>
              <span>Type</span>
              <Dropdown
                current={layerParams.type}
                options={types.map((v) => v.name)}
                onClick={setLayerType}
              />
            </div>
            <Parameters current={layerParams.type} options={apiTypes} />
          </div>
        </div>
      </div>
    )
  );
}
