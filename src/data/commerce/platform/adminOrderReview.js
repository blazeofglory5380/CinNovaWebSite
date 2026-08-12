/**
 * Phase M3 — admin order review model.
 * TEST and LIVE must never be mixed in one view.
 */

import { listOrders } from "./orderModel.js";
import { listGrantedEntitlements } from "./entitlementGrants.js";
import { PAYMENT_MODES } from "./paymentMode.js";

export function buildAdminOrderRow(order, entitlements = []) {
    const ents = entitlements.filter((e) => e.orderId === order.orderId);
    return Object.freeze({
        orderId: order.orderId,
        badge: order.paymentMode || order.channel || PAYMENT_MODES.TEST,
        status: order.status,
        customerId: order.customerId,
        lineItems: order.lineItems,
        totalCents: order.totalCents,
        currency: order.currency,
        paymentProvider: "stripe",
        paymentProviderRefPrefix: String(order.paymentProviderRef || "").slice(0, 8),
        entitlementState: ents[0]?.status || "none",
        refundState: order.status.includes("REFUND") ? order.status : null,
    });
}

export function listAdminOrders({ channel = PAYMENT_MODES.TEST, adminAuthorized = false } = {}) {
    if (!adminAuthorized) return [];
    return listOrders()
        .filter((o) => (o.paymentMode || o.channel || PAYMENT_MODES.TEST) === channel)
        .map((o) => buildAdminOrderRow(o, listGrantedEntitlements()));
}

export function assertAdminChannelsNotMixed(rows) {
    const badges = new Set(rows.map((r) => r.badge));
    if (badges.size > 1) return { ok: false, error: "CHANNELS_MIXED" };
    return { ok: true, error: null };
}
