import { lazy, Suspense } from "react";
import { MOTION_ENABLED } from "./motionConfig.js";

const LazyMotionButtonWrap = MOTION_ENABLED
    ? lazy(() =>
          import("./MotionButtonWrapActive.jsx").then((module) => ({
              default: module.MotionButtonWrapActive,
          })),
      )
    : null;

/**
 * Opt-in hover/press for standalone CTA buttons (not newsletter form submits).
 */
export function MotionButtonWrap({
    as: Tag = "button",
    variant = "hover",
    className,
    children,
    ...rest
}) {
    if (!MOTION_ENABLED || !LazyMotionButtonWrap || Tag !== "button") {
        return (
            <Tag className={className} {...rest}>
                {children}
            </Tag>
        );
    }

    return (
        <Suspense
            fallback={(
                <button type="button" className={className} {...rest}>
                    {children}
                </button>
            )}
        >
            <LazyMotionButtonWrap variant={variant} className={className} {...rest}>
                {children}
            </LazyMotionButtonWrap>
        </Suspense>
    );
}
