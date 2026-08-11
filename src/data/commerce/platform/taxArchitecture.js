/**
 * Phase M2 — tax architecture.
 * Do NOT invent tax rates. LIVE payments blocked until real provider configured.
 */

export const TAX_PROVIDER_ARCHITECTURE = Object.freeze({
    enabled: false,
    provider: null,
    recommendedWithStripe: "stripe_tax",
    usSalesTax: "required_before_live",
    digitalGoods: "jurisdiction_dependent",
    international: "vat_gst_considerations",
    customerJurisdictionRequired: true,
    inventedRatesForbidden: true,
    livePaymentBlockedUntilConfigured: true,
    notes: [
        "Do not invent tax rates in application code.",
        "Prefer Stripe Tax when Stripe is the primary processor.",
        "Collect customer jurisdiction before charge.",
        "Digital goods and cross-border VAT/GST need configuration + counsel.",
        "LIVE PAYMENT ACTIVATION BLOCKED until tax provider/configuration is real.",
    ],
});

export function isTaxConfigured({ providerConfigured = false, stripeTaxEnabled = false } = {}) {
    return Boolean(providerConfigured || stripeTaxEnabled);
}

export function assertTaxAllowsLiveSales({ taxConfigured = false } = {}) {
    if (!taxConfigured) {
        return {
            ok: false,
            error: "TAX_BLOCKS_LIVE",
            message: "LIVE payment activation blocked until tax is configured.",
        };
    }
    return { ok: true, error: null, message: null };
}

export function getTaxReadinessReport() {
    return {
        ...TAX_PROVIDER_ARCHITECTURE,
        configured: false,
        liveBlocked: true,
    };
}
