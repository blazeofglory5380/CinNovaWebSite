import { HeroMotion } from "@cinnova/motion";

export function MotionHeroWrapActive({ children, className }) {
    return (
        <HeroMotion variant="fadeUp" className={className} inView inViewOnce>
            {children}
        </HeroMotion>
    );
}
