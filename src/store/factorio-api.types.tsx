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

//probably not needed;
type FType = FComplexType<"type"> & {
  value: ComplexType | string;
  description: string;
};
//probably not needed;
type FStruct = FComplexType<"struct">;
//probably not needed;
type FDict = FComplexType<"dictionary"> & {
  key: ComplexType | string;
  value: ComplexType | string;
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

export type FTuple = FComplexType<"tuple"> & {
  values: ComplexType[] | string[];
};

export type FUnion = FComplexType<"union"> & {
  options: ComplexType[] | string[];
  full_format: boolean;
};

export type ComplexType =
  | FArray
  | FDict
  | FTuple
  | FUnion
  | FStruct
  | FType
  | FLiteral;

export type Prototype = BasicMember &
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

export type AttributeValue =
  | boolean
  | string
  | string[]
  | number
  | number[]
  | undefined;
