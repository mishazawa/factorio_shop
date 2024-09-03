import { initFactorioApi, useFactorioApi } from "@store/api";
import { generate } from "./lua";
import { layersState } from "@store/layers";

export function fetchApiDocs() {
  fetch(process.env.REACT_APP_FACTORIO_API_JSON!)
    .then((r) => r.json())
    .then(initFactorioApi)
    .catch((err) => {
      console.info("Couldn't load API schema. Please, contact maintainer.");
      console.error(err);
    });
}

export function insert<T>(arr: T[], index: number, newItem: T) {
  return [...arr.slice(0, index), newItem, ...arr.slice(index)];
}

export function generateLuaScript() {
  const { sprites } = layersState.read();
  const { layers } = useFactorioApi.getState();
  return generate(sprites, layers);
}
