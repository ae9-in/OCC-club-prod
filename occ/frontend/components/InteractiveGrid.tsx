"use client";

import { useEffect, useRef } from "react";

const GRID_SIZE = 56;
const MAX_DISTANCE = 290;
const GRID_BACKGROUND = "#ececec";

const lerp = (start: number, end: number, amount: number) => start + (end - start) * amount;

interface InteractiveGridProps {
  variant?: "hero" | "page";
  scope?: "viewport" | "container";
  className?: string;
}

export default function InteractiveGrid({
  variant = "hero",
  scope = "viewport",
  className = "",
}: InteractiveGridProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const pointerTargetRef = useRef({ x: -9999, y: -9999, active: false });
  const pointerCurrentRef = useRef({ x: -9999, y: -9999 });
  const glowOpacityRef = useRef(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const glow = glowRef.current;
    if (!wrapper || !canvas || !glow) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;

    const getRect = () =>
      scope === "container"
        ? wrapper.getBoundingClientRect()
        : new DOMRect(0, 0, window.innerWidth, window.innerHeight);

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = getRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const columns = Math.ceil(width / GRID_SIZE) + 2;
      const rows = Math.ceil(height / GRID_SIZE) + 2;
      const responsiveSoftness =
        width < 640 ? 0.5 : width < 900 ? 0.68 : width < 1200 ? 0.82 : 1;
      const variantSoftness = variant === "page" ? 0.72 : 1;

      const pointerTarget = pointerTargetRef.current;
      const pointerCurrent = pointerCurrentRef.current;

      pointerCurrent.x = lerp(pointerCurrent.x, pointerTarget.x, 0.17);
      pointerCurrent.y = lerp(pointerCurrent.y, pointerTarget.y, 0.17);
      glowOpacityRef.current = lerp(
        glowOpacityRef.current,
        pointerTarget.active ? 1 : 0,
        pointerTarget.active ? 0.2 : 0.08,
      );

      context.clearRect(0, 0, width, height);
      context.fillStyle = GRID_BACKGROUND;
      context.fillRect(0, 0, width, height);

      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const x = column * GRID_SIZE;
          const y = row * GRID_SIZE;
          const cellCenterX = x + GRID_SIZE / 2;
          const cellCenterY = y + GRID_SIZE / 2;

          const dx = pointerCurrent.x - cellCenterX;
          const dy = pointerCurrent.y - cellCenterY;
          const distance = Math.hypot(dx, dy);
          const intensity = Math.max(0, 1 - distance / MAX_DISTANCE) * glowOpacityRef.current;
          const easedIntensity = intensity * intensity * (3 - 2 * intensity);
          const focusBoost = Math.min(1, easedIntensity * 0.92) * responsiveSoftness * variantSoftness;
          const scale = 1 + focusBoost * (variant === "page" ? 0.12 : 0.2);
          const liftX = dx * -0.012 * focusBoost;
          const liftY = dy * -0.012 * focusBoost;
          const fillOpacity = 0.012 + focusBoost * 0.17;
          const borderOpacity = 0.055 + focusBoost * 0.14;
          const depthOpacity = focusBoost * 0.14;
          const shadowBlur = focusBoost * 12;
          const shadowOffsetX = liftX * 6;
          const shadowOffsetY = Math.max(3, 7 + focusBoost * 10);
          const innerGlowOpacity = focusBoost * 0.11;
          const topHighlightOpacity = focusBoost * 0.12;
          const faceShadeOpacity = focusBoost * 0.08;

          context.save();
          context.translate(cellCenterX, cellCenterY);
          context.translate(liftX, liftY);
          context.scale(scale, scale);
          context.translate(-cellCenterX, -cellCenterY);

          if (depthOpacity > 0.001) {
            context.fillStyle = `rgba(10,14,28,${depthOpacity.toFixed(4)})`;
            context.fillRect(x + shadowOffsetX * 0.18, y + shadowOffsetY * 0.5, GRID_SIZE, GRID_SIZE);
          }

          if (fillOpacity > 0.001) {
            context.fillStyle = `rgba(48,112,255,${fillOpacity.toFixed(4)})`;
            context.shadowColor = `rgba(12,20,58,${(focusBoost * 0.18).toFixed(4)})`;
            context.shadowBlur = shadowBlur;
            context.shadowOffsetX = shadowOffsetX;
            context.shadowOffsetY = shadowOffsetY;
            context.fillRect(x, y, GRID_SIZE, GRID_SIZE);
            context.shadowColor = "transparent";
            context.shadowBlur = 0;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
          }

          if (innerGlowOpacity > 0.001) {
            context.fillStyle = `rgba(86,148,255,${innerGlowOpacity.toFixed(4)})`;
            context.fillRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2);
          }

          if (faceShadeOpacity > 0.001) {
            context.fillStyle = `rgba(16,38,92,${faceShadeOpacity.toFixed(4)})`;
            context.fillRect(x + GRID_SIZE * 0.72, y + 1, GRID_SIZE * 0.24, GRID_SIZE - 2);
            context.fillRect(x + 1, y + GRID_SIZE * 0.76, GRID_SIZE - 2, GRID_SIZE * 0.2);
          }

          if (topHighlightOpacity > 0.001) {
            context.fillStyle = `rgba(255,255,255,${topHighlightOpacity.toFixed(4)})`;
            context.fillRect(x + 1, y + 1, GRID_SIZE - 2, Math.max(3, GRID_SIZE * 0.1));
          }

          context.strokeStyle = `rgba(0,0,0,${borderOpacity.toFixed(4)})`;
          context.lineWidth = 1;
          context.strokeRect(x, y, GRID_SIZE, GRID_SIZE);

          if (intensity > 0.001) {
            context.strokeStyle = `rgba(18,42,108,${(0.06 + focusBoost * 0.16).toFixed(4)})`;
            context.strokeRect(x + 0.5, y + 0.5, GRID_SIZE - 1, GRID_SIZE - 1);
          }
          context.restore();
        }
      }

      if (pointerTarget.active) {
        glow.style.opacity = glowOpacityRef.current.toFixed(3);
        glow.style.transform = `translate3d(${pointerCurrent.x}px, ${pointerCurrent.y}px, 0) translate(-50%, -50%)`;
      } else {
        glow.style.opacity = glowOpacityRef.current.toFixed(3);
      }

      frameRef.current = window.requestAnimationFrame(draw);
    };

    const handleMove = (event: MouseEvent) => {
      const rect = getRect();
      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      const isInside = localX >= 0 && localX <= rect.width && localY >= 0 && localY <= rect.height;

      if (!isInside) {
        if (scope === "container") {
          pointerTargetRef.current.active = false;
        }
        return;
      }

      pointerTargetRef.current = {
        x: localX,
        y: localY,
        active: true,
      };
    };

    const handleLeave = () => {
      pointerTargetRef.current.active = false;
    };

    resize();
    window.addEventListener("resize", resize);
    const resizeObserver =
      scope === "container"
        ? new ResizeObserver(() => resize())
        : null;
    resizeObserver?.observe(wrapper);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);

    frameRef.current = window.requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      resizeObserver?.disconnect();
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className={className}
      style={
        scope === "viewport"
          ? {
              position: "fixed",
              inset: 0,
              zIndex: 0,
              pointerEvents: "none",
              overflow: "hidden",
            }
          : {
              position: "absolute",
              inset: 0,
              zIndex: 0,
              pointerEvents: "none",
              overflow: "hidden",
            }
      }
    >
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: variant === "page" ? "380px" : "460px",
          height: variant === "page" ? "380px" : "460px",
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0,
          transform: "translate3d(-9999px, -9999px, 0)",
          background:
            variant === "page"
              ? "radial-gradient(circle, rgba(37,99,235,0.1) 0%, rgba(59,130,246,0.07) 24%, rgba(96,165,250,0.04) 44%, rgba(18,34,92,0.025) 62%, transparent 82%)"
              : "radial-gradient(circle, rgba(37,99,235,0.16) 0%, rgba(59,130,246,0.11) 24%, rgba(96,165,250,0.07) 44%, rgba(18,34,92,0.04) 62%, transparent 82%)",
          willChange: "transform, opacity",
          filter: variant === "page" ? "blur(8px)" : "blur(10px)",
        }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          display: "block",
          background: GRID_BACKGROUND,
        }}
      />
    </div>
  );
}
