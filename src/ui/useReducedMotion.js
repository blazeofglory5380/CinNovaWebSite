import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/** True when the OS/browser asks for reduced motion. Updates live if toggled. */
export function useReducedMotion() {
    const [reduced, setReduced] = useState(() => {
        if (typeof window === "undefined" || !window.matchMedia) return false;
        return window.matchMedia(QUERY).matches;
    });

    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return undefined;
        const mql = window.matchMedia(QUERY);
        const onChange = (event) => setReduced(event.matches);
        mql.addEventListener("change", onChange);
        return () => mql.removeEventListener("change", onChange);
    }, []);

    return reduced;
}

/** Non-reactive read, for use outside React render (effects, one-shot checks). */
export function prefersReducedMotion() {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(QUERY).matches;
}
