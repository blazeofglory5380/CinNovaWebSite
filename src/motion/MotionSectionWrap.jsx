import { lazy, Suspense } from "react";
import { MOTION_ENABLED } from "./motionConfig.js";

const LazyMotionSectionWrap = MOTION_ENABLED
    ? lazy(() =>
          import("./MotionSectionWrapActive.jsx").then((module) => ({
              default: module.MotionSectionWrapActive,
          })),
      )
    : null;

export function MotionSectionWrap({ as: Tag = "div", className, children, ...rest }) {
    if (!MOTION_ENABLED || !LazyMotionSectionWrap) {
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
            <LazyMotionSectionWrap as={Tag} className={className} {...rest}>
                {children}
            </LazyMotionSectionWrap>
        </Suspense>
    );
}
