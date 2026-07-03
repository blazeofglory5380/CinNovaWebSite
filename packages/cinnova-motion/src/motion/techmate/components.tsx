import { Motion } from '../components/Motion';
import { StreamingText } from '../ai';

export function CodeStreaming({ children, className }: { children: React.ReactNode; className?: string }) {
  return <Motion preset="techmate.codeStreaming" className={className}><code>{children}</code></Motion>;
}

export function TerminalTyping({ text, className }: { text: string; className?: string }) {
  return (
    <Motion preset="techmate.terminalTyping" className={className}>
      <pre>{text}<span className="cn-m-tm-terminal">▌</span></pre>
    </Motion>
  );
}

export function GitDiffReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return <Motion preset="techmate.gitDiffReveal" className={className}>{children}</Motion>;
}

export function AICodeReview({ children, className }: { children: React.ReactNode; className?: string }) {
  return <StreamingText className={className}>{children}</StreamingText>;
}

export function BuildProgress({ percent, className }: { percent: number; className?: string }) {
  return (
    <Motion preset="techmate.buildProgress" className={className} essential style={{ '--cn-motion-duration': '400ms' } as React.CSSProperties}>
      <div className="cn-m-tm-build" style={{ height: 6, width: `${percent}%`, background: 'var(--cn-color-accent, #06b6d4)' }} />
    </Motion>
  );
}
