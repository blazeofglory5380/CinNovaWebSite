import { useEffect, useState } from 'react';
import { useMotionContext } from '../core/MotionProvider';

export function useLazyMotion(): boolean {
  const { lazyMotion, reducedMotion } = useMotionContext();
  const [ready, setReady] = useState(!lazyMotion || reducedMotion);

  useEffect(() => {
    if (!lazyMotion || reducedMotion) {
      setReady(true);
      return;
    }

    const id = requestAnimationFrame(() => {
      setReady(true);
    });

    return () => cancelAnimationFrame(id);
  }, [lazyMotion, reducedMotion]);

  return ready;
}
