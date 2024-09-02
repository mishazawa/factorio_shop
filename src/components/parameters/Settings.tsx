import { isString } from "lodash";
import { ParameterProps } from ".";
import { decomposeComplexType, isBuiltin } from "./utils";
import { ErrorProperty } from "./Error";
import { INT16, UINT8 } from "@app/constants";

import {
  Bool,
  PString,
  PNumber,
  RenderArray,
  RenderUnion,
  RenderTuple,
} from "./Inputs";
import {
  BuiltInType,
  ComplexType,
  Property,
  FUnion,
  FArray,
  FTuple,
} from "@store/factorio-api.types";

export function Settings({ property }: ParameterProps) {
  if (isBuiltin(property.type)) {
    return <RenderSimpleType property={property} />;
  }
  return <RenderComplexType property={property} />;
}

export function RenderSimpleType({
  property,
  index = 0,
  indexed = false,
}: ParameterProps) {
  switch (property.type as BuiltInType) {
    case "bool":
      return <Bool property={property} />;
    case "string":
      return <PString property={property} />;
    case "double":
    case "float":
      return <PNumber property={property} index={index} indexed={indexed} />;
    case "int32":
      return (
        <PNumber
          //
          int
          property={property}
          min={-2147483648}
          max={2147483647}
          index={index}
          indexed={indexed}
        />
      );
    case "int16":
      return (
        <PNumber
          property={property}
          {...INT16}
          index={index}
          indexed={indexed}
        />
      );
    case "int8":
      return (
        <PNumber
          property={property}
          int
          min={-128}
          max={127}
          index={index}
          indexed={indexed}
        />
      );
    case "uint64":
      return (
        <PNumber
          property={property}
          int
          min={0}
          max={18446744073709551615}
          index={index}
          indexed={indexed}
        />
      );
    case "uint32":
      return (
        <PNumber
          property={property}
          int
          min={0}
          max={4294967295}
          index={index}
          indexed={indexed}
        />
      );
    case "uint16":
      return (
        <PNumber
          property={property}
          int
          min={0}
          max={65535}
          index={index}
          indexed={indexed}
        />
      );
    case "uint8":
      return (
        <PNumber
          property={property}
          {...UINT8}
          index={index}
          indexed={indexed}
        />
      );
    default:
      return <ErrorProperty property={property.type as ComplexType} />;
  }
}

export function RenderComplexType({ property }: ParameterProps) {
  const typedef = decomposeComplexType(property.type);

  if (isString(typedef)) {
    return (
      <RenderSimpleType
        property={
          {
            ...property,
            type: typedef,
          } as Property
        }
      />
    );
  }

  switch ((typedef as ComplexType).complex_type) {
    case "union":
      return (
        <RenderUnion //
          inferedType={typedef as FUnion}
          property={property}
        />
      );
    case "array":
      return (
        <RenderArray //
          inferedType={typedef as FArray}
          property={property}
        />
      );
    case "tuple":
      return (
        <RenderTuple inferedType={typedef as FTuple} property={property} />
      );
    case "dictionary":
    case "struct":
    case "type":
    case "literal":
  }

  return <ErrorProperty property={typedef} />;
}
