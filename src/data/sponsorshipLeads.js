/**
 * Phase M2 — sponsorship sales lead pipeline (internal only).
 * Do not expose lead records on public routes.
 */

export const SPONSOR_LEAD_STATES = Object.freeze({
    NEW: "NEW",
    CONTACTED: "CONTACTED",
    QUALIFIED: "QUALIFIED",
    PROPOSAL: "PROPOSAL",
    NEGOTIATION: "NEGOTIATION",
    WON: "WON",
    LOST: "LOST",
    PAUSED: "PAUSED",
});

export const SPONSOR_LEAD_STATE_LIST = Object.freeze(Object.values(SPONSOR_LEAD_STATES));

export const SPONSOR_INQUIRY_TYPES = Object.freeze([
    "newsletter_sponsorship",
    "website_sponsorship",
    "app_sponsorship",
    "branded_content",
    "product_partnership",
    "media_inquiry",
]);

const LEAD_STORE = new Map();

export function clearSponsorLeadStore() {
    LEAD_STORE.clear();
}

export function createSponsorLead({
    leadId,
    inquiryType,
    company = "",
    contactEmail = "",
    message = "",
} = {}) {
    if (!leadId) return { ok: false, error: "LEAD_ID_REQUIRED", lead: null };
    if (!SPONSOR_INQUIRY_TYPES.includes(inquiryType)) {
        return { ok: false, error: "INVALID_INQUIRY_TYPE", lead: null };
    }
    const lead = Object.freeze({
        leadId,
        inquiryType,
        company: String(company).slice(0, 140),
        contactEmail: String(contactEmail).toLowerCase().slice(0, 254),
        message: String(message).slice(0, 2000),
        status: SPONSOR_LEAD_STATES.NEW,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publicExposureForbidden: true,
    });
    LEAD_STORE.set(leadId, lead);
    return { ok: true, error: null, lead };
}

export function transitionSponsorLead(leadId, nextStatus) {
    const current = LEAD_STORE.get(leadId);
    if (!current) return { ok: false, error: "NOT_FOUND", lead: null };
    if (!SPONSOR_LEAD_STATE_LIST.includes(nextStatus)) {
        return { ok: false, error: "INVALID_STATUS", lead: current };
    }
    const updated = Object.freeze({
        ...current,
        status: nextStatus,
        updatedAt: new Date().toISOString(),
    });
    LEAD_STORE.set(leadId, updated);
    return { ok: true, error: null, lead: updated };
}

export function listSponsorLeads({ adminAuthorized = false } = {}) {
    if (!adminAuthorized) return [];
    return [...LEAD_STORE.values()];
}
