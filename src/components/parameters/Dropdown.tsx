import { useState } from "react";

import GRAPH_ICON from "@assets/icons/graph.svg";
import { IconButton } from "../Buttons";
import { If } from "../UIKit";

export function Dropdown<T extends string>({
  current,
  options,
  onClick,
}: {
  current: T;
  options: T[];
  onClick: (v: T) => void;
}) {
  const [isOpen, setOpen] = useState<boolean>(false);

  function onSelect(v: T) {
    onClick(v);
    setOpen(false);
  }
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
            <button className="Link-button" key={t} onClick={() => onSelect(t)}>
              {t}
            </button>
          ))}
        </div>
      </If>
    </div>
  );
}
