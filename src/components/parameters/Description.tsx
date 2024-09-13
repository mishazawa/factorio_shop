import { If } from "../UIKit";
import { ParameterProps } from ".";
import { finishLink } from "@store/layers";

export function Description({ property }: ParameterProps) {
  function onParameterLink() {
    finishLink(property);
  }
  return (
    <div className="prop-description">
      <span onClick={onParameterLink}>{property.name}</span>
      <If v={property.optional}>
        <span>(optional)</span>
      </If>
    </div>
  );
}
