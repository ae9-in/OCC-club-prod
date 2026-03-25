"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

interface TransitionContextType {
  isTransitioning: boolean;
  isEntryTransition: boolean;
  triggerTransition: (targetRoute: string) => void;
  triggerEntryTransition: (targetRoute: string) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const shouldStartWithEntry = pathname === "/" || pathname === "/about";
  const [isTransitioning, setIsTransitioning] = useState(shouldStartWithEntry);
  const [isEntryTransition, setIsEntryTransition] = useState(shouldStartWithEntry);
  const resetTimeoutRef = useRef<number | null>(null);
  const hasHandledInitialEntryRef = useRef(false);

  useEffect(() => {
    if (hasHandledInitialEntryRef.current) return;

    hasHandledInitialEntryRef.current = true;
    if (!shouldStartWithEntry) return;

    const timer = window.setTimeout(() => {
      setIsTransitioning(false);
      setIsEntryTransition(false);
    }, 500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [shouldStartWithEntry]);

  useEffect(() => {
    if (!isTransitioning) return;

    if (resetTimeoutRef.current !== null) {
      window.clearTimeout(resetTimeoutRef.current);
    }

    resetTimeoutRef.current = window.setTimeout(() => {
      setIsTransitioning(false);
      setIsEntryTransition(false);
      resetTimeoutRef.current = null;
    }, 120);

    return () => {
      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, [pathname, isTransitioning]);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const triggerTransition = (targetRoute: string) => {
    if (isTransitioning) return;

    setIsEntryTransition(false);
    setIsTransitioning(true);

    window.setTimeout(() => {
      router.push(targetRoute);
    }, 150);
  };

  const triggerEntryTransition = (targetRoute: string) => {
    if (isTransitioning) return;

    setIsEntryTransition(true);
    setIsTransitioning(true);

    window.setTimeout(() => {
      router.push(targetRoute);
    }, 500);
  };

  return (
    <TransitionContext.Provider value={{ isTransitioning, isEntryTransition, triggerTransition, triggerEntryTransition }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
}
