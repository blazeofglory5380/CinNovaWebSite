import { Motion } from "@cinnova/motion";

export function MotionAiPanelWrapActive({ className, children, ...rest }) {
    return (
        <Motion as="div" preset="ai.pulse" className={className} inView inViewOnce {...rest}>
            {children}
        </Motion>
    );
}
