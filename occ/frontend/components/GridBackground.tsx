"use client";

import { useEffect, useRef, useCallback } from "react";

const CELL = 60;
const DEPTH = 24;

type Cell = {
  wrap: HTMLDivElement;
  top: HTMLDivElement;
  right: HTMLDivElement;
  bottom: HTMLDivElement;
  row: number;
  col: number;
};

export default function GridBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cellsRef = useRef<Cell[]>([]);
  const activeRef = useRef<Set<HTMLDivElement>>(new Set());
  const prevCell = useRef({ row: -1, col: -1 });

  const build = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    el.innerHTML = "";
    cellsRef.current = [];
    activeRef.current.clear();
    prevCell.current = { row: -1, col: -1 };

    const W = el.offsetWidth;
    const H = el.offsetHeight;
    if (!W || !H) return;

    const cols = Math.ceil(W / CELL) + 1;
    const rows = Math.ceil(H / CELL) + 1;

    el.style.gridTemplateColumns = `repeat(${cols}, ${CELL}px)`;
    el.style.gridTemplateRows = `repeat(${rows}, ${CELL}px)`;

    const frag = document.createDocumentFragment();

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const wrap = document.createElement("div");
        wrap.style.cssText = `
          position:relative;
          width:${CELL}px;
          height:${CELL}px;
          transform-style:preserve-3d;
        `;

        const top = document.createElement("div");
        top.style.cssText = `
          position:absolute;
          inset:0;
          border-right:1px solid rgba(0,0,0,0.09);
          border-bottom:1px solid rgba(0,0,0,0.09);
          background:transparent;
          transform:translateZ(0);
          transform-style:preserve-3d;
          will-change:transform;
          transition:
            transform  0.18s cubic-bezier(0.23, 1, 0.32, 1),
            background 0.18s ease,
            box-shadow 0.18s ease;
        `;

        const right = document.createElement("div");
        right.style.cssText = `
          position:absolute;
          top:0;
          right:-${DEPTH}px;
          width:${DEPTH}px;
          height:100%;
          background:rgba(10,20,70,0.5);
          transform:rotateY(90deg);
          transform-origin:left center;
          backface-visibility:hidden;
          opacity:0;
          transition:opacity 0.12s ease;
        `;

        const bottom = document.createElement("div");
        bottom.style.cssText = `
          position:absolute;
          bottom:-${DEPTH}px;
          left:0;
          width:100%;
          height:${DEPTH}px;
          background:rgba(10,20,70,0.35);
          transform:rotateX(-90deg);
          transform-origin:top center;
          backface-visibility:hidden;
          opacity:0;
          transition:opacity 0.12s ease;
        `;

        wrap.appendChild(top);
        wrap.appendChild(right);
        wrap.appendChild(bottom);
        frag.appendChild(wrap);

        cellsRef.current.push({ wrap, top, right, bottom, row: r, col: c });
      }
    }

    el.appendChild(frag);
  }, []);

  const onMove = useCallback((e: MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const col = Math.floor((e.clientX - rect.left) / CELL);
    const row = Math.floor((e.clientY - rect.top) / CELL);

    if (row === prevCell.current.row && col === prevCell.current.col) return;
    prevCell.current = { row, col };

    const next = new Set<HTMLDivElement>();

    cellsRef.current.forEach(({ wrap, top, right, bottom, row: r, col: c }) => {
      const dist = Math.max(Math.abs(r - row), Math.abs(c - col));

      if (dist === 0) {
        top.style.transform = `translateZ(${DEPTH}px)`;
        top.style.background = "rgba(59,130,246,0.1)";
        top.style.boxShadow = `
          0 0 24px 6px rgba(59, 130, 246, 0.30),
          inset 0 0 0 1px rgba(59, 130, 246, 0.50)
        `;
        right.style.opacity = "1";
        bottom.style.opacity = "1";
        next.add(wrap);
      } else if (dist === 1) {
        top.style.transform = "translateZ(8px)";
        top.style.background = "rgba(59, 130, 246, 0.04)";
        top.style.boxShadow = "none";
        right.style.opacity = "0";
        bottom.style.opacity = "0";
        next.add(wrap);
      } else if (dist === 2) {
        top.style.transform = "translateZ(2px)";
        top.style.background = "transparent";
        top.style.boxShadow = "none";
        right.style.opacity = "0";
        bottom.style.opacity = "0";
        next.add(wrap);
      } else if (activeRef.current.has(wrap)) {
        top.style.transform = "translateZ(0)";
        top.style.background = "transparent";
        top.style.boxShadow = "none";
        right.style.opacity = "0";
        bottom.style.opacity = "0";
      }
    });

    activeRef.current = next;
  }, []);

  const onLeave = useCallback(() => {
    prevCell.current = { row: -1, col: -1 };
    activeRef.current.forEach((wrap) => {
      const entry = cellsRef.current.find((e) => e.wrap === wrap);
      if (!entry) return;
      entry.top.style.transition = `
        transform  0.40s cubic-bezier(0.23, 1, 0.32, 1),
        background 0.35s ease,
        box-shadow 0.35s ease
      `;
      entry.top.style.transform = "translateZ(0)";
      entry.top.style.background = "transparent";
      entry.top.style.boxShadow = "none";
      entry.right.style.opacity = "0";
      entry.bottom.style.opacity = "0";
    });
    activeRef.current.clear();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    build();

    const ro = new ResizeObserver(build);
    ro.observe(el);

    el.addEventListener("mousemove", onMove as EventListener);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      ro.disconnect();
      el.removeEventListener("mousemove", onMove as EventListener);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [build, onMove, onLeave]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        perspective: "600px",
        perspectiveOrigin: "50% 40%",
        backgroundColor: "#ffffff",
        overflow: "visible",
        zIndex: 0,
        pointerEvents: "auto",
      }}
    />
  );
}
