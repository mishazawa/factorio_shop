import { Reorder, useDragControls, useMotionValue } from "framer-motion";

import GRIP_ICON from "@assets/icons/grip.svg";
import TRASH_ICON from "@assets/icons/trash-can.svg";
import PEN_ICON from "@assets/icons/pen.svg";
import { useLayersStore, layersState } from "@store/layers";

import { IconButton } from "./Buttons";
import { openLayerPanel } from "@store/tools";
import { useFactorioApi } from "@store/api";
import { unloadPImage } from "@app/graphics/utils";

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
            icon={PEN_ICON}
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
    </Reorder.Item>
  );
}
