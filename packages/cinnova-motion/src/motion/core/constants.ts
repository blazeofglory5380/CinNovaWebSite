import type { MotionDuration, MotionEasing } from './types';

/** CSS custom property names — align with @cinnova/tokens when present */
export const MOTION_CSS_VARS = {
  instant: '--cn-motion-instant',
  fast: '--cn-motion-fast',
  base: '--cn-motion-base',
  moderate: '--cn-motion-moderate',
  slow: '--cn-motion-slow',
  deliberate: '--cn-motion-deliberate',
  ease: '--cn-motion-ease',
  easeEnter: '--cn-motion-ease-enter',
  easeExit: '--cn-motion-ease-exit',
} as const;

/** Fallback ms values when design tokens are not loaded */
export const MOTION_DURATION_MS: Record<MotionDuration, number> = {
  instant: 0,
  fast: 150,
  base: 250,
  moderate: 300,
  slow: 400,
  deliberate: 500,
};

export const MOTION_EASING_CSS: Record<MotionEasing, string> = {
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  enter: 'cubic-bezier(0, 0, 0.2, 1)',
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
  linear: 'linear',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
};

export const MOTION_ROOT_CLASS = 'cn-motion-root';

export const MOTION_GPU_CLASS = 'cn-motion-gpu';

export const MOTION_REDUCED_CLASS = 'cn-motion-reduced';

export const DEFAULT_IN_VIEW_MARGIN = '0px 0px -10% 0px';

export const DEFAULT_STAGGER_MS = 60;

export const MOBILE_BREAKPOINT_PX = 768;
