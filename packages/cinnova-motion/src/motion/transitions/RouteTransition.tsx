import type { ReactNode } from 'react';
import { Motion } from '../components/Motion';
import type { MotionConfig } from '../core/types';

export interface RouteTransitionProps extends MotionConfig {
  children: ReactNode;
  routeKey: string | number;
  className?: string;
}

/** Wrap route outlet; re-animates when routeKey changes */
export function RouteTransition({
  children,
  routeKey,
  className,
  ...config
}: RouteTransitionProps) {
  return (
    <Motion
      key={routeKey}
      preset="route.transition"
      className={className}
      essential
      {...config}
    >
      {children}
    </Motion>
  );
}
