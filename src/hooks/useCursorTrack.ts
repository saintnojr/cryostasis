'use client';

import { useEffect } from 'react';
import { MotionValue } from 'framer-motion';

/**
 * Syncs a pair of MotionValues to the mouse position.
 * Used by the custom cursor and the CursorSpotlight in HeroSection.
 */
export function useCursorTrack(mouseX: MotionValue<number>, mouseY: MotionValue<number>) {
  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mouseX, mouseY]);
}
