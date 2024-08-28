import { filter, includes } from "lodash";
import { create } from "zustand";

type BasicMember = {
  name: string;
  order: number;
  description: string;
  lists?: string[];
  examples?: string[];
  images?: { filename: string; caption: string }[];
};

type Property = BasicMember & {
  visibility?: string[];
  alt_name?: string;
  override: boolean;
  type: ComplexType;
  optional: boolean;
  default: string | Literal;
};

type Literal = {
  complex_type: "literal";
  value: string | number | boolean;
  description?: string;
};
type ComplexType =
  | string
  | Literal
  | {
      complex_type: "array";
      value: ComplexType;
    }
  | {
      complex_type: "dictionary";
      key: ComplexType;
      value: ComplexType;
    }
  | {
      complex_type: "tuple";
      values: ComplexType[];
    }
  | {
      complex_type: "union";
      options: ComplexType[];
      full_format: boolean;
    }
  | {
      complex_type: "struct";
    }
  | {
      complex_type: "type";
      value: ComplexType;
      description: string;
    };

type Prototype = BasicMember & {
  abstract: boolean;
  deprecated: boolean;
  properties: Property[];
};

export type Concept = BasicMember & {
  abstract: boolean;
  inline: boolean;
  type: ComplexType;
  properties?: Property[];
};

type FactorioApi = {
  application: "factorio";
  application_version: string;
  api_version: number;
  stage: "prototype";
  prototypes: Prototype[];
  types: Concept[];
};

type FactorioApiStore = {
  api: null | FactorioApi;
  loaded: boolean;
  current: string;
};

type FactorioApiStoreFunc = {
  setCurrentType: (v: string) => void;
};

const WHITELIST_PROTOTYPES = ["SpritePrototype", "AnimationPrototype"];

const WHITELIST_TYPES = [
  "SpriteParameters",
  "AnimationParameters",
  "Animation",
  "AnimationSheet",
  "RotatedAnimation",
  "RotatedSprite",
  "Sprite",
  "SpriteNWaySheet",
  "SpriteSheet",
];

export const useFactorioApi = create<FactorioApiStore & FactorioApiStoreFunc>(
  (set) => ({
    api: null,
    loaded: false,
    current: "SpriteParameters",
    setCurrentType: (current: string) => set({ current }),
  })
);

export function initFactorioApi(resp: FactorioApi) {
  const data: FactorioApi = {
    ...resp,
    prototypes: filter(resp.prototypes, (o) =>
      includes(WHITELIST_PROTOTYPES, o.name)
    ),
    types: filter(resp.types, (o) => includes(WHITELIST_TYPES, o.name)),
  };

  useFactorioApi.setState({
    api: data,
    loaded: true,
    current: "SpriteParameters",
  });
}
