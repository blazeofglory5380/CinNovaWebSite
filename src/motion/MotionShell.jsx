import { lazy, Suspense } from "react";
import { MOTION_ENABLED } from "./motionConfig.js";

const LazyMotionShell = MOTION_ENABLED
    ? lazy(() =>
          import("./MotionShellEnabled.jsx").then((module) => ({
              default: module.MotionShellEnabled,
          })),
      )
    : null;

export function MotionShell({ children }) {
    if (!MOTION_ENABLED || !LazyMotionShell) {
        return children;
    }

    return (
        <Suspense fallback={children}>
            <LazyMotionShell>{children}</LazyMotionShell>
        </Suspense>
    );
}
