/**
 * Phase M2 — refund lifecycle architecture.
 * Entitlement revocation must align with final legal refund policy (attorney review).
 */

import { ORDER_STATES, transitionOrder, getOrderById } from "./orderModel.js";
import { revokeEntitlementForRefund, listGrantedEntitlements } from "./entitlementGrants.js";

export const REFUND_STATES = Object.freeze({
    NONE: "NONE",
    REFUND_PENDING: "REFUND_PENDING",
    REFUNDED: "REFUNDED",
    PARTIALLY_REFUNDED: "PARTIALLY_REFUNDED",
    FAILED: "FAILED",
});

export const REFUND_POLICY_FLAGS = Object.freeze({
    attorneyReviewRequired: true,
    businessApprovalRequired: true,
    autoRevokeOnFullRefund: "PENDING_POLICY",
    note: "Do not automatically revoke access in ways inconsistent with final legal refund policy.",
});

export function initiateRefund({
    orderId,
    amountCents = null,
    full = true,
    providerAccepted = false,
} = {}) {
    const order = getOrderById(orderId);
    if (!order) return { ok: false, error: "ORDER_NOT_FOUND", refund: null };

    const pending = transitionOrder(orderId, ORDER_STATES.REFUND_PENDING, {
        providerVerified: true,
    });
    if (!pending.ok && pending.error !== "ILLEGAL_TRANSITION") {
        return { ok: false, error: pending.error, refund: null };
    }

    if (!providerAccepted) {
        return {
            ok: true,
            error: null,
            refund: {
                orderId,
                state: REFUND_STATES.REFUND_PENDING,
                amountCents: full ? order.totalCents : amountCents,
                full,
                message: "Refund pending provider confirmation.",
            },
        };
    }

    const next = full ? ORDER_STATES.REFUNDED : ORDER_STATES.PARTIALLY_REFUNDED;
    const done = transitionOrder(orderId, next, { providerVerified: true });
    return {
        ok: done.ok,
        error: done.error,
        refund: {
            orderId,
            state: full ? REFUND_STATES.REFUNDED : REFUND_STATES.PARTIALLY_REFUNDED,
            amountCents: full ? order.totalCents : amountCents,
            full,
            policy: REFUND_POLICY_FLAGS,
        },
    };
}

export function applyRefundToEntitlements({
    orderId,
    policyAllowsRevoke = false,
} = {}) {
    const matches = listGrantedEntitlements().filter((e) => e.orderId === orderId);
    const results = matches.map((e) =>
        revokeEntitlementForRefund({
            entitlementId: e.entitlementId,
            policyAllowsRevoke,
        }),
    );
    return {
        ok: true,
        results,
        policy: REFUND_POLICY_FLAGS,
        note: policyAllowsRevoke
            ? "Revocation applied per explicit policy flag."
            : "Revocation not applied — awaiting attorney/business policy approval.",
    };
}
