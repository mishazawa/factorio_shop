import { FileButton } from "./Buttons";
import { loadPImage } from "../utils";

export function TopMenu() {
  return (
    <div className="Header bordered-dark-convex">
      <FileButton onFile={loadPImage}>import sprite</FileButton>
    </div>
  );
}
