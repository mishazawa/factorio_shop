import { loadPImage } from "@app/utils";
import { FileButton } from "./Buttons";

export function TopMenu() {
  return (
    <div className="Header bordered-dark-convex">
      <FileButton onFile={loadPImage}>import sprite</FileButton>
    </div>
  );
}
