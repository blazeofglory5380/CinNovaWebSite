import { Motion } from '../components/Motion';
import type { MotionConfig } from '../core/types';

export type HeroVariant = 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'reveal' | 'zoom';

const MAP: Record<HeroVariant, string> = {
  fadeUp: 'hero.fadeUp',
  fadeLeft: 'hero.fadeLeft',
  fadeRight: 'hero.fadeRight',
  reveal: 'hero.reveal',
  zoom: 'hero.zoom',
};

export function HeroMotion({
  variant = 'fadeUp',
  children,
  className,
  inView,
  ...config
}: MotionConfig & {
  variant?: HeroVariant;
  children: React.ReactNode;
  className?: string;
  inView?: boolean;
}) {
  return (
    <Motion preset={MAP[variant]} className={className} inView={inView} {...config}>
      {children}
    </Motion>
  );
}

export function FloatingBackground({ className }: { className?: string }) {
  return <div className={`cn-m-hero-float-bg cn-motion-gpu ${className ?? ''}`} aria-hidden />;
}

export function AnimatedGradient({ className }: { className?: string }) {
  return (
    <div
      className={`cn-m-hero-gradient cn-motion-gpu ${className ?? ''}`}
      style={{
        background: 'linear-gradient(135deg, var(--cn-color-accent-subtle, #dbeafe), var(--cn-color-bg-surface-subtle, #f1f5f9))',
      }}
      aria-hidden
    />
  );
}
