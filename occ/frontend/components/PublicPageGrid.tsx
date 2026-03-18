"use client";

import { ReactNode } from "react";
import InteractiveGrid from "./InteractiveGrid";

interface PublicPageGridProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  explosionActive?: boolean;
  isTransitioning?: boolean;
}

export default function PublicPageGrid({
  children,
  className = "",
  contentClassName = "",
  explosionActive: _explosionActive = false,
  isTransitioning: _isTransitioning = false,
}: PublicPageGridProps) {
  return (
    <div className={`relative overflow-hidden bg-transparent ${className}`}>
      <InteractiveGrid />
      <div className={`relative z-10 ${contentClassName}`}>{children}</div>
    </div>
  );
}
