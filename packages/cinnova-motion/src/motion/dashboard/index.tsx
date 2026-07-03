import { Motion } from '../components/Motion';
import { useCountUp } from '../hooks/useCountUp';
import type { MotionConfig, MotionDuration } from '../core/types';

export function KpiCountUp({
  value,
  suffix = '',
  duration = 'slow',
  className,
}: {
  value: number;
  suffix?: string;
  duration?: MotionDuration;
  className?: string;
}) {
  const display = useCountUp({ to: value, duration });
  return (
    <Motion preset="dashboard.kpiCountUp" className={className} essential>
      <span>{display}{suffix}</span>
    </Motion>
  );
}

export function ProgressBarFill({
  percent,
  className,
  ...config
}: MotionConfig & { percent: number; className?: string }) {
  return (
    <Motion preset="dashboard.progressFill" className={className} {...config}>
      <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
        <div
          className="cn-m-dash-progress"
          style={{ height: '100%', width: `${percent}%`, background: 'var(--cn-color-accent, #2563eb)' }}
        />
      </div>
    </Motion>
  );
}

export function CircularGaugeFill({
  percent,
  size = 64,
  className,
}: {
  percent: number;
  size?: number;
  className?: string;
}) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  return (
    <Motion preset="dashboard.gaugeFill" className={className}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} />
        <circle
          className="cn-m-dash-gauge"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--cn-color-accent, #2563eb)"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={c}
          style={{ '--cn-gauge-circumference': c, '--cn-gauge-offset': offset } as React.CSSProperties}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
    </Motion>
  );
}

export function TableRowReveal({
  children,
  index = 0,
  className,
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
}) {
  return (
    <Motion preset="dashboard.tableRowReveal" delay={index * 40} className={className}>
      {children}
    </Motion>
  );
}

export function NotificationSlideIn({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Motion preset="dashboard.notificationSlide" className={className} essential>
      {children}
    </Motion>
  );
}
