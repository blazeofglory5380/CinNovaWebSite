import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';
import { resolveDurationMs } from '../core/utils';
import type { MotionDuration } from '../core/types';

export interface UseCountUpOptions {
  from?: number;
  to: number;
  duration?: MotionDuration;
  decimals?: number;
  disabled?: boolean;
  onComplete?: () => void;
}

export function useCountUp({
  from = 0,
  to,
  duration = 'slow',
  decimals = 0,
  disabled = false,
  onComplete,
}: UseCountUpOptions): number {
  const reducedMotion = useReducedMotion();
  const [value, setValue] = useState(reducedMotion || disabled ? to : from);
  const rafRef = useRef(0);
  const startRef = useRef(0);

  useEffect(() => {
    if (disabled || reducedMotion) {
      setValue(to);
      return;
    }

    const ms = resolveDurationMs(duration);
    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(1, elapsed / ms);
      const eased = 1 - (1 - progress) ** 3;
      const next = from + (to - from) * eased;
      setValue(Number(next.toFixed(decimals)));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        onComplete?.();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [from, to, duration, decimals, disabled, reducedMotion, onComplete]);

  return value;
}
