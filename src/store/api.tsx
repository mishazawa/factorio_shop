import { WHITELIST_TYPES } from "@app/constants";
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
    type: SimpleType | ComplexType;
    optional: boolean;
    default: number | string | FLiteral;
  };

export type BuiltInType =
  | "bool"
  | "double"
  | "float"
  | "int16"
  | "int32"
  | "int8"
  | "string"
  | "uint16"
  | "uint32"
  | "uint64"
  | "uint8";

export type SimpleType = string;

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

export type FArray = FComplexType<"array"> & {
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

type FStruct = FComplexType<"struct">;

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
    type: ComplexType | "builtin";
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
  editorTypes: Concept[];
  loaded: boolean;
  current: string;
};

type FactorioApiStoreFunc = {
  setCurrentType: (v: string) => void;
};

export const useFactorioApi = create<FactorioApiStore & FactorioApiStoreFunc>(
  (set) => ({
    api: null,
    editorTypes: [],
    loaded: false,
    current: "SpriteParameters",
    setCurrentType: (current: string) => set({ current }),
  })
);

export function initFactorioApi(resp: FactorioApi) {
  useFactorioApi.setState({
    api: resp,
    editorTypes: filter(resp.types, (o) => includes(WHITELIST_TYPES, o.name)),
    loaded: true,
    current: "SpriteParameters",
  });
}
