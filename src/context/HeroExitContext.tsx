'use client';

import React, { createContext, useContext, useRef, useCallback } from 'react';

/* ─── The registered handler is the HeroSection's outro trigger ─────────── */
type ExitHandler = () => Promise<void>;

interface HeroExitContextValue {
  /** HeroSection calls this on mount to register its outro function */
  register:    (fn: ExitHandler) => void;
  /** Header calls this; awaits the registered outro, then navigates */
  triggerExit: () => Promise<void>;
}

const HeroExitContext = createContext<HeroExitContextValue | null>(null);

export function HeroExitProvider({ children }: { children: React.ReactNode }) {
  const handlerRef = useRef<ExitHandler | null>(null);

  const register = useCallback((fn: ExitHandler) => {
    handlerRef.current = fn;
    return () => { handlerRef.current = null; }; // cleanup on unmount
  }, []);

  const triggerExit = useCallback((): Promise<void> => {
    if (handlerRef.current) return handlerRef.current();
    return Promise.resolve();
  }, []);

  return (
    <HeroExitContext.Provider value={{ register, triggerExit }}>
      {children}
    </HeroExitContext.Provider>
  );
}

export function useHeroExit() {
  const ctx = useContext(HeroExitContext);
  if (!ctx) throw new Error('useHeroExit must be inside <HeroExitProvider>');
  return ctx;
}
