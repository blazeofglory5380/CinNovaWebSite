import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { cn } from '../core/utils';
import type { MotionGroupProps } from '../core/types';
import { useStaggerDelay } from '../hooks/useStagger';

function MotionGroupItem({
  index,
  staggerMs,
  children,
}: {
  index: number;
  staggerMs: number;
  children: ReactNode;
}) {
  const delay = useStaggerDelay(index, staggerMs);
  if (!isValidElement(children)) return children;
  return cloneElement(children as ReactElement<{ delay?: number }>, { delay });
}

export function MotionGroup({
  children,
  staggerChildren = 60,
  className,
}: MotionGroupProps) {
  const items = Children.toArray(children);

  return (
    <div className={cn('cn-motion-group', className)} role="presentation">
      {items.map((child, index) => (
        <MotionGroupItem key={index} index={index} staggerMs={staggerChildren}>
          {child}
        </MotionGroupItem>
      ))}
    </div>
  );
}

export const MotionGroupSafe = MotionGroup;
