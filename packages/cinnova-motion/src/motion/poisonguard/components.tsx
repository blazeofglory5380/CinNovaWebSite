import { Motion } from '../components/Motion';

export function ScanAnimation({ className }: { className?: string }) {
  return (
    <Motion preset="poisonguard.scan" className={className} essential style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="cn-m-pg-scan-line" aria-hidden />
    </Motion>
  );
}

export function RiskAnalysis({ level, className }: { level: 'low' | 'medium' | 'high'; className?: string }) {
  const colors = { low: '#16a34a', medium: '#d97706', high: '#dc2626' };
  return (
    <Motion
      preset="poisonguard.riskAnalysis"
      className={className}
      essential
      style={{ '--cn-pg-risk-color': colors[level] } as React.CSSProperties}
      role="status"
      aria-label={`Risk level ${level}`}
    >
      <span />
    </Motion>
  );
}

export function HazardPulse({ children, className }: { children: React.ReactNode; className?: string }) {
  return <Motion preset="poisonguard.hazardPulse" className={className}>{children}</Motion>;
}

export function ChemicalHighlight({ children, className }: { children: React.ReactNode; className?: string }) {
  return <Motion preset="poisonguard.chemicalHighlight" className={className} essential>{children}</Motion>;
}

export function ReportGeneration({ children, className }: { children: React.ReactNode; className?: string }) {
  return <Motion preset="poisonguard.reportGeneration" className={className} essential>{children}</Motion>;
}
