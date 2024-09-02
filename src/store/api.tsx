import { NO_ACTIVE_LAYER, WHITELIST_TYPES } from "@app/constants";
import { filter, includes } from "lodash";
import { create } from "zustand";
import { Prototype, Concept, AttributeValue } from "./factorio-api.types";
import { produce } from "immer";
import { insert } from "@app/utils";

type FactorioApi = {
  application: "factorio";
  application_version: string;
  api_version: number;
  stage: "prototype";
  prototypes: Prototype[];
  types: Concept[];
};

type LayerAttributes = {
  type: string;
  attributes: Record<string, AttributeValue>;
};

type FactorioApiStore = {
  api: null | FactorioApi;
  editorTypes: Concept[];
  loaded: boolean;
  activeLayerIndex: number;
  layers: LayerAttributes[];
};

type FactorioApiStoreFunc = {
  setActiveLayer: (v: number) => void;
  setLayerType: (v: string) => void;
  setLayerAttribute: (name: string, value: AttributeValue) => void;
  createLayer: (index: number) => void;
};

export const useFactorioApi = create<FactorioApiStore & FactorioApiStoreFunc>(
  (set) => ({
    api: null,
    editorTypes: [],
    loaded: false,
    activeLayerIndex: NO_ACTIVE_LAYER,
    layers: [],
    createLayer: (index: number) => set(initLayerProperties(index)),
    setActiveLayer: (activeLayerIndex: number) => set({ activeLayerIndex }),
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

function initLayerProperties(index: number) {
  return produce((s: FactorioApiStore) => {
    s.layers = insert(s.layers, index, createLayer());
  });
}

function createLayer() {
  return {
    type: "SpriteParameters",
    attributes: {},
  };
}
function setLayerType(value: string) {
  return produce((s: FactorioApiStore) => {
    s.layers[s.activeLayerIndex].type = value;
  });
}

function setLayerAttribute(name: string, value: AttributeValue) {
  return produce((s: FactorioApiStore) => {
    s.layers[s.activeLayerIndex].attributes[name] = value;
  });
}
