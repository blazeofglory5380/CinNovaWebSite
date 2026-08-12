/**
 * Phase M3 — Stripe Tax TEST readiness (no invented rates).
 */

import { TAX_PROVIDER_ARCHITECTURE, isTaxConfigured, assertTaxAllowsLiveSales } from "./taxArchitecture.js";

export function getStripeTaxTestReadiness(env = typeof process !== "undefined" ? process.env : {}) {
    const stripeTaxEnabled = String(env.STRIPE_TAX_ENABLED || "").toLowerCase() === "true";
    const configured = isTaxConfigured({ stripeTaxEnabled });
    return {
        provider: "stripe_tax",
        testModeSupported: true,
        configured,
        liveBlocked: !configured,
        supports: {
            customerJurisdiction: true,
            taxableProductTypes: true,
            digitalGoods: true,
            usStateSalesTax: true,
            vatGstLater: true,
        },
        inventedRatesForbidden: true,
        note: configured
            ? "Stripe Tax flag on — still requires Stripe Dashboard tax registration before LIVE."
            : "STRIPE_TAX_ENABLED is not true. LIVE PAYMENT ACTIVATION BLOCKED.",
        architecture: TAX_PROVIDER_ARCHITECTURE,
        liveGate: assertTaxAllowsLiveSales({ taxConfigured: configured }),
    };
}
