import { loadPImage } from "@app/graphics/utils";
import { FileButton, TextButton } from "./Buttons";
import { generateLuaScript } from "@app/utils";

export function TopMenu() {
  return (
    <div className="Header bordered-dark-convex d-flex flex-row gap-1">
      <FileButton onFile={loadPImage}>import sprite</FileButton>
      <TextButton onClick={generateLuaScript}>generate .lua</TextButton>
    </div>
  );
}
