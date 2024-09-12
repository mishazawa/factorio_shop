import { Reorder, useDragControls, useMotionValue } from "framer-motion";

import GRIP_ICON from "@assets/icons/grip.svg";
import TRASH_ICON from "@assets/icons/trash-can.svg";
import TABLE_ICON from "@assets/icons/table-list.svg";
import LAYER_ADD_ICON from "@assets/icons/layer-add.svg";

import {
  useLayersStore,
  layersState,
  createRegion,
  RegionObject,
  activateRegion,
} from "@store/layers";

import { IconButton } from "./Buttons";
import { openLayerPanel } from "@store/tools";
import { useFactorioApi } from "@store/api";
import { unloadPImage } from "@app/graphics/utils";
import { flow, intersectionWith, keys, pickBy, values } from "lodash/fp";

export function LayerList() {
  const layers = useLayersStore((s) => s.layers);
  const reorder = useLayersStore((s) => s.reorder);

  return (
    <div className="Layer-list bordered-dark-concave scrollbar">
      <Reorder.Group axis="y" values={layers} onReorder={reorder}>
        {layers.map((item) => (
          <LayerItem key={item} item={item} />
        ))}
      </Reorder.Group>
    </div>
  );
}

function LayerItem({ item }: { item: number }) {
  const y = useMotionValue(0);
  const dragControls = useDragControls();
  const meta = layersState.read().sprites[item];
  const regs = layersState.read().regions;

  const regions = useLayersStore((s) =>
    flow(
      pickBy((value) => value === meta.id),
      keys,
      intersectionWith((a, b) => a.id === b, values(regs))
    )(s.regions)
  );

  function openLayerProps() {
    openLayerPanel(true);
    useFactorioApi.getState().setActiveLayer(meta.id);
  }

  return (
    <Reorder.Item
      key={item}
      value={item}
      style={{ y }}
      dragListener={false}
      dragControls={dragControls}
      className="bordered-dark-convex"
    >
      <div className="layer-item">
        <div>{meta?.filename}</div>
        <div className="tools">
          <IconButton
            icon={LAYER_ADD_ICON}
            tooltip="add region"
            onClick={() => createRegion(meta.id)}
          />
          <IconButton
            icon={TABLE_ICON}
            tooltip="properties"
            onClick={openLayerProps}
          />
          <IconButton
            icon={TRASH_ICON}
            tooltip="remove"
            className="Danger-button"
            onClick={() => unloadPImage(item)}
          />
          <div
            className="drag-zone"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <img src={GRIP_ICON} alt="draggable" />
          </div>
        </div>
      </div>
      <div className="region-list">
        {regions.map((v) => (
          <RegionItem key={v.id} region={v} layer={meta.id} />
        ))}
      </div>
    </Reorder.Item>
  );
}

function RegionItem({ region }: { region: RegionObject; layer: string }) {
  return (
    <div
      onClick={() => activateRegion(region.id)}
      className="region-item bordered-dark-concave d-flex flex-row between gap-01 tr-fast"
    >
      <div>{region.id}</div>
      <div className="tools d-flex flex-row gap-01">
        <IconButton
          icon={TRASH_ICON}
          tooltip="remove"
          className="Danger-button"
        />
      </div>
    </div>
  );
}
