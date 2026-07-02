import { lazy, Suspense } from "react";
import { MOTION_ENABLED } from "./motionConfig.js";

const LazyMotionHeroWrap = MOTION_ENABLED
    ? lazy(() =>
          import("./MotionHeroWrapActive.jsx").then((module) => ({
              default: module.MotionHeroWrapActive,
          })),
      )
    : null;

export function MotionHeroWrap({ children, className }) {
    if (!MOTION_ENABLED || !LazyMotionHeroWrap) {
        return children;
    }

    return (
        <Suspense fallback={children}>
            <LazyMotionHeroWrap className={className}>{children}</LazyMotionHeroWrap>
        </Suspense>
    );
}
