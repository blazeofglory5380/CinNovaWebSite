import { useEffect, useState } from "react";

/**
 * True once the page has scrolled past `offset`. Drives the `is-scrolled`
 * class on the sticky nav (stronger glass + subtle shadow).
 *
 * Cheap by design: a passive listener flipping one boolean, so React only
 * re-renders on the two transitions rather than on every scroll frame.
 */
export function useStickyNav(offset = 8) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        function onScroll() {
            setScrolled(window.scrollY > offset);
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, [offset]);

    return scrolled;
}
