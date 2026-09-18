import type { ImgHTMLAttributes } from "react";
import { imageDimensions, imagePlaceholder } from "@/lib/images";

const MAX_DISPLAY_HEIGHT = 380;

type ProseImageProps = ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean };

export function ProseImage(props: ProseImageProps) {
  const src = typeof props.src === "string" ? props.src : undefined;
  const dims = imageDimensions(src);
  const placeholder = imagePlaceholder(src);
  const { priority = false, ...imgProps } = props;

  if (!dims) {
    return <img {...imgProps} alt={props.alt ?? ""} loading={priority ? "eager" : "lazy"} decoding="async" />;
  }

  const ratio = dims.width / dims.height;
  const reservedWidth = Math.round(MAX_DISPLAY_HEIGHT * ratio);

  return (
    <figure
      className="media-frame"
      style={{
        aspectRatio: `${dims.width} / ${dims.height}`,
        width: `min(100%, ${reservedWidth}px)`,
        backgroundImage: placeholder ? `url(${placeholder})` : undefined,
      }}
    >
      <img
        {...imgProps}
        alt={props.alt ?? ""}
        width={props.width ?? dims.width}
        height={props.height ?? dims.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding={priority ? "sync" : "async"}
      />
    </figure>
  );
}
