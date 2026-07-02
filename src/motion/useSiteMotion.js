import { MOTION_ENABLED } from "./motionConfig.js";

/**
 * Returns whether CinNova Motion is active for this build/session.
 * When false, motion wrappers render children unchanged (no provider, no presets).
 */
export function useSiteMotion() {
    return { enabled: MOTION_ENABLED };
}
