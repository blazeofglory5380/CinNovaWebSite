import { useEffect, useState, type ReactNode } from 'react';
import { Motion } from '../components/Motion';
import type { MotionConfig } from '../core/types';

export interface CrossfadeTransitionProps extends MotionConfig {
  children: ReactNode;
  activeKey: string | number;
  className?: string;
}

export function CrossfadeTransition({
  children,
  activeKey,
  className,
  ...config
}: CrossfadeTransitionProps) {
  const [displayKey, setDisplayKey] = useState(activeKey);

  useEffect(() => {
    setDisplayKey(activeKey);
  }, [activeKey]);

  return (
    <Motion preset="page.crossfade" className={className} key={displayKey} {...config}>
      {children}
    </Motion>
  );
}
