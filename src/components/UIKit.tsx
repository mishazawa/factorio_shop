import { ReactNode } from "react";

type IfProps = {
  v: boolean;
  children: string | ReactNode;
};

export function If({ v, children }: IfProps) {
  return <>{v ? children : null}</>;
}
