import { Description } from "./Description";
import { Settings } from "./Settings";
import { differenceWith, filter, head, reverse } from "lodash";
import { getParentsRecursive } from "./utils";
import { Property, ComplexType, Concept } from "@store/factorio-api.types";
import { useFactorioApi } from "@store/api";
import { If } from "../UIKit";
import { DEBUG, IGNORED_PARAMETERS } from "@app/constants";

export type ParameterProps = {
  property: Property;
  index?: number;
  indexed?: boolean;
};

export type ErrorProps = {
  property: ComplexType;
};

export function Parameters({
  current,
  options,
}: {
  current: string;
  options: Concept[];
}) {
  const selected = head(filter(options, (n) => n.name === current));

  if (!selected) {
    return (
      <If v={DEBUG}>
        <DebugStore />
      </If>
    );
  }

  const parents = reverse(getParentsRecursive(options, selected.parent));

  return (
    <>
      <If v={DEBUG}>
        <DebugStore />
      </If>
      {parents.map((p, i) => (
        <ParameterInputList key={i} params={p} />
      ))}
      <ParameterInputList params={selected.properties} />
    </>
  );
}

function ParameterInput(args: ParameterProps) {
  return (
    <div>
      <Description {...args} />
      <Settings {...args} />
    </div>
  );
}

const parametersToSkip = IGNORED_PARAMETERS.map((name) => ({ name }));

export function ParameterInputList({ params = [] }: { params?: Property[] }) {
  const cleanList = differenceWith(
    params,
    parametersToSkip,
    (a, b) => a.name === b.name
  );

  return (
    <>
      {cleanList.map((p) => (
        <ParameterInput key={p.name} property={p} />
      ))}
    </>
  );
}

export function DebugStore() {
  const _ = useFactorioApi((s) => s.layers);
  console.log("Parameters: ", JSON.stringify(_, null, 2));
  return null;
}
