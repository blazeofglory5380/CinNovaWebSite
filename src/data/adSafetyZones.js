/**
 * Phase M2 — explicit no-ad / no-sponsorship zones.
 * Ads must never appear in safety-critical or payment/auth surfaces.
 */

export const NO_AD_ZONES = Object.freeze([
    "poisonguard_emergency_instructions",
    "poisonguard_scanner_safety_result",
    "emergency_contact_panels",
    "safety_critical_warnings",
    "checkout_payment_forms",
    "authentication_forms",
]);

export const NO_AD_ZONE_SET = new Set(NO_AD_ZONES);

export function isNoAdZone(zone) {
    return NO_AD_ZONE_SET.has(zone);
}

export function mayRenderAdOrSponsorship({
    zone = "",
    adsEnabled = false,
    sponsorshipsEnabled = false,
} = {}) {
    if (isNoAdZone(zone)) {
        return {
            ok: false,
            allowed: false,
            reason: "NO_AD_ZONE",
            zone,
        };
    }
    if (!adsEnabled && !sponsorshipsEnabled) {
        return { ok: false, allowed: false, reason: "FLAGS_OFF", zone };
    }
    return { ok: true, allowed: true, reason: null, zone };
}

export function listNoAdZones() {
    return [...NO_AD_ZONES];
}
