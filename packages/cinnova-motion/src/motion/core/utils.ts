import type { CSSProperties } from 'react';
import type { MotionConfig, MotionDuration, MotionEasing, MotionPresetDefinition } from './types';
import { MOTION_DURATION_MS, MOTION_EASING_CSS, MOTION_GPU_CLASS } from './constants';

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export function resolveDurationMs(
  duration: MotionDuration | undefined,
  fallback: MotionDuration = 'base',
): number {
  return MOTION_DURATION_MS[duration ?? fallback];
}

export function resolveEasing(easing: MotionEasing | undefined): string {
  return MOTION_EASING_CSS[easing ?? 'standard'];
}

export function buildMotionStyle(config: MotionConfig): CSSProperties {
  const duration = config.duration ?? 'base';
  const easing = config.easing ?? 'standard';
  const delay = config.delay ?? 0;

  return {
    ...config.style,
    '--cn-motion-delay': `${delay}ms`,
    '--cn-motion-duration': `${resolveDurationMs(duration)}ms`,
    '--cn-motion-easing': resolveEasing(easing),
  } as CSSProperties;
}

export function shouldAnimate(
  reducedMotion: boolean,
  config: MotionConfig,
  preset?: MotionPresetDefinition,
): boolean {
  if (config.disabled) return false;
  if (reducedMotion && !config.essential && !preset?.essential) return false;
  return true;
}

export function getPresetClasses(
  preset: MotionPresetDefinition | undefined,
  config: MotionConfig,
  reducedMotion: boolean,
): string {
  if (!preset) return config.className ?? '';

  const animate = shouldAnimate(reducedMotion, config, preset);
  if (!animate) {
    return cn('cn-motion-static', config.className);
  }

  return cn(
    'cn-motion',
    preset.className,
    preset.gpu !== false ? MOTION_GPU_CLASS : undefined,
    config.className,
  );
}

export function registerPresets<T extends MotionPresetDefinition>(
  presets: T[],
): Record<string, T> {
  return Object.fromEntries(presets.map((p) => [p.id, p]));
}

export function lazyImportMotionCss(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById('cinnova-motion-css')) return;

  const link = document.createElement('link');
  link.id = 'cinnova-motion-css';
  link.rel = 'stylesheet';
  link.href = new URL('../motion.css', import.meta.url).href;
  document.head.appendChild(link);
}
