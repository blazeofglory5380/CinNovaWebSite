import { Motion } from '../components/Motion';
import { CircularGaugeFill } from '../dashboard';

export function HouseTransformation({ children, className }: { children: React.ReactNode; className?: string }) {
  return <Motion preset="realestate.houseTransformation" className={className}>{children}</Motion>;
}

export function BeforeAfterSlider({ className }: { className?: string }) {
  return <Motion preset="realestate.beforeAfterSlider" className={className} aria-hidden><div className="cn-m-re-slider" style={{ height: '100%', width: '50%', background: 'rgb(37 99 235 / 0.2)' }} /></Motion>;
}

export function ScoreGauge({ percent, className }: { percent: number; className?: string }) {
  return <CircularGaugeFill percent={percent} className={className} />;
}

export function ROIAnimation({ children, className }: { children: React.ReactNode; className?: string }) {
  return <Motion preset="realestate.roiAnimation" className={className}>{children}</Motion>;
}

export function PropertyComparison({ children, index = 0, className }: { children: React.ReactNode; index?: number; className?: string }) {
  return <Motion preset="realestate.propertyComparison" delay={index * 80} className={className}>{children}</Motion>;
}
