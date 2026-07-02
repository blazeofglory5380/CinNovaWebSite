import "@cinnova/motion";
import { MotionProvider } from "@cinnova/motion";

export function MotionShellEnabled({ children }) {
    return (
        <MotionProvider lazyMotion mobileOptimized>
            {children}
        </MotionProvider>
    );
}
