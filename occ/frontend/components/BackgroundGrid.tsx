"use client";

import { usePathname } from "next/navigation";
import StaticGrid from "./StaticGrid";

export default function BackgroundGrid() {
  const pathname = usePathname();
  
  const isHomepage = pathname === "/";
  
  if (isHomepage) {
    return null;
  }
  
  return <StaticGrid />;
}
