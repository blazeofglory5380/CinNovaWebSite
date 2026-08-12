/**
 * Phase M3 — sponsorship inquiry capture (internal leads only).
 */

import { createSponsorLead, SPONSOR_LEAD_STATES } from "./sponsorshipLeads.js";

const RATE = new Map();

export function assertNoInventedSponsorPricing(text = "") {
    if (/\$\d|24\/7|guaranteed (roi|results)/i.test(text)) {
        return { ok: false, error: "INVENTED_OR_OVERCLAIM" };
    }
    return { ok: true, error: null };
}

export function captureSponsorshipInquiry({
    sourcePage,
    company,
    email,
    message = "",
    now = Date.now(),
} = {}) {
    const typeMap = {
        "contact-sales": "product_partnership",
        "sponsor-newsletter": "newsletter_sponsorship",
        advertise: "website_sponsorship",
        "partner-with-us": "product_partnership",
    };
    const inquiryType = typeMap[sourcePage];
    if (!inquiryType) return { ok: false, error: "UNKNOWN_SOURCE" };
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { ok: false, error: "INVALID_EMAIL" };
    }
    const claim = assertNoInventedSponsorPricing(message);
    if (!claim.ok) return claim;

    const key = `${email}:${Math.floor(now / 60000)}`;
    const hits = (RATE.get(key) || 0) + 1;
    RATE.set(key, hits);
    if (hits > 8) return { ok: false, error: "RATE_LIMITED" };

    const leadId = `lead_${sourcePage}_${now}`;
    const created = createSponsorLead({
        leadId,
        inquiryType,
        company,
        contactEmail: email,
        message,
    });
    if (!created.ok) return created;
    return {
        ok: true,
        confirmation: "Inquiry received. We will follow up. Rates available on request.",
        lead: {
            leadId,
            status: SPONSOR_LEAD_STATES.NEW,
            publicExposureForbidden: true,
        },
    };
}

export function clearSponsorshipRateLimit() {
    RATE.clear();
}
