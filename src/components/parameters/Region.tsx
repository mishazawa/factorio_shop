import {
  layersState,
  REGION_TYPES,
  RegionType,
  useLayersStore,
} from "@store/layers";
import { find, findIndex } from "lodash/fp";
import { Dropdown } from "./Dropdown";
import { Xform } from "@store/common";
import { IconButton } from "../Buttons";
import LINK_ICON from "@assets/icons/link.svg";

export function Region() {
  const region = useLayersStore((s) =>
    find(
      ({ id }) => id === s.currentEditableRegionId,
      layersState.read().regions
    )
  );

  function onChangeType(v: RegionType) {
    if (!region) return;
    layersState.update((ls) => {
      const idx = findIndex(({ id }) => id === region.id, ls.regions);
      ls.regions[idx].type = v;
      // crutch to update UI from non-reactive update
      useLayersStore.getState().setRegionId(null);
      useLayersStore.getState().setRegionId(region.id);
    });
  }

  if (!region) return null;
  return (
    <div className="d-flex col w-100 h-100 align-start justify-start">
      <div>
        <span>{region.id}</span>
      </div>
      <div className="d-flex w-50">
        <span className="d-flex justify-end">type:</span>
        <span className="picker w-100">
          <Dropdown
            options={REGION_TYPES}
            current={region.type}
            onClick={onChangeType}
            className="Icon-button-small"
          />
        </span>
      </div>
      <XformParameter data={region.xform} />
    </div>
  );
}

function XformParameter({ data }: { data: Xform }) {
  return (
    <div className="xform-table-wrapper w-100">
      <span className="text-end">position:</span>
      <span>x={data.position.x}</span>
      <span>y={data.position.y}</span>
      <span className="d-flex justify-center">
        <IconButton
          icon={LINK_ICON}
          tooltip="link"
          className="Icon-button-small"
        />
      </span>

      <span className="text-end">size:</span>
      <span>w={data.size.x}</span>
      <span>h={data.size.y}</span>
      <span className="d-flex justify-center">
        <IconButton
          icon={LINK_ICON}
          tooltip="link"
          className="Icon-button-small"
        />
      </span>
    </div>
  );
}
