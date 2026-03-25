"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowDownRight, Info, Search, Sparkles } from "lucide-react";
import { useTransition } from "@/context/TransitionContext";
import SiteContainer from "@/components/SiteContainer";

interface EnhancedHeroProps {
  onCampusClick?: () => void;
}

export default function EnhancedHero({ onCampusClick }: EnhancedHeroProps) {
  const { triggerTransition, isTransitioning } = useTransition();
  const offRef = useRef<HTMLSpanElement | null>(null);
  const clubsRef = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const handleCampusClick = () => {
    if (isTransitioning) return;
    
    if (onCampusClick) {
      onCampusClick();
    } else {
      // Default behavior: navigate to feeds
      triggerTransition("/feeds");
    }
  };

  const handleNavigation = (e: React.MouseEvent, route: string) => {
    e.preventDefault();
    if (isTransitioning) return;
    triggerTransition(route);
  };

  useEffect(() => {
    const updateTransforms = (x: number, y: number) => {
      if (offRef.current) {
        offRef.current.style.transform = `translate(${x * -3}px, ${y * -3}px)`;
      }
      if (clubsRef.current) {
        clubsRef.current.style.transform = `translate(${x * -2}px, ${y * 6}px)`;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = window.requestAnimationFrame(() => {
        updateTransforms(x, y);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <SiteContainer
      as="section"
      className="relative z-10 flex min-h-screen flex-col items-center justify-center py-16 text-center md:py-32"
    >
        <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter text-black leading-[0.85] mb-8">
          <span
            ref={offRef}
            className="inline-block animate-slideUp"
            style={{
              animationDelay: "100ms",
              animationFillMode: "both",
              transform: "translate(0px, 0px)",
              transition: "transform 0.3s ease-out",
            }}
          >
            Off
          </span>{" "}
          <br />
          <button
            className="text-white bg-black px-6 border-4 border-black inline-block skew-x-[-4deg] shadow-[10px_10px_0_0_#1d2cf3] mt-2 hover:-translate-y-2 hover:translate-x-1 hover:shadow-[14px_14px_0_0_#1d2cf3] hover:scale-[1.02] transition-all duration-200 cursor-pointer animate-slideUp font-black uppercase text-7xl md:text-9xl tracking-tighter leading-[0.85]"
            style={{
              animationDelay: "200ms",
              animationFillMode: "both",
              pointerEvents: "auto",
            }}
            onClick={handleCampusClick}
          >
            Campus
          </button>
          <br />
          <span
            ref={clubsRef}
            className="inline-block animate-slideUp"
            style={{
              animationDelay: "300ms",
              animationFillMode: "both",
              transform: "translate(0px, 0px)",
              transition: "transform 0.3s ease-out",
            }}
          >
            Clubs.
          </span>
        </h1>

        <p
          className="max-w-2xl text-xl md:text-3xl font-black text-black border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_#000] my-12 -rotate-1 relative group animate-fadeIn"
          style={{
            animationDelay: "400ms",
            animationFillMode: "both",
          }}
        >
          <span className="absolute -top-6 -right-6 bg-brutal-blue text-white p-4 border-4 border-black group-hover:rotate-12 transition-transform">
            <Sparkles className="w-8 h-8" />
          </span>
          The ultimate platform for college student clubs. Join clubs, host events, and build your network.
        </p>

        <div
          className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-6 mt-4 animate-fadeIn"
          style={{
            animationDelay: "500ms",
            animationFillMode: "both",
          }}
        >
          <Link
            href="/login"
            onClick={(e) => handleNavigation(e, "/login")}
            className="bg-black text-white px-12 py-6 font-black uppercase text-2xl border-4 border-black shadow-[10px_10px_0_0_#1d2cf3] hover:shadow-[14px_14px_0_0_#1d2cf3] hover:-translate-y-1 hover:translate-x-1 transition-all duration-200 flex items-center gap-4 group"
            style={{ pointerEvents: "auto" }}
          >
            Enter App <ArrowDownRight className="w-8 h-8 group-hover:rotate-45 transition-transform" />
          </Link>
          <Link
            href="/clubs"
            onClick={(e) => handleNavigation(e, "/clubs")}
            className="bg-white text-black px-12 py-6 font-black uppercase text-2xl border-4 border-black shadow-[10px_10px_0_0_#000] hover:shadow-[14px_14px_0_0_#000] hover:-translate-y-1 hover:translate-x-1 transition-all duration-200 flex items-center gap-4 group"
            style={{ pointerEvents: "auto" }}
          >
            Find Clubs <Search className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </Link>
          <Link
            href="/about"
            onClick={(e) => handleNavigation(e, "/about")}
            className="bg-brutal-blue text-white px-12 py-6 font-black uppercase text-2xl border-4 border-black shadow-[10px_10px_0_0_#000] hover:shadow-[14px_14px_0_0_#000] hover:-translate-y-1 hover:translate-x-1 transition-all duration-200 flex items-center gap-4 group"
            style={{ pointerEvents: "auto" }}
          >
            Find Out More <Info className="w-8 h-8 group-hover:rotate-12 transition-transform" />
          </Link>
        </div>
    </SiteContainer>
  );
}
