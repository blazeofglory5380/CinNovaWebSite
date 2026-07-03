import { Motion } from '../components/Motion';
import type { MotionConfig } from '../core/types';

export function ThinkingAnimation({ className, ...config }: MotionConfig & { className?: string }) {
  return (
    <Motion preset="ai.thinking" className={className} aria-hidden {...config}>
      <span className="cn-m-ai-dots" style={{ display: 'inline-flex', gap: 4 }}>
        <span>•</span>
        <span>•</span>
        <span>•</span>
      </span>
    </Motion>
  );
}

export function TypingIndicator({ className, ...config }: MotionConfig & { className?: string }) {
  return (
    <Motion preset="ai.typing" className={className} role="status" aria-label="Typing" {...config}>
      <span className="cn-m-loader-dots">
        <span />
        <span />
        <span />
      </span>
    </Motion>
  );
}

export function StreamingText({
  children,
  className,
  ...config
}: MotionConfig & { children: React.ReactNode; className?: string }) {
  return (
    <Motion preset="ai.streaming" className={className} {...config}>
      {children}
    </Motion>
  );
}

export function AIPulse({ className, ...config }: MotionConfig & { className?: string }) {
  return <Motion preset="ai.pulse" className={className} aria-hidden {...config}><span /></Motion>;
}

export function ProcessingRing({
  className,
  label = 'Processing',
  ...config
}: MotionConfig & { className?: string; label?: string }) {
  return (
    <Motion preset="ai.processingRing" className={className} essential role="status" aria-label={label} {...config}>
      <span className="cn-m-ai-processing-ring" style={{ display: 'inline-block', width: 24, height: 24 }} />
    </Motion>
  );
}

export function ConfidenceAnimation({
  percent,
  className,
  ...config
}: MotionConfig & { percent: number; className?: string }) {
  return (
    <Motion
      preset="ai.confidence"
      className={className}
      style={{ '--cn-ai-confidence': `${percent}%` } as React.CSSProperties}
      {...config}
    >
      <div style={{ height: 4, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'var(--cn-color-accent, #2563eb)', width: `${percent}%` }} />
      </div>
    </Motion>
  );
}
