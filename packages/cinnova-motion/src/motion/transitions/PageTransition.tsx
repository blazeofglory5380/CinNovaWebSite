import type { ReactNode } from 'react';
import { Motion } from '../components/Motion';
import type { MotionConfig } from '../core/types';

export type PageTransitionVariant = 'fade' | 'slide' | 'scale' | 'crossfade';

const PRESET_MAP: Record<PageTransitionVariant, string> = {
  fade: 'page.fade',
  slide: 'page.slide',
  scale: 'page.scale',
  crossfade: 'page.crossfade',
};

export interface PageTransitionProps extends MotionConfig {
  children: ReactNode;
  variant?: PageTransitionVariant;
  className?: string;
}

export function PageTransition({
  children,
  variant = 'fade',
  className,
  ...config
}: PageTransitionProps) {
  return (
    <Motion preset={PRESET_MAP[variant]} className={className} essential {...config}>
      {children}
    </Motion>
  );
}
