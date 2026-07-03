import { Motion } from '../components/Motion';
import { ThinkingAnimation } from '../ai';

export function FlashcardFlip({ children, className }: { children: React.ReactNode; className?: string }) {
  return <Motion preset="studynest.flashcard" className={className}>{children}</Motion>;
}

export function QuizResults({ children, className }: { children: React.ReactNode; className?: string }) {
  return <Motion preset="studynest.quizResults" className={className} essential>{children}</Motion>;
}

export function CourseProgress({ percent, className }: { percent: number; className?: string }) {
  return (
    <Motion
      preset="studynest.courseProgress"
      className={className}
      essential
      style={{ '--cn-sn-progress': `${percent}%` } as React.CSSProperties}
    >
      <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4 }}>
        <div className="cn-m-sn-course" style={{ height: '100%', background: '#7c3aed' }} />
      </div>
    </Motion>
  );
}

export function AchievementUnlock({ children, className }: { children: React.ReactNode; className?: string }) {
  return <Motion preset="studynest.achievementUnlock" className={className}>{children}</Motion>;
}

export function AITutorThinking({ className }: { className?: string }) {
  return <ThinkingAnimation className={className} />;
}
