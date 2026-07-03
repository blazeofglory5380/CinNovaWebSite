import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useMobileOptimized } from '../hooks/useMobileOptimized';
import type { MotionDuration, MotionEasing, MotionProviderValue } from './types';
import { MOTION_ROOT_CLASS } from './constants';
import { cn } from './utils';

const MotionContext = createContext<MotionProviderValue | null>(null);

export interface MotionProviderProps {
  children: ReactNode;
  /** Defer non-essential motion until after first paint */
  lazyMotion?: boolean;
  /** Reduce animation complexity on mobile viewports */
  mobileOptimized?: boolean;
  defaultDuration?: MotionDuration;
  defaultEasing?: MotionEasing;
  className?: string;
}

export function MotionProvider({
  children,
  lazyMotion = true,
  mobileOptimized = true,
  defaultDuration = 'base',
  defaultEasing = 'standard',
  className,
}: MotionProviderProps) {
  const reducedMotion = useReducedMotion();
  const isMobile = useMobileOptimized();

  const value = useMemo<MotionProviderValue>(
    () => ({
      reducedMotion,
      lazyMotion,
      mobileOptimized: mobileOptimized && isMobile,
      defaultDuration,
      defaultEasing,
    }),
    [reducedMotion, lazyMotion, mobileOptimized, isMobile, defaultDuration, defaultEasing],
  );

  return (
    <MotionContext.Provider value={value}>
      <div
        className={cn(
          MOTION_ROOT_CLASS,
          reducedMotion && 'cn-motion-root--reduced',
          value.mobileOptimized && 'cn-motion-root--mobile',
          className,
        )}
        data-reduced-motion={reducedMotion ? 'true' : 'false'}
      >
        {children}
      </div>
    </MotionContext.Provider>
  );
}

export function useMotionContext(): MotionProviderValue {
  const ctx = useContext(MotionContext);
  if (!ctx) {
    return {
      reducedMotion: false,
      lazyMotion: true,
      mobileOptimized: false,
      defaultDuration: 'base',
      defaultEasing: 'standard',
    };
  }
  return ctx;
}
