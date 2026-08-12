/**
 * Phase M3 — REAL revenue ledger cannot include TEST/DEMO/refunded-test.
 */

import { REVENUE_DATA_CHANNELS } from "./revenueAnalytics.js";
import { ORDER_STATES, listOrders } from "./orderModel.js";

export function summarizeRevenueByChannel(orders = listOrders()) {
    const buckets = {
        [REVENUE_DATA_CHANNELS.REAL]: { cents: 0, count: 0, refundedCents: 0 },
        [REVENUE_DATA_CHANNELS.TEST]: { cents: 0, count: 0, refundedCents: 0 },
        [REVENUE_DATA_CHANNELS.DEMO]: { cents: 0, count: 0, refundedCents: 0 },
    };
    for (const order of orders) {
        const channel = order.channel || order.paymentMode || REVENUE_DATA_CHANNELS.TEST;
        if (!buckets[channel]) continue;
        const refunded = order.status === ORDER_STATES.REFUNDED || order.status === ORDER_STATES.PARTIALLY_REFUNDED;
        if (refunded) {
            buckets[channel].refundedCents += order.totalCents || 0;
            continue;
        }
        if (order.status === ORDER_STATES.PAID || order.status === ORDER_STATES.FULFILLED || order.status === ORDER_STATES.FULFILLING) {
            buckets[channel].cents += order.totalCents || 0;
            buckets[channel].count += 1;
        }
    }
    return buckets;
}

export function assertRealExcludesTestAndDemo(orders = listOrders()) {
    const realOrders = orders.filter((o) => (o.channel || o.paymentMode) === REVENUE_DATA_CHANNELS.REAL);
    const leaked = realOrders.filter((o) => o.channel === REVENUE_DATA_CHANNELS.TEST || o.channel === REVENUE_DATA_CHANNELS.DEMO);
    if (leaked.length) return { ok: false, error: "TEST_OR_DEMO_IN_REAL" };
    const summary = summarizeRevenueByChannel(orders);
    if (summary.REAL.cents && orders.some((o) => o.channel === REVENUE_DATA_CHANNELS.TEST && o.status === ORDER_STATES.REFUNDED)) {
        // refunded test must not increase REAL
        if (summary.REAL.refundedCents !== 0 && orders.every((o) => o.channel !== REVENUE_DATA_CHANNELS.REAL)) {
            return { ok: false, error: "TEST_REFUND_IN_REAL" };
        }
    }
    return { ok: true, error: null, summary };
}
