import {
  ComplexType,
  Concept,
  FLiteral,
  FTuple,
  FUnion,
  Property,
  useFactorioApi,
} from "@store/api";
import { IconButton } from "./Buttons";
import GRAPH_ICON from "@assets/icons/graph.svg";
import LEFT_CHEVRON from "@assets/icons/chevron-l.svg";
import { filter, head, isString, noop, reverse } from "lodash";
import { openLayerPanel } from "@store/tools";
import { useState } from "react";
import { If } from "./UIKit";

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

type DropdownOption =
  | Record<"name" | string | number | "true" | "false", string | never>
  | Concept;

function Dropdown({
  current,
  options,
  onClick,
}: {
  current: string;
  options: DropdownOption[];
  onClick: (v: string) => void;
}) {
  const [isOpen, setOpen] = useState<boolean>(false);
  return (
    <div className="dropdown">
      <div className="drop-button" onClick={() => setOpen(!isOpen)}>
        <span className="title bordered-dark-concave">{current}</span>
        <IconButton
          className={`btn ${isOpen ? "openDropDown" : ""}`}
          icon={GRAPH_ICON}
          tooltip="select type"
        />
      </div>
      <If v={isOpen}>
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
      </If>
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
  const parents = reverse(getParentsRecursive(options, selected.parent));

  return (
    <>
      {parents.map((p, i) => (
        <PropertyList key={i} properties={p} />
      ))}
      <PropertyList properties={selected.properties} />
    </>
  );
}

function PropertyList({ properties = [] }: { properties?: Property[] }) {
  return (
    <>
      {properties.map((prop) => (
        <PropertyDescription
          key={prop.name}
          prop={prop}
          ignore={["layers", "stripes"]}
        />
      ))}
    </>
  );
}

function PropertyDescription({
  prop,
  ignore = [],
}: {
  prop: Property;
  ignore: string[];
}) {
  return (
    <If v={!ignore.includes(prop.name)}>
      <div>
        <div>
          {prop.name} {prop.optional ? "?" : ""}
        </div>
        <PropertySettings prop={prop} />
      </div>
    </If>
  );
}

function PropertySettings({ prop }: { prop: Property }) {
  if (isString(prop.type)) {
    return processSimpleType(prop);
  }
  return processComplexType(prop.type);
}

function getParentsRecursive(
  concepts: Concept[],
  parent: string
): Property[][] {
  const v = head(filter(concepts, (n) => n.name === parent));

  if (!v || !v.properties) return [];
  if (!v.parent) return [v.properties];
  return [v.properties, ...getParentsRecursive(concepts, v.parent)];
}

// to do get types from api json
function processSimpleType(prop: Property) {
  if (prop.type === "bool") {
    return <input type="checkbox" />;
  }
  if (prop.type === "FileName") {
    return <input />;
  }

  if (prop.type === "SpriteSizeType") {
    return <input type="number" />;
  }

  if (prop.type === "uint8") {
    return <input type="number" />;
  }
  if (prop.type === "double") {
    return <input type="number" />;
  }

  if (prop.type === "SpritePriority") {
    return (
      <Dropdown
        options={[
          "extra-high-no-scale",
          "extra-high",
          "high",
          "medium",
          "low",
          "very-low",
          "no-atlas",
        ].map((name) => ({ name }))}
        current="medium"
        onClick={noop}
      />
    );
  }

  return null;
}

function processComplexType(propType: ComplexType) {
  switch (propType.complex_type) {
    case "tuple":
      return (
        <div className="joined-tuple">
          {(propType as FTuple).values.map((v) => (
            <PropertySettings prop={{ type: v } as Property} />
          ))}
        </div>
      );
    case "union":
      return (
        <>
          <Union {...propType} />
        </>
      );
    case "struct":
    case "type":
    case "array":
    case "dictionary":
  }
  return <>111{JSON.stringify(propType)}</>;
}

function Union({ options }: FUnion) {
  if (!options.length) return null;

  if ((options[0] as ComplexType).complex_type === "literal") {
    return (
      <Dropdown
        options={
          (options as FLiteral[]).map(({ value }) => ({
            name: value,
          })) as Record<"name", any>[]
        }
        current=""
        onClick={noop}
      />
    );
  }

  return (
    <div className="union">
      {options.map((v) => (
        <PropertySettings prop={{ type: v } as Property} />
      ))}
    </div>
  );
}
