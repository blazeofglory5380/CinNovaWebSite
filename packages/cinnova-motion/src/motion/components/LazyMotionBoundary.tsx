import { useEffect } from 'react';
import '../motion.css';

let cssLoaded = false;

export function MotionStyles(): null {
  useEffect(() => {
    cssLoaded = true;
  }, []);
  return null;
}

export function LazyMotionBoundary({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const ready = true; // CSS import is sync when bundled; hook reserved for code-split chunks

  if (!ready) return fallback;
  return children;
}
