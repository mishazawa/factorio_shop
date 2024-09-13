import { setLayerAttributeByPath } from "@store/api";

import { layersState, useLayersStore } from "@store/layers";
import { useLinkTracker } from "@store/link-tracker";
import { get, values } from "lodash/fp";
import { useEffect } from "react";

export function Linker() {
  useUpdateLinkedParameters();
  return null;
}
const coordsToTuple = values;

function useUpdateLinkedParameters() {
  const links = useLinkTracker((s) => s.links);
  const refresh = useLayersStore((s) => s.lastUpdate);

  useEffect(() => {
    const sources = layersState.read();
    links.map((l) => {
      const val = get(l.src, sources);
      setLayerAttributeByPath(l.dst, coordsToTuple(val));
      return null;
    });
  }, [refresh, links]);
}
