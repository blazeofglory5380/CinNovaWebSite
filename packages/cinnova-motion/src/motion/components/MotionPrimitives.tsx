import { Motion } from './Motion';
import type { MotionConfig } from '../core/types';

export type CardMotionVariant = 'hoverLift' | 'glow' | 'tilt' | 'expand' | 'flip' | 'stack' | 'spotlight';

const MAP: Record<CardMotionVariant, string> = {
  hoverLift: 'card.hoverLift',
  glow: 'card.glow',
  tilt: 'card.tilt',
  expand: 'card.expand',
  flip: 'card.flip',
  stack: 'card.stack',
  spotlight: 'card.spotlight',
};

export function MotionCard({
  variant = 'hoverLift',
  children,
  className,
  active,
  ...config
}: MotionConfig & {
  variant?: CardMotionVariant;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}) {
  return (
    <Motion
      preset={MAP[variant]}
      className={[className, active && variant === 'hoverLift' ? 'cn-m-card-hover-lift--active' : ''].filter(Boolean).join(' ')}
      {...config}
    >
      {children}
    </Motion>
  );
}

export function MotionButton({
  variant = 'hover',
  children,
  className,
  loading,
  success,
  disabled,
  ...config
}: MotionConfig & {
  variant?: 'hover' | 'press' | 'ripple' | 'success' | 'loading' | 'disabled';
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  success?: boolean;
  disabled?: boolean;
}) {
  const preset = loading ? 'button.loading' : success ? 'button.success' : disabled ? 'button.disabled' : `button.${variant}`;
  return (
    <Motion preset={preset} className={className} essential={loading || success} disabled={disabled} {...config}>
      {children}
    </Motion>
  );
}

export function MotionFormField({
  state = 'default',
  children,
  className,
}: {
  state?: 'default' | 'validation' | 'success' | 'error' | 'loading' | 'focus';
  children: React.ReactNode;
  className?: string;
}) {
  const presetMap = {
    default: 'form.focusGlow',
    validation: 'form.validation',
    success: 'form.success',
    error: 'form.errorShake',
    loading: 'form.loading',
    focus: 'form.focusGlow',
  };
  return (
    <Motion preset={presetMap[state]} className={className} essential={state === 'error' || state === 'loading'}>
      {children}
    </Motion>
  );
}

export function MotionList({
  children,
  className,
  staggerChildren = 60,
}: {
  children: React.ReactNode;
  className?: string;
  staggerChildren?: number;
}) {
  return (
    <Motion preset="list.staggerReveal" className={className}>
      <div className="cn-motion-group" style={{ display: 'contents' }} data-stagger={staggerChildren}>
        {children}
      </div>
    </Motion>
  );
}

export function MotionImage({
  variant = 'lazyFade',
  children,
  className,
  inView = true,
}: {
  variant?: 'lazyFade' | 'blurIn' | 'kenBurns' | 'zoom' | 'pan';
  children: React.ReactNode;
  className?: string;
  inView?: boolean;
}) {
  return (
    <Motion preset={`image.${variant}`} className={className} inView={inView}>
      {children}
    </Motion>
  );
}
