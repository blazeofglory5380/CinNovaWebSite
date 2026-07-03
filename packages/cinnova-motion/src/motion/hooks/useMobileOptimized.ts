import { useEffect, useState } from 'react';
import { MOBILE_BREAKPOINT_PX } from '../core/constants';

const QUERY = `(max-width: ${MOBILE_BREAKPOINT_PX}px)`;

export function useMobileOptimized(): boolean {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const media = window.matchMedia(QUERY);
    const update = () => setMobile(media.matches);
    update();

    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return mobile;
}
