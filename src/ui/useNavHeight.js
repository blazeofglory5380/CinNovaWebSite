import { useEffect } from "react";

/**
 * Measures the sticky nav and publishes its height as a CSS custom property
 * (default `--cn-nav-height`) on <html>, so fixed/sticky elements can sit
 * flush beneath it without hardcoding a pixel value.
 *
 * The nav is 89px tall by default but 81px at <=600px (padding drops 22px ->
 * 18px), and that will drift again if the nav is ever restyled. Measuring the
 * real element keeps dependents correct at every breakpoint and zoom level.
 *
 * Re-measures on resize, orientation change, and any layout change to the nav
 * itself (ResizeObserver) — e.g. when the mobile menu button wraps.
 */
export function useNavHeight(selector = "nav.navbar", varName = "--cn-nav-height") {
    useEffect(() => {
        const nav = document.querySelector(selector);
        if (!nav) return undefined;

        const root = document.documentElement;

        const apply = () => {
            const height = Math.round(nav.getBoundingClientRect().height);
            // Guard against a 0 reading (e.g. mid-transition) clobbering the
            // CSS fallback and pinning the bar to the top of the viewport.
            if (height > 0) root.style.setProperty(varName, `${height}px`);
        };

        apply();

        let observer;
        if (typeof ResizeObserver !== "undefined") {
            observer = new ResizeObserver(apply);
            observer.observe(nav);
        }
        window.addEventListener("resize", apply);
        window.addEventListener("orientationchange", apply);

        return () => {
            observer?.disconnect();
            window.removeEventListener("resize", apply);
            window.removeEventListener("orientationchange", apply);
        };
    }, [selector, varName]);
}
