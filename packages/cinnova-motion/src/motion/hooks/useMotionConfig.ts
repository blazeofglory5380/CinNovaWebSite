import type { CSSProperties } from 'react';
import { useMemo } from 'react';
import { useMotionContext } from '../core/MotionProvider';
import type { MotionConfig } from '../core/types';
import { buildMotionStyle } from '../core/utils';

export function useMotionConfig(overrides: MotionConfig = {}): {
  style: CSSProperties;
  disabled: boolean;
} {
  const ctx = useMotionContext();

  return useMemo(() => {
    const disabled =
      overrides.disabled ||
      (ctx.reducedMotion && !overrides.essential) ||
      false;

    const duration = overrides.duration ?? ctx.defaultDuration;
    const easing = overrides.easing ?? ctx.defaultEasing;

    return {
      disabled,
      style: buildMotionStyle({ ...overrides, duration, easing }),
    };
  }, [ctx, overrides]);
}
