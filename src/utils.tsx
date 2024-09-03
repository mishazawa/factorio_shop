import p5 from "p5";
import { RESPONSIVE_CANVAS } from "./constants";
import { createLayer, removeImage } from "./store/layers";
import { useLayersStore } from "./store/layers";
import { initFactorioApi, useFactorioApi } from "@store/api";

// todo refactor this

type PImage = p5.Image & {
  canvas: HTMLCanvasElement;
  drawingContext: CanvasRenderingContext2D;
  modified: boolean;
};

export function updateCanvasDimensions(p5: p5) {
  return {
    canvasWidth: p5.windowWidth,
    canvasHeight: p5.windowHeight,
  };
}

export function onWindowResize(p5: p5) {
  if (!RESPONSIVE_CANVAS) return () => {};
  return () => {
    const { canvasWidth, canvasHeight } = updateCanvasDimensions(p5);
    const c = p5.createCanvas(canvasWidth, canvasHeight);

    const x = (p5.windowWidth - canvasWidth) / 2;
    const y = (p5.windowHeight - canvasHeight) / 2;
    c.position(x, y);

    p5.pixelDensity(window.devicePixelRatio);
  };
}

export function loadPImage(file: File) {
  const reader = new FileReader();
  const fileImage = new Image();
  const processingImage = new p5.Image(1, 1) as PImage;

  reader.addEventListener(
    "load",
    () => {
      fileImage.src = reader.result as string;
    },
    false
  );

  fileImage.onload = () => {
    processingImage.width = processingImage.canvas.width = fileImage.width;
    processingImage.height = processingImage.canvas.height = fileImage.height;

    processingImage.drawingContext.drawImage(fileImage, 0, 0);
    processingImage.modified = true;

    // add data to realtime storage and track layers in UI storage
    const [index, sprite] = createLayer(processingImage, file, fileImage);
    useLayersStore.getState().add(index);
    useFactorioApi.getState().createLayer(sprite?.id);
  };

  reader.readAsDataURL(file);
}

export function unloadPImage(layerIndex: number) {
  const id = removeImage(layerIndex);
  useLayersStore.getState().remove(layerIndex);
  useFactorioApi.getState().removeLayer(id);
}

export function fetchApiDocs() {
  fetch("/prototype-api.json")
    .then((r) => r.json())
    .then(initFactorioApi);
}

export function insert<T>(arr: T[], index: number, newItem: T) {
  return [...arr.slice(0, index), newItem, ...arr.slice(index)];
}
