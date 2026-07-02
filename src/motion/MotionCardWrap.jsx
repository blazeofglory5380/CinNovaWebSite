import { lazy, Suspense } from "react";
import { MOTION_ENABLED } from "./motionConfig.js";

const LazyMotionCardWrap = MOTION_ENABLED
    ? lazy(() =>
          import("./MotionCardWrapActive.jsx").then((module) => ({
              default: module.MotionCardWrapActive,
          })),
      )
    : null;

/**
 * Opt-in motion wrapper for product and blog cards.
 * Renders a plain element when VITE_MOTION_ENABLED is not true.
 */
export function MotionCardWrap({ as: Tag = "article", className, children, ...rest }) {
    if (!MOTION_ENABLED || !LazyMotionCardWrap) {
        return (
            <Tag className={className} {...rest}>
                {children}
            </Tag>
        );
    }

    return (
        <Suspense
            fallback={(
                <Tag className={className} {...rest}>
                    {children}
                </Tag>
            )}
        >
            <LazyMotionCardWrap as={Tag} className={className} {...rest}>
                {children}
            </LazyMotionCardWrap>
        </Suspense>
    );
}
