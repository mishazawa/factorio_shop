import { If } from "../UIKit";
import { ParameterProps } from ".";

export function Description({ property }: ParameterProps) {
  return (
    <div className="prop-description">
      <span>{property.name}</span>
      <If v={property.optional}>
        <span>(optional)</span>
      </If>
    </div>
  );
}
