import { ChangeEvent, useCallback } from "react";
import { ParameterProps } from ".";

import { ErrorProperty } from "./Error";
import { isString, nth, toArray } from "lodash";
import {
  decomposeComplexType,
  isColor,
  isOptionPicker,
  isTuple,
  isVector,
  setTupleValue,
  unionToOptions,
  validateInt,
} from "./utils";
import { Dropdown } from "./Dropdown";
import { UINT8, INT16 } from "@app/constants";
import { RenderSimpleType } from "./Settings";
import {
  FArray,
  ComplexType,
  FLiteral,
  FUnion,
  FTuple,
  Property,
  AttributeValue,
} from "@store/factorio-api.types";
import { useFactorioApi } from "@store/api";

type PNumberProps = {
  int?: boolean;
  max?: number;
  min?: number;
  indexed?: boolean;
  index?: number;
};

function useStoreAttribute<T>({
  name,
}: Property): [T, (v: AttributeValue) => void] {
  const idx = useFactorioApi((s) => s.activeLayerIndex);
  const value = useFactorioApi((s) => s.layers[idx].attributes[name]);
  const setState = useFactorioApi((s) => s.setLayerAttribute);
  const fn = useCallback((v: any) => setState(name, v), [name, setState]);
  return [value as T, fn];
}

export function Bool({ property }: ParameterProps) {
  const [val, set] = useStoreAttribute<boolean>(property);
  return (
    <div>
      <input
        type="checkbox"
        checked={val}
        onChange={(e) => set(e.currentTarget.checked)}
        name={property.name}
        title={property.name}
      />
    </div>
  );
}

export function PString({ property }: ParameterProps) {
  const [val, set] = useStoreAttribute<string>(property);
  return (
    <div>
      <input
        value={val}
        onChange={(e) => set(e.currentTarget.value)}
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
  indexed = false,
  index = 0,
}: ParameterProps & PNumberProps) {
  const [val, set] = useStoreAttribute<number[]>(property);

  function prepareValue(e: ChangeEvent<HTMLInputElement>) {
    const value = validateInt(e.currentTarget.value, int);
    if (indexed) return setTupleValue(val, value, index);
    return value;
  }

  function unpackValue(): number | undefined {
    return indexed ? nth(val, index) : (val as unknown as number);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    set(prepareValue(e));
  }

  return (
    <div>
      <input
        value={unpackValue()}
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
      <PNumber property={property} {...details[0]} indexed index={0} />
      <PNumber property={property} {...details[1]} indexed index={1} />
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
      <PNumber property={property} {...details[0]} indexed index={0} />
      <PNumber property={property} {...details[1]} indexed index={1} />
      <PNumber property={property} {...details[2]} indexed index={2} />
      <PNumber property={property} {...details[3]} indexed index={3} />
    </div>
  );
}

type POptions = {
  options: string[];
};

export function PArray({ property, options }: ParameterProps & POptions) {
  const [val, set] = useStoreAttribute<string[]>(property);

  function prepareValue(e: ChangeEvent<HTMLSelectElement>) {
    return toArray(e.currentTarget.selectedOptions).map(
      (option) => option.value
    );
  }

  return (
    <select
      name={property.name}
      id="cars"
      multiple
      value={val || []}
      onChange={(e) => set(prepareValue(e))}
    >
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
  const [val, set] = useStoreAttribute<string>(property);

  if (!inferedType.options.length)
    return <ErrorProperty property={inferedType} />;

  if (isOptionPicker(inferedType.options as ComplexType[])) {
    return (
      <Dropdown
        current={val || ((inferedType.options[0] as FLiteral).value as string)}
        options={unionToOptions(inferedType.options as FLiteral[])}
        onClick={set}
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
            indexed
            index={i}
            key={i}
          />
        );
      })}
    </div>
  );
}
