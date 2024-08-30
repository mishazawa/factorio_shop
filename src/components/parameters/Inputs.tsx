import { ChangeEvent, useState } from "react";
import { ParameterProps } from ".";
import {
  ComplexType,
  FArray,
  FLiteral,
  FTuple,
  FUnion,
  Property,
} from "@store/api";

import { ErrorProperty } from "./Error";
import { isString, noop } from "lodash";
import {
  decomposeComplexType,
  isColor,
  isOptionPicker,
  isTuple,
  isVector,
  unionToOptions,
} from "./utils";
import { Dropdown } from "./Dropdown";
import { UINT8, INT16 } from "@app/constants";
import { RenderSimpleType } from "./Settings";

type PNumberProps = { int?: boolean; max?: number; min?: number };

export function Bool({ property }: ParameterProps) {
  return (
    <div>
      <input type="checkbox" name={property.name} title={property.name} />
    </div>
  );
}

export function PString({ property }: ParameterProps) {
  return (
    <div>
      <input
        type="text"
        placeholder={property.name}
        name={property.name}
        title={property.name}
      />
    </div>
  );
}

export function PNumber({
  property,
  int = false,
  max = Infinity,
  min = -Infinity,
}: ParameterProps & PNumberProps) {
  // temp
  const [val, set] = useState<number>(undefined!);
  function onChange(e: ChangeEvent<HTMLInputElement>) {
    set(
      int
        ? Math.floor(Number(e.currentTarget.value))
        : Number(e.currentTarget.value)
    );
  }

  return (
    <div>
      <input
        value={val}
        type="number"
        name={property.name}
        title={property.name}
        step={int ? 1 : 0.1}
        max={max}
        min={min}
        onChange={onChange}
      />
    </div>
  );
}

export function Vector2({
  property,
  details,
}: ParameterProps & { details: [PNumberProps, PNumberProps] }) {
  return (
    <div className="vector2">
      <PNumber property={property} {...details[0]} />
      <PNumber property={property} {...details[1]} />
    </div>
  );
}

export function Vector4({
  property,
  details,
}: ParameterProps & {
  details: [PNumberProps, PNumberProps, PNumberProps, PNumberProps];
}) {
  return (
    <div className="vector4">
      <PNumber property={property} {...details[0]} />
      <PNumber property={property} {...details[1]} />
      <PNumber property={property} {...details[2]} />
      <PNumber property={property} {...details[3]} />
    </div>
  );
}

type POptions = {
  options: string[];
};

export function PArray({ property, options }: ParameterProps & POptions) {
  return (
    <select name={property.name} id="cars" multiple>
      {options.map((o) => (
        <option value={o} key={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function RenderArray({
  inferedType,
  property,
}: ParameterProps & { inferedType: FArray }) {
  if (isString(inferedType.value))
    return <ErrorProperty property={inferedType} />;

  if (
    inferedType.value.complex_type === "union" &&
    isOptionPicker(inferedType.value.options as ComplexType[])
  )
    return (
      <PArray
        property={property}
        options={(inferedType.value.options as unknown as FLiteral[]).map(
          (v: FLiteral) => v.value as string
        )}
      />
    );
  return <ErrorProperty property={inferedType} />;
}

export function RenderUnion({
  inferedType,
  property,
}: ParameterProps & { inferedType: FUnion }) {
  if (!inferedType.options.length)
    return <ErrorProperty property={inferedType} />;

  if (isOptionPicker(inferedType.options as ComplexType[])) {
    return (
      <Dropdown
        current={(inferedType.options[0] as FLiteral).value as string}
        options={unionToOptions(inferedType.options as FLiteral[])}
        onClick={noop}
      />
    );
  }

  if (isVector(property.type)) {
    // todo: util.by_pixel()
    return <Vector2 property={property} details={[{}, {}]} />;
  }

  if (isColor(property.type)) {
    return (
      <Vector4 property={property} details={[UINT8, UINT8, UINT8, UINT8]} />
    );
  }

  if (isTuple(inferedType.options)) {
    return <Vector2 property={property} details={[INT16, INT16]} />;
  }

  return <ErrorProperty property={inferedType} />;
}

export function RenderTuple({
  inferedType,
  property,
}: ParameterProps & { inferedType: FTuple }) {
  const decomposed = inferedType.values.map((v) => {
    return decomposeComplexType(v);
  });

  return (
    <div className="tuple">
      {decomposed.map((v, i) => {
        return (
          <RenderSimpleType
            property={
              {
                ...property,
                type: v,
              } as Property
            }
            key={i}
          />
        );
      })}
    </div>
  );
}
