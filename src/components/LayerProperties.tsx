import { Concept, useFactorioApi } from "@store/api";
import { IconButton } from "./Buttons";
import GRAPH_ICON from "@assets/icons/graph.svg";
import LEFT_CHEVRON from "@assets/icons/chevron-l.svg";
import { filter, head } from "lodash";
import { openLayerPanel } from "@store/tools";

export function LayerProperties() {
  const types = useFactorioApi((s) => s.api?.types || []);
  const current = useFactorioApi((s) => s.current);
  const setCurrentType = useFactorioApi((s) => s.setCurrentType);

  return (
    <div className="Layer-props scrollbar">
      <div className="lp-padding gap ">
        <div className="d-flex between">
          <h1>Layer properties</h1>
          <IconButton
            icon={LEFT_CHEVRON}
            tooltip="close"
            className="Danger-button"
            onClick={() => openLayerPanel(false)}
          />
        </div>
        <div>
          <span>Type</span>
          <Dropdown
            current={current}
            options={types}
            onClick={setCurrentType}
          />
        </div>
        <PropertiesList current={current} options={types} />
      </div>
    </div>
  );
}

type DropdownOption = Record<"name" | string, string | never> | Concept;

function Dropdown({
  current,
  options,
  onClick,
}: {
  current: string;
  options: DropdownOption[];
  onClick: (v: string) => void;
}) {
  return (
    <div className="dropdown">
      <div className="drop-button">
        <span className="title bordered-dark-concave">{current}</span>
        <IconButton className="btn" icon={GRAPH_ICON} tooltip="select type" />
      </div>
      <div className="dropdown-content bordered-dark-concave">
        {options.map((t) => (
          <button
            className="Link-button"
            key={t.name}
            onClick={() => onClick(t.name)}
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function PropertiesList({
  current,
  options,
}: {
  current: string;
  options: Concept[];
}) {
  const selected = head(filter(options, (n) => n.name === current));

  if (!selected) return null;

  return (
    <>
      {selected.properties?.map((prop) => {
        return (
          <div key={prop.name}>
            <span>{prop.name}</span>
            <div>stuff</div>
          </div>
        );
      })}
    </>
  );
}
