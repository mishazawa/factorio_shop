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

type Inherits = {
  parent: string;
};

export type Property = BasicMember &
  Inherits & {
    visibility?: string[];
    alt_name?: string;
    override: boolean;
    type: string | ComplexType;
    optional: boolean;
    default: string | FLiteral;
  };

export type FComplexTypeOptions =
  | "literal"
  | "array"
  | "dictionary"
  | "tuple"
  | "union"
  | "type"
  | "struct";

export type FComplexType<T> = {
  complex_type: T;
};

export type FLiteral = FComplexType<"literal"> & {
  value: string | number | boolean;
  description?: string;
};

type FArray = FComplexType<"array"> & {
  value: ComplexType | string;
};

type FDict = FComplexType<"dictionary"> & {
  key: ComplexType | string;
  value: ComplexType | string;
};

export type FTuple = FComplexType<"tuple"> & {
  values: ComplexType[] | string[];
};
export type FUnion = FComplexType<"union"> & {
  options: ComplexType[] | string[];
  full_format: boolean;
};

type FType = FComplexType<"type"> & {
  value: ComplexType | string;
  description: string;
};
type FStruct = FComplexType<"struct"> & Record<string, any>;

export type ComplexType =
  | FArray
  | FDict
  | FTuple
  | FUnion
  | FStruct
  | FType
  | FLiteral;

type Prototype = BasicMember &
  Inherits & {
    abstract: boolean;
    deprecated: boolean;
    properties: Property[];
  };

export type Concept = BasicMember &
  Inherits & {
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
