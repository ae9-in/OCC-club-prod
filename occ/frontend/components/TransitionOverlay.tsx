"use client";

import { useEffect, useRef, useState } from "react";
import { useTransition } from "@/context/TransitionContext";

export default function TransitionOverlay() {
  const { isTransitioning, isEntryTransition } = useTransition();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isTransitioning || isEntryTransition) return; // Skip if entry transition

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();

    const gridSize = 30;
    const cols = Math.ceil(canvas.width / gridSize) + 2;
    const rows = Math.ceil(canvas.height / gridSize) + 2;

    // Generate random scanline clusters
    const clusters: Array<{ x: number; y: number; intensity: number; delay: number }> = [];
    for (let i = 0; i < 50; i++) {
      clusters.push({
        x: Math.random() * cols,
        y: Math.random() * rows,
        intensity: Math.random() * 0.8 + 0.2,
        delay: Math.random() * 300 // 0-300ms delay
      });
    }

    const render = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Phase 1: Random scanline burst (0-400ms)
      if (elapsed < 400) {
        const burstProgress = elapsed / 400;
        
        clusters.forEach((cluster) => {
          if (elapsed > cluster.delay) {
            const clusterElapsed = elapsed - cluster.delay;
            const clusterProgress = Math.min(clusterElapsed / 200, 1);
            const radius = clusterProgress * 150; // Spread radius
            
            // Draw scanlines around cluster center
            for (let row = 0; row < rows; row++) {
              for (let col = 0; col < cols; col++) {
                const x = col * gridSize;
                const y = row * gridSize;
                
                const dx = col - cluster.x;
                const dy = row - cluster.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < radius / gridSize) {
                  const intensity = cluster.intensity * (1 - distance / (radius / gridSize)) * clusterProgress;
                  
                  if (intensity > 0.1) {
                    // Draw vertical scanlines
                    const stripeWidth = 3;
                    const stripeSpacing = 8;
                    const opacity = intensity * 0.8;
                    
                    ctx.fillStyle = `rgba(20, 40, 255, ${opacity})`;
                    
                    for (let stripeX = x; stripeX < x + gridSize; stripeX += stripeSpacing) {
                      ctx.fillRect(stripeX, y, stripeWidth, gridSize);
                    }
                    
                    // Add cell highlight
                    if (intensity > 0.4) {
                      ctx.fillStyle = `rgba(20, 40, 255, ${intensity * 0.2})`;
                      ctx.fillRect(x, y, gridSize, gridSize);
                    }
                  }
                }
              }
            }
          }
        });
      }
      
      // Phase 2: Full screen breathing scanlines (400-800ms)
      else if (elapsed < 800) {
        const breathingProgress = (elapsed - 400) / 400;
        const breathingIntensity = Math.sin(breathingProgress * Math.PI * 3) * 0.5 + 0.5; // Breathing effect
        
        // Draw grid background
        ctx.strokeStyle = `rgba(0, 0, 0, 0.1)`;
        ctx.lineWidth = 1;
        
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const x = col * gridSize;
            const y = row * gridSize;
            
            ctx.strokeRect(x, y, gridSize, gridSize);
            
            // Random scanline activation with breathing effect
            const randomSeed = Math.sin(col * 0.3) * Math.cos(row * 0.4);
            const shouldActivate = randomSeed > 0.3;
            
            if (shouldActivate) {
              const cellIntensity = (randomSeed - 0.3) * breathingIntensity * 0.8;
              
              if (cellIntensity > 0.1) {
                // Breathing scanlines
                const stripeWidth = 3;
                const stripeSpacing = 8;
                const opacity = cellIntensity * (0.3 + breathingIntensity * 0.4); // 30-70% opacity range
                
                ctx.fillStyle = `rgba(20, 40, 255, ${opacity})`;
                
                for (let stripeX = x; stripeX < x + gridSize; stripeX += stripeSpacing) {
                  ctx.fillRect(stripeX, y + Math.sin(elapsed * 0.003 + col * 0.1) * 2, stripeWidth, gridSize);
                }
                
                // Subtle cell highlight
                if (cellIntensity > 0.3) {
                  ctx.fillStyle = `rgba(20, 40, 255, ${cellIntensity * 0.15})`;
                  ctx.fillRect(x, y, gridSize, gridSize);
                }
              }
            }
          }
        }
      }

      if (elapsed < 800) {
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    const handleResize = () => {
      updateCanvasSize();
    };

    window.addEventListener("resize", handleResize);
    startTimeRef.current = null;
    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mounted, isTransitioning, isEntryTransition]);

  if (!mounted || !isTransitioning || isEntryTransition) return null; // Don't show for entry transitions

  return (
    <div className={`fixed inset-0 z-[9999] ${isTransitioning ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Canvas for scanline animations */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'rgba(245, 245, 245, 0.95)' }} // Subtle overlay
      />
      
      {/* Loading text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center animate-pulse">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black mb-4">
            Entering OCC
          </h1>
          <div className="w-32 h-1 bg-brutal-blue mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}