import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

/** Aligns with CinNova Design System motion tokens */
export type MotionDuration =
  | 'instant'
  | 'fast'
  | 'base'
  | 'moderate'
  | 'slow'
  | 'deliberate';

export type MotionEasing = 'standard' | 'enter' | 'exit' | 'linear' | 'spring';

export type MotionCategory =
  | 'page'
  | 'hero'
  | 'card'
  | 'ai'
  | 'dashboard'
  | 'button'
  | 'form'
  | 'list'
  | 'image'
  | 'loader'
  | 'kiddo'
  | 'nightmare'
  | 'realestate'
  | 'techmate'
  | 'poisonguard'
  | 'studynest'
  | 'effect';

export interface MotionPresetDefinition {
  /** Unique id, e.g. `hero.fadeUp` */
  id: string;
  category: MotionCategory;
  className: string;
  duration?: MotionDuration;
  easing?: MotionEasing;
  /** Runs even when prefers-reduced-motion is enabled */
  essential?: boolean;
  /** Apply GPU layer hints (transform/opacity only) */
  gpu?: boolean;
  description?: string;
}

export interface MotionConfig {
  duration?: MotionDuration;
  easing?: MotionEasing;
  delay?: number;
  stagger?: number;
  disabled?: boolean;
  essential?: boolean;
  className?: string;
  style?: CSSProperties;
}

export interface MotionProviderValue {
  reducedMotion: boolean;
  lazyMotion: boolean;
  mobileOptimized: boolean;
  defaultDuration: MotionDuration;
  defaultEasing: MotionEasing;
}

export interface MotionProps extends MotionConfig, Omit<HTMLAttributes<HTMLElement>, 'children'> {
  preset?: string;
  children?: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  inView?: boolean;
  inViewOnce?: boolean;
  inViewMargin?: string;
  inViewThreshold?: number;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
}

export interface MotionGroupProps extends MotionConfig {
  children: ReactNode;
  staggerChildren?: number;
  className?: string;
}

export interface Scene3DWrapperProps {
  children?: ReactNode;
  className?: string;
  fallback?: ReactNode;
  loading?: ReactNode;
  reducedMotionFallback?: ReactNode;
  onReady?: () => void;
  onError?: (error: Error) => void;
  lazy?: boolean;
  ariaLabel?: string;
}
