"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface TransitionContextType {
  isTransitioning: boolean;
  isEntryTransition: boolean;
  triggerTransition: (targetRoute: string) => void;
  triggerEntryTransition: (targetRoute: string) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isEntryTransition, setIsEntryTransition] = useState(false);
  const router = useRouter();

  const triggerTransition = (targetRoute: string) => {
    // Disabled - navigate directly without transition
    router.push(targetRoute);
  };

  const triggerEntryTransition = (targetRoute: string) => {
    // Disabled - navigate directly without transition
    router.push(targetRoute);
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