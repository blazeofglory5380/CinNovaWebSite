import { createContext } from "react";

/**
 * Shared toast context. Kept in its own module so `ToastProvider.jsx` only
 * exports components, which keeps React Fast Refresh working.
 */
export const ToastContext = createContext(null);
