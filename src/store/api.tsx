import {
  DEFAULT_LAYER_TYPE,
  NO_ACTIVE_LAYER,
  WHITELIST_TYPES,
} from "@app/constants";
import { filter, includes } from "lodash";
import { create } from "zustand";
import { Prototype, Concept, AttributeValue } from "./factorio-api.types";
import { produce } from "immer";

type FactorioApi = {
  application: "factorio";
  application_version: string;
  api_version: number;
  stage: "prototype";
  prototypes: Prototype[];
  types: Concept[];
};

export type LayerAttributes = {
  type: string;
  attributes: Record<string, AttributeValue>;
};
export type LayerId = string | -1;
type FactorioApiStore = {
  api: null | FactorioApi;
  editorTypes: Concept[];
  loaded: boolean;
  activeLayerId: LayerId;
  layers: Record<string, LayerAttributes>;
};

type FactorioApiStoreFunc = {
  setActiveLayer: (id: string) => void;
  setLayerType: (v: string) => void;
  setLayerAttribute: (name: string, value: AttributeValue) => void;
  createLayer: (id: string) => void;
  removeLayer: (id: LayerId) => void;
};

export const useFactorioApi = create<FactorioApiStore & FactorioApiStoreFunc>(
  (set) => ({
    api: null,
    editorTypes: [],
    loaded: false,
    activeLayerId: NO_ACTIVE_LAYER,
    layers: {},
    createLayer: (id: string) => set(initLayerProperties(id)),
    removeLayer: (id: LayerId) => set(remove(id)),
    setActiveLayer: (activeLayerId: string) => set({ activeLayerId }),
    setLayerType: (v: string) => set(setLayerType(v)),
    setLayerAttribute: (name: string, value: AttributeValue) => {
      set(setLayerAttribute(name, value));
    },
  })
);

export function initFactorioApi(resp: FactorioApi) {
  useFactorioApi.setState({
    api: resp,
    editorTypes: filter(resp.types, (o) => includes(WHITELIST_TYPES, o.name)),
    loaded: true,
  });
}

function remove(id: LayerId) {
  return produce((s: FactorioApiStore) => {
    if (s.activeLayerId === id) s.activeLayerId = NO_ACTIVE_LAYER;
    delete s.layers[id];
  });
}

function initLayerProperties(id: string) {
  return produce((s: FactorioApiStore) => {
    s.layers[id] = createLayer();
  });
}

function createLayer() {
  return {
    type: DEFAULT_LAYER_TYPE,
    attributes: {},
  };
}
function setLayerType(value: string) {
  return produce((s: FactorioApiStore) => {
    s.layers[s.activeLayerId].type = value;
  });
}

function setLayerAttribute(name: string, value: AttributeValue) {
  return produce((s: FactorioApiStore) => {
    s.layers[s.activeLayerId].attributes[name] = value;
  });
}
