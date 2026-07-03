import {
  useEffect,
  useMemo,
  type CSSProperties,
  type ElementType,
  type Ref,
} from 'react';
import { getPreset } from '../core/presetRegistry';
import { useMotionContext } from '../core/MotionProvider';
import { buildMotionStyle, cn, getPresetClasses, shouldAnimate } from '../core/utils';
import type { MotionProps } from '../core/types';
import { useInView } from '../hooks/useInView';
import { useLazyMotion } from '../hooks/useLazyMotion';

export function Motion({
  preset,
  children,
  as: Component = 'div',
  inView = false,
  inViewOnce = true,
  inViewMargin,
  inViewThreshold,
  duration,
  easing,
  delay,
  disabled,
  essential,
  className,
  style,
  onAnimationStart,
  onAnimationEnd,
  ...rest
}: MotionProps) {
  const ctx = useMotionContext();
  const lazyReady = useLazyMotion();
  const presetDef = preset ? getPreset(preset) : undefined;

  const [ref, visible] = useInView({
    once: inViewOnce,
    margin: inViewMargin,
    threshold: inViewThreshold,
    disabled: !inView,
  });

  const config = useMemo(
    () => ({
      duration: duration ?? ctx.defaultDuration,
      easing: easing ?? ctx.defaultEasing,
      delay,
      disabled: disabled || !lazyReady,
      essential,
      className,
      style,
    }),
    [duration, easing, delay, disabled, lazyReady, essential, className, style, ctx],
  );

  const animate = shouldAnimate(ctx.reducedMotion, config, presetDef);
  const show = !inView || visible;

  const classes = getPresetClasses(presetDef, config, ctx.reducedMotion);
  const motionStyle = buildMotionStyle(config) as CSSProperties;

  const combinedStyle: CSSProperties = {
    ...motionStyle,
    ...(show ? {} : { opacity: 0 }),
  };

  useEffect(() => {
    if (animate && show) onAnimationStart?.();
  }, [animate, show, onAnimationStart]);

  const Tag = Component as ElementType;

  return (
    <Tag
      ref={inView ? (ref as Ref<HTMLElement>) : undefined}
      className={cn(classes, essential && 'cn-motion-essential', !animate && 'cn-motion-static')}
      style={combinedStyle}
      data-motion-preset={preset}
      onAnimationEnd={onAnimationEnd}
      {...rest}
    >
      {children}
    </Tag>
  );
}
