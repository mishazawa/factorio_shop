import { ErrorProps } from ".";

export function ErrorProperty({ property }: ErrorProps) {
  return <div>Not supported type: {JSON.stringify(property, null, 2)}</div>;
}
