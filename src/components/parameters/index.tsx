import { ComplexType, Concept, Property } from "@store/api";
import { Description } from "./Description";
import { Settings } from "./Settings";
import { differenceWith, filter, head, reverse } from "lodash";
import { getParentsRecursive } from "./utils";

export type ParameterProps = {
  property: Property;
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

  if (!selected) return null;
  const parents = reverse(getParentsRecursive(options, selected.parent));

  return (
    <>
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

const IGNORED_PARAMETERS = ["layers", "stripes", "hr_version", "filename"].map(
  (name) => ({ name })
);

export function ParameterInputList({ params = [] }: { params?: Property[] }) {
  const cleanList = differenceWith(
    params,
    IGNORED_PARAMETERS,
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
