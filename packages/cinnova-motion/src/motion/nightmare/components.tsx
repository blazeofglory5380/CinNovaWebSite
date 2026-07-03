import { Motion } from '../components/Motion';

export function FogLayer({ className }: { className?: string }) {
  return <Motion preset="nightmare.fog" className={className} aria-hidden><div style={{ inset: 0, position: 'absolute', background: 'rgb(148 163 184 / 0.25)' }} /></Motion>;
}

export function Fireflies({ count = 5, className }: { count?: number; className?: string }) {
  return (
    <div className={className} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <Motion key={i} preset="nightmare.fireflies" delay={i * 400} style={{ position: 'absolute', width: 4, height: 4, borderRadius: '50%', background: '#fbbf24' }}><span /></Motion>
      ))}
    </div>
  );
}

export function FloatingDust({ className }: { className?: string }) {
  return <Motion preset="nightmare.floatingDust" className={className} aria-hidden><span /></Motion>;
}

export function MagicEffect({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <Motion preset="nightmare.magic" className={className}>{children}</Motion>;
}

export function EnemySpawn({ children, className }: { children: React.ReactNode; className?: string }) {
  return <Motion preset="nightmare.enemySpawn" className={className}>{children}</Motion>;
}

export function PortalAnimation({ className }: { className?: string }) {
  return <Motion preset="nightmare.portal" className={className} aria-hidden><div style={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid #a78bfa' }} /></Motion>;
}

export function BossIntro({ children, className }: { children: React.ReactNode; className?: string }) {
  return <Motion preset="nightmare.bossIntro" className={className} essential>{children}</Motion>;
}
