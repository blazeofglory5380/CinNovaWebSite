/**
 * Phase 12.7 — Notification architecture (models only).
 */

import {
    NOTIFICATION_CATEGORIES,
    NOTIFICATION_CATEGORY_LIST,
    NOTIFICATION_SEVERITY,
} from "./constants.js";

/**
 * @typedef {object} NotificationRecord
 * @property {string} notificationId
 * @property {string} customerId
 * @property {string} category
 * @property {string} severity
 * @property {string} title
 * @property {string} body
 * @property {string|null} relatedProductId
 * @property {boolean} read
 * @property {string|null} createdAt
 * @property {boolean} deliverable — false until delivery channels exist
 */

/**
 * @param {object} input
 * @returns {Readonly<NotificationRecord>}
 */
export function createNotification(input) {
    if (!input?.notificationId || !input?.customerId || !input?.title) {
        throw new Error("Notification requires notificationId, customerId, title");
    }
    const category = input.category ?? NOTIFICATION_CATEGORIES.SYSTEM_MESSAGES;
    if (!NOTIFICATION_CATEGORY_LIST.includes(category)) {
        throw new Error(`Invalid notification category: ${category}`);
    }

    return Object.freeze({
        notificationId: input.notificationId,
        customerId: input.customerId,
        category,
        severity: input.severity ?? NOTIFICATION_SEVERITY.INFO,
        title: input.title,
        body: input.body ?? "",
        relatedProductId: input.relatedProductId ?? null,
        read: Boolean(input.read),
        createdAt: input.createdAt ?? null,
        deliverable: false,
    });
}

/** Empty live notification inbox. */
export const NOTIFICATION_STORE = Object.freeze([]);

export const NOTIFICATION_CATEGORY_ARCHITECTURE = Object.freeze([
    NOTIFICATION_CATEGORIES.BOOKS,
    NOTIFICATION_CATEGORIES.APPLICATIONS,
    NOTIFICATION_CATEGORIES.SUBSCRIPTIONS,
    NOTIFICATION_CATEGORIES.PRODUCT_UPDATES,
    NOTIFICATION_CATEGORIES.RECOMMENDATIONS,
    NOTIFICATION_CATEGORIES.PARTNER_STATUS,
    NOTIFICATION_CATEGORIES.ACCOUNT_MESSAGES,
    NOTIFICATION_CATEGORIES.SYSTEM_MESSAGES,
]);

export function listNotifications() {
    return NOTIFICATION_STORE.slice();
}

export function listNotificationsForCustomer(customerId) {
    return NOTIFICATION_STORE.filter((n) => n.customerId === customerId);
}

export function validateNotificationStore(store = NOTIFICATION_STORE) {
    const errors = [];
    for (const n of store) {
        if (n.deliverable) {
            errors.push(`${n.notificationId}: delivery not enabled in Phase 12`);
        }
    }
    return { ok: errors.length === 0, errors };
}
