"use client";

import type { ImgHTMLAttributes } from "react";
import { useEffect, useMemo, useState } from "react";
import { resolveAssetUrl } from "@/lib/assetUrl";

type ImageWithFallbackProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  fallbackSrc: string;
  src?: string | null;
};

const isRenderableImageSrc = (value?: string | null) => {
  const trimmed = typeof value === "string" ? resolveAssetUrl(value)?.trim() || "" : "";
  if (!trimmed) return false;
  return true;
};

export default function ImageWithFallback({
  alt,
  fallbackSrc,
  src,
  ...props
}: ImageWithFallbackProps) {
  const resolvedSrc = useMemo(
    () => {
      const normalizedFallback = resolveAssetUrl(fallbackSrc) || fallbackSrc;
      return isRenderableImageSrc(src) ? resolveAssetUrl(src)!.trim() : normalizedFallback;
    },
    [fallbackSrc, src],
  );
  const [currentSrc, setCurrentSrc] = useState(resolvedSrc);

  useEffect(() => {
    setCurrentSrc(resolvedSrc);
  }, [resolvedSrc]);

  return (
    <img
      {...props}
      alt={alt}
      src={currentSrc}
      decoding={props.decoding ?? "async"}
      loading={props.loading ?? "lazy"}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}
