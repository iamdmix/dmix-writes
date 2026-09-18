export type ImageDimensions = { width: number; height: number };

const dimensions: Record<string, ImageDimensions> = {
  "/blog/capslock-settings.png": { width: 1670, height: 1426 },
  "/blog/containerseverywhere.jpeg": { width: 499, height: 272 },
  "/blog/divingintodocker.jpg": { width: 489, height: 492 },
  "/blog/dockerarchitecture.png": { width: 909, height: 1820 },
  "/blog/dockercompose.jpeg": { width: 404, height: 495 },
  "/blog/dockerheadache.png": { width: 422, height: 473 },
  "/blog/dockermacvswin.jpeg": { width: 415, height: 739 },
  "/blog/dockerVSvm.png": { width: 559, height: 548 },
  "/blog/drakelovesdocker.png": { width: 554, height: 554 },
  "/blog/macosrice.png": { width: 3420, height: 2224 },
  "/blog/popthehood.png": { width: 792, height: 422 },
  "/blog/setup.jpg": { width: 4618, height: 3464 },
  "/blog/typesofvms.png": { width: 2521, height: 1792 },
  "/blog/vmsvsdocker.jpg": { width: 1400, height: 735 },
  "/blog/waltersRV.png": { width: 621, height: 460 },
};

export function imageDimensions(src: string | Blob | undefined): ImageDimensions | undefined {
  if (!src || typeof src !== "string") return undefined;
  return dimensions[src];
}
