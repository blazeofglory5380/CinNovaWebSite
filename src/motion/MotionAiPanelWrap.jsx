import { lazy, Suspense } from "react";
import { MOTION_ENABLED } from "./motionConfig.js";

const LazyMotionAiPanelWrap = MOTION_ENABLED
    ? lazy(() =>
          import("./MotionAiPanelWrapActive.jsx").then((module) => ({
              default: module.MotionAiPanelWrapActive,
          })),
      )
    : null;

/** Subtle pulse for existing AI response panels — not for modals or forms. */
export function MotionAiPanelWrap({ className, children, ...rest }) {
    if (!MOTION_ENABLED || !LazyMotionAiPanelWrap) {
        return (
            <div className={className} {...rest}>
                {children}
            </div>
        );
    }

    return (
        <Suspense
            fallback={(
                <div className={className} {...rest}>
                    {children}
                </div>
            )}
        >
            <LazyMotionAiPanelWrap className={className} {...rest}>
                {children}
            </LazyMotionAiPanelWrap>
        </Suspense>
    );
}
