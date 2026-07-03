import { useMemo } from 'react';
import { DEFAULT_STAGGER_MS } from '../core/constants';

export function useStaggerDelay(index: number, staggerMs = DEFAULT_STAGGER_MS): number {
  return useMemo(() => index * staggerMs, [index, staggerMs]);
}

export function useStaggerChildren(count: number, staggerMs = DEFAULT_STAGGER_MS): number[] {
  return useMemo(
    () => Array.from({ length: count }, (_, i) => i * staggerMs),
    [count, staggerMs],
  );
}
