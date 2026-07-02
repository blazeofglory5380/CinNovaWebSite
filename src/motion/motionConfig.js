/** Compile-time feature flag — set VITE_MOTION_ENABLED=true to opt in. */
export const MOTION_ENABLED = import.meta.env.VITE_MOTION_ENABLED === "true";
