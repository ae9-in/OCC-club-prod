"use client";

import { useEffect, useRef, useState } from "react";
import { useTransition } from "@/context/TransitionContext";

const entryMessages = [
  "CONNECTING TO OCC NETWORK",
  "SYNCING CLUB DATA", 
  "LOADING STUDENT COMMUNITIES",
  "INITIALIZING CAMPUS GRID",
  "ENTERING OCC"
];

export default function EntryOverlay() {
  const { isTransitioning, isEntryTransition } = useTransition();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | null>(null);
  const [currentMessage, setCurrentMessage] = useState(0);

  // Handle message rotation
  useEffect(() => {
    if (!isTransitioning || !isEntryTransition) return;

    const resetTimer = window.setTimeout(() => {
      setCurrentMessage(0);
    }, 0);

    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => {
        if (prev < entryMessages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 400); // Change message every 400ms for longer duration

    return () => {
      window.clearTimeout(resetTimer);
      clearInterval(messageInterval);
    };
  }, [isTransitioning, isEntryTransition]);

  useEffect(() => {
    if (!isTransitioning || !isEntryTransition) return;

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

    // Generate random scanline clusters for entry animation
    const clusters: Array<{ x: number; y: number; intensity: number; delay: number }> = [];
    for (let i = 0; i < 80; i++) { // More clusters for entry animation
      clusters.push({
        x: Math.random() * cols,
        y: Math.random() * rows,
        intensity: Math.random() * 0.9 + 0.1,
        delay: Math.random() * 500 // 0-500ms delay for burst sequence
      });
    }

    const render = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid background
      ctx.strokeStyle = `rgba(0, 0, 0, 0.08)`;
      ctx.lineWidth = 1;
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * gridSize;
          const y = row * gridSize;
          ctx.strokeRect(x, y, gridSize, gridSize);
        }
      }

      // Phase 1: Random scanline burst (0-600ms)
      if (elapsed < 600) {
        clusters.forEach((cluster) => {
          if (elapsed > cluster.delay) {
            const clusterElapsed = elapsed - cluster.delay;
            const clusterProgress = Math.min(clusterElapsed / 400, 1);
            const radius = clusterProgress * 120; // Spread radius
            
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
                    const opacity = intensity * 0.7;
                    
                    ctx.fillStyle = `rgba(20, 40, 255, ${opacity})`;
                    
                    for (let stripeX = x; stripeX < x + gridSize; stripeX += stripeSpacing) {
                      ctx.fillRect(stripeX, y, stripeWidth, gridSize);
                    }
                    
                    // Add cell highlight
                    if (intensity > 0.4) {
                      ctx.fillStyle = `rgba(20, 40, 255, ${intensity * 0.15})`;
                      ctx.fillRect(x, y, gridSize, gridSize);
                    }
                  }
                }
              }
            }
          }
        });
      }
      
      // Phase 2: Breathing scanlines (600-1900ms)
      else if (elapsed < 1900) {
        const breathingElapsed = elapsed - 600;
        const breathingCycles = breathingElapsed / 1200; // 1.2 second cycles
        const breathingIntensity = (Math.sin(breathingCycles * Math.PI * 2) * 0.35 + 0.4); // 40-75% range
        
        // Random scanline activation with breathing effect
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const x = col * gridSize;
            const y = row * gridSize;
            
            const randomSeed = Math.sin(col * 0.3) * Math.cos(row * 0.4) + Math.sin(col * 0.7) * Math.cos(row * 0.2);
            const shouldActivate = randomSeed > 0.2; // More activation for entry
            
            if (shouldActivate) {
              const cellIntensity = (randomSeed - 0.2) * breathingIntensity * 0.8;
              
              if (cellIntensity > 0.1) {
                // Breathing scanlines with subtle vertical movement
                const stripeWidth = 3;
                const stripeSpacing = 8;
                const opacity = cellIntensity;
                const verticalOffset = Math.sin(elapsed * 0.002 + col * 0.1) * 1.5;
                
                ctx.fillStyle = `rgba(20, 40, 255, ${opacity})`;
                
                for (let stripeX = x; stripeX < x + gridSize; stripeX += stripeSpacing) {
                  ctx.fillRect(stripeX, y + verticalOffset, stripeWidth, gridSize);
                }
                
                // Subtle cell highlight
                if (cellIntensity > 0.3) {
                  ctx.fillStyle = `rgba(20, 40, 255, ${cellIntensity * 0.12})`;
                  ctx.fillRect(x, y, gridSize, gridSize);
                }
              }
            }
          }
        }

        // Add occasional random bursts during breathing phase
        if (Math.random() < 0.02) { // 2% chance per frame
          const burstX = Math.random() * cols;
          const burstY = Math.random() * rows;
          const burstRadius = 3;
          
          for (let row = Math.max(0, Math.floor(burstY - burstRadius)); row < Math.min(rows, Math.ceil(burstY + burstRadius)); row++) {
            for (let col = Math.max(0, Math.floor(burstX - burstRadius)); col < Math.min(cols, Math.ceil(burstX + burstRadius)); col++) {
              const x = col * gridSize;
              const y = row * gridSize;
              
              const dx = col - burstX;
              const dy = row - burstY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < burstRadius) {
                const intensity = (1 - distance / burstRadius) * 0.6;
                
                ctx.fillStyle = `rgba(20, 40, 255, ${intensity})`;
                for (let stripeX = x; stripeX < x + gridSize; stripeX += 8) {
                  ctx.fillRect(stripeX, y, 3, gridSize);
                }
              }
            }
          }
        }
      }
      
      // Phase 3: Final fade (1900-2200ms)
      else if (elapsed < 2200) {
        const fadeProgress = (elapsed - 1900) / 300;
        const fadeOpacity = 1 - fadeProgress;
        
        // Gentle fade of remaining scanlines
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const x = col * gridSize;
            const y = row * gridSize;
            
            const randomSeed = Math.sin(col * 0.3) * Math.cos(row * 0.4);
            if (randomSeed > 0.4) {
              const cellIntensity = (randomSeed - 0.4) * fadeOpacity * 0.5;
              
              if (cellIntensity > 0.05) {
                ctx.fillStyle = `rgba(20, 40, 255, ${cellIntensity})`;
                for (let stripeX = x; stripeX < x + gridSize; stripeX += 8) {
                  ctx.fillRect(stripeX, y, 3, gridSize);
                }
              }
            }
          }
        }
      }

      if (elapsed < 2200) {
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
  }, [isTransitioning, isEntryTransition]);

  if (!isTransitioning || !isEntryTransition) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-auto">
      {/* Opaque background with OCC styling */}
      <div className="absolute inset-0 bg-brutal-gray"></div>
      
      {/* Canvas for scanline animations */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* System messages */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <h1 
            key={currentMessage}
            className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black mb-6 animate-pulse"
          >
            {entryMessages[currentMessage]}
          </h1>
          
          {/* Progress indicator */}
          <div className="flex justify-center gap-2 mb-8">
            {entryMessages.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 border-2 border-black transition-all duration-300 ${
                  index <= currentMessage ? 'bg-brutal-blue' : 'bg-white'
                }`}
              />
            ))}
          </div>
          
          {/* Animated underline */}
          <div className="w-48 h-1 bg-brutal-blue mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
