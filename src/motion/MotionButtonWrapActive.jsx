import { MotionButton } from "@cinnova/motion";

export function MotionButtonWrapActive({
    variant = "hover",
    className,
    children,
    ...rest
}) {
    return (
        <MotionButton variant={variant} className={className} {...rest}>
            {children}
        </MotionButton>
    );
}
