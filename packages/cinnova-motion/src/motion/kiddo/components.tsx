import { Motion } from '../components/Motion';
import type { MotionConfig } from '../core/types';

export function StarPop({ className, ...config }: MotionConfig & { className?: string }) {
  return <Motion preset="kiddo.stars" className={className} {...config}>⭐</Motion>;
}

export function BalloonRise({ children, className, ...config }: MotionConfig & { children?: React.ReactNode; className?: string }) {
  return <Motion preset="kiddo.balloons" className={className} {...config}>{children ?? '🎈'}</Motion>;
}

export function CharacterBounce({ children, className }: { children: React.ReactNode; className?: string }) {
  return <Motion preset="kiddo.characterBounce" className={className}>{children}</Motion>;
}

export function CelebrationBurst({ children, className }: { children: React.ReactNode; className?: string }) {
  return <Motion preset="kiddo.celebration" className={className}>{children}</Motion>;
}

export function WorldTransition({ children, className }: { children: React.ReactNode; className?: string }) {
  return <Motion preset="kiddo.worldTransition" className={className} essential>{children}</Motion>;
}

export function ReadingEffect({ children, className }: { children: React.ReactNode; className?: string }) {
  return <Motion preset="kiddo.readingEffect" className={className}>{children}</Motion>;
}
