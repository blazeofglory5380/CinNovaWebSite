import { useEffect } from "react";
import { prefersReducedMotion } from "./useReducedMotion.js";

const READY_CLASS = "cn-reveal-ready";
const TARGET_SELECTOR = ".reveal-on-scroll";
const REVEALED_CLASS = "is-revealed";

/**
 * Reveals `.reveal-on-scroll` elements as they enter the viewport.
 *
 * Safety properties:
 *  - No-JS safe. The CSS hidden state is scoped to `html.cn-reveal-ready`,
 *    which only this hook adds. If JS never runs, content renders visible.
 *  - Reduced-motion safe. When reduce is requested we never add the ready
 *    class, so nothing is ever hidden or animated.
 *  - Reveal is one-way; elements are unobserved once shown.
 *
 * @param {Array} deps Re-scan triggers. Pass the router's page/slug state so
 *                     newly mounted views get observed after a route change.
 */
export function useScrollReveal(deps = []) {
    useEffect(() => {
        const root = document.documentElement;

        // Reduced motion, or no IntersectionObserver: show everything, do nothing.
        if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
            root.classList.remove(READY_CLASS);
            document
                .querySelectorAll(TARGET_SELECTOR)
                .forEach((el) => el.classList.add(REVEALED_CLASS));
            return undefined;
        }

        root.classList.add(READY_CLASS);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add(REVEALED_CLASS);
                    observer.unobserve(entry.target);
                });
            },
            // Trigger slightly before the element is fully on screen.
            { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
        );

        const targets = document.querySelectorAll(TARGET_SELECTOR);
        targets.forEach((el) => {
            if (el.classList.contains(REVEALED_CLASS)) return;

            // Anything already within the viewport on mount (e.g. above the
            // fold after a route change) is shown immediately, so the first
            // paint is never blank.
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add(REVEALED_CLASS);
                return;
            }
            observer.observe(el);
        });

        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}
