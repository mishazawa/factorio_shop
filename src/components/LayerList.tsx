import { Reorder, useDragControls, useMotionValue } from "framer-motion";

import GRIP_ICON from "../assets/icons/grip.svg";
import TRASH_ICON from "../assets/icons/trash-can.svg";
import { IconButton } from "./Buttons";
import { useLayersStore } from "../store/layers";
import { realtimeStore as rts } from "../store/layers";
import { unloadPImage } from "../utils";

export function LayerList() {
  const layers = useLayersStore((s) => s.layers);
  const reorder = useLayersStore((s) => s.reorder);

  return (
    <div className="Layers-wrapper bordered-dark-concave">
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
  const meta = rts.read().sprites[item];

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
