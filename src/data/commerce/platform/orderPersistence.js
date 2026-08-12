/**
 * Phase M3 — durable order persistence (JSON file + in-memory).
 * Gitignored data dir. Never stores card data.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
    createOrderRecord,
    getOrderById,
    listOrders,
    clearOrderStore,
    transitionOrder,
    ORDER_STATES,
} from "./orderModel.js";

const DEFAULT_DIR = join(dirname(fileURLToPath(import.meta.url)), "../../../../data/commerce-test");

function filePath(dir = DEFAULT_DIR) {
    return join(dir, "orders.json");
}

export function persistOrdersToDisk({ dir = DEFAULT_DIR } = {}) {
    mkdirSync(dir, { recursive: true });
    const payload = {
        savedAt: new Date().toISOString(),
        orders: listOrders().map((o) => ({
            ...o,
            // Never persist card material even if accidentally attached.
            cardData: undefined,
            paymentMethodSummary: o.paymentMethodSummary || null,
        })),
    };
    writeFileSync(filePath(dir), JSON.stringify(payload, null, 2), "utf8");
    return { ok: true, path: filePath(dir), count: payload.orders.length };
}

export function loadOrdersFromDisk({ dir = DEFAULT_DIR, replace = true } = {}) {
    const path = filePath(dir);
    if (!existsSync(path)) return { ok: true, loaded: 0, missing: true };
    const parsed = JSON.parse(readFileSync(path, "utf8"));
    if (replace) clearOrderStore();
    let loaded = 0;
    for (const row of parsed.orders || []) {
        if (row.cardData || row.pan || row.cvc) continue;
        createOrderRecord({
            orderId: row.orderId,
            customerId: row.customerId,
            guestEmail: row.guestEmail,
            lineItems: row.lineItems || [],
            subtotalCents: row.subtotalCents,
            discountCents: row.discountCents,
            taxCents: row.taxCents,
            totalCents: row.totalCents,
            currency: row.currency,
            paymentProviderRef: row.paymentProviderRef,
            paymentMode: row.paymentMode || "TEST",
            channel: row.channel || row.paymentMode || "TEST",
            status: row.status || ORDER_STATES.PENDING,
            createdAt: row.createdAt || null,
            updatedAt: row.updatedAt || null,
        });
        loaded += 1;
    }
    return { ok: true, loaded, missing: false };
}

export function saveOrderAndPersist(input, { dir = DEFAULT_DIR } = {}) {
    const order = createOrderRecord(input);
    persistOrdersToDisk({ dir });
    return order;
}

export function transitionAndPersist(orderId, nextStatus, opts = {}, persistOpts = {}) {
    const result = transitionOrder(orderId, nextStatus, opts);
    if (result.ok) persistOrdersToDisk(persistOpts);
    return result;
}

export function getPersistedOrder(orderId) {
    return getOrderById(orderId);
}

export function assertNoCardDataInStore() {
    for (const order of listOrders()) {
        if (order.cardData || order.rawCardDataForbidden !== true) {
            return { ok: false, error: "CARD_DATA_PRESENT" };
        }
    }
    return { ok: true, error: null };
}
