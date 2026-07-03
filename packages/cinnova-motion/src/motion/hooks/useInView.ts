import { useEffect, useRef, useState, type RefObject } from 'react';
import { DEFAULT_IN_VIEW_MARGIN } from '../core/constants';

export interface UseInViewOptions {
  once?: boolean;
  margin?: string;
  threshold?: number;
  disabled?: boolean;
}

export function useInView({
  once = true,
  margin = DEFAULT_IN_VIEW_MARGIN,
  threshold = 0.1,
  disabled = false,
}: UseInViewOptions = {}): [RefObject<HTMLElement | null>, boolean] {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(disabled);

  useEffect(() => {
    if (disabled) {
      setInView(true);
      return;
    }

    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin: margin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, margin, threshold, disabled]);

  return [ref, inView];
}
