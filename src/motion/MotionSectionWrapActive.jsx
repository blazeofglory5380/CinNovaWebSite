import { Motion } from "@cinnova/motion";

export function MotionSectionWrapActive({ as: Tag = "div", className, children, ...rest }) {
    return (
        <Motion as={Tag} preset="hero.fadeUp" className={className} inView inViewOnce {...rest}>
            {children}
        </Motion>
    );
}
