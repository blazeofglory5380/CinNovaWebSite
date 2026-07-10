import { useContext } from "react";
import { ToastContext } from "./toastContext.js";

const NOOP_TOAST = { showToast: () => undefined, dismissToast: () => undefined };

/**
 * Returns { showToast, dismissToast }.
 *
 * Safe to call outside a <ToastProvider> — degrades to a no-op rather than
 * throwing, so shared components stay drop-in usable on any page.
 */
export function useToast() {
    return useContext(ToastContext) ?? NOOP_TOAST;
}
