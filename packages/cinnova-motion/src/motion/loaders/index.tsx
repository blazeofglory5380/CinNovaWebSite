import { Motion } from '../components/Motion';
import type { MotionConfig } from '../core/types';

export function MotionSpinner({ className, label }: { className?: string; label?: string }) {
  return (
    <Motion preset="loader.spinner" className={className} essential role="status" aria-label={label ?? 'Loading'}>
      <span className="cn-m-loader-spinner" />
    </Motion>
  );
}

export function MotionSkeleton({
  width = '100%',
  height = 16,
  className,
}: {
  width?: string | number;
  height?: string | number;
  className?: string;
}) {
  return (
    <Motion preset="loader.skeleton" className={className} essential aria-hidden>
      <span className="cn-m-loader-skeleton" style={{ display: 'block', width, height, borderRadius: 4 }} />
    </Motion>
  );
}

export function MotionDots({ className }: { className?: string }) {
  return (
    <Motion preset="loader.dots" className={className} essential aria-hidden>
      <span className="cn-m-loader-dots">
        <span />
        <span />
        <span />
      </span>
    </Motion>
  );
}

export function MotionBar({ percent, className }: { percent: number; className?: string }) {
  return (
    <Motion preset="loader.bar" className={className} essential>
      <div style={{ height: 4, background: '#e2e8f0', borderRadius: 2 }}>
        <div style={{ width: `${percent}%`, height: '100%', background: 'var(--cn-color-accent, #2563eb)' }} />
      </div>
    </Motion>
  );
}
