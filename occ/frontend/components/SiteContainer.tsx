"use client";

import type { ElementType, ReactNode } from "react";

type SiteContainerSize = "default" | "compact" | "narrow";

const sizeClasses: Record<SiteContainerSize, string> = {
  default: "max-w-7xl",
  compact: "max-w-5xl",
  narrow: "max-w-4xl",
};

type SiteContainerProps = {
  children: ReactNode;
  className?: string;
  size?: SiteContainerSize;
  as?: ElementType;
};

export default function SiteContainer({
  children,
  className = "",
  size = "default",
  as: Component = "div",
}: SiteContainerProps) {
  return (
    <Component className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`.trim()}>
      {children}
    </Component>
  );
}
