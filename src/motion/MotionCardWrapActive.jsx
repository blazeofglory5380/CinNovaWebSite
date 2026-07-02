import { Motion } from "@cinnova/motion";

export function MotionCardWrapActive({ as: Tag = "article", className, children, ...rest }) {
    return (
        <Motion
            as={Tag}
            preset="card.hoverLift"
            className={className}
            inView
            inViewOnce
            {...rest}
        >
            {children}
        </Motion>
    );
}
