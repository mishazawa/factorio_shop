import { useFactorioApi } from "@store/api";
import {
  SimpleType,
  ComplexType,
  FLiteral,
  Concept,
  Property,
} from "@store/factorio-api.types";
import {
  clone,
  every,
  filter,
  find,
  head,
  isString,
  toInteger,
  toNumber,
  compose,
} from "lodash/fp";

function lookupType(t: string) {
  return find(({ name }) => name === t, useFactorioApi.getState().api?.types);
}

export function isBuiltin(t: SimpleType | ComplexType) {
  if (isString(t)) {
    const typedef = lookupType(t);
    return !!typedef && typedef.type === "builtin";
  }
  return false;
}

export function decomposeComplexType(t: SimpleType | ComplexType): ComplexType {
  if (isString(t)) {
    return lookupType(t)!.type as ComplexType;
  }
  return t;
}

export const isOptionPicker = every(
  (o: ComplexType) => o.complex_type === "literal"
);

export function isVector(type: SimpleType | ComplexType) {
  return isString(type) && type === "Vector";
}

export function isColor(type: SimpleType | ComplexType) {
  return isString(type) && type === "Color";
}

export function isTuple([first, ...options]: Array<SimpleType | ComplexType>) {
  if (!isString(first)) return false;
  return every((ct) => ct.complex_type === "tuple", options as ComplexType[]);
}

export function unionToOptions(options: FLiteral[]): string[] {
  return options.map((opt: FLiteral) => opt.value) as string[];
}

export function getParentsRecursive(
  concepts: Concept[],
  parent: string
): Property[][] {
  const v = compose(
    head,
    filter((n: Concept) => n.name === parent)
  )(concepts);

  if (!v || !v.properties) return [];
  if (!v.parent) return [v.properties];
  return [v.properties, ...getParentsRecursive(concepts, v.parent)];
}

export function setTupleValue<T>(value: T[], element: T, index: number) {
  let tmp = clone(value);
  if (!tmp) tmp = [];
  tmp[index] = element;
  return tmp;
}

export function validateInt<T>(value: T, isInt: boolean) {
  const n = toNumber(value);
  return isInt ? toInteger(n) : n;
}
