/**
 * Phase 12.1 — Unified Customer Model (architecture only).
 * No passwords, authentication, payment info, or production accounts.
 */

import { SUPPORT_STATUSES, SUPPORT_STATUS_LIST } from "./constants.js";

/**
 * @typedef {object} NewsletterPreferences
 * @property {boolean} productUpdates
 * @property {boolean} books
 * @property {boolean} applications
 * @property {boolean} partnerOffers
 * @property {boolean} systemMessages
 */

/**
 * @typedef {object} CustomerRecord
 * @property {string} customerId
 * @property {string} displayName
 * @property {string|null} email
 * @property {string|null} avatarUrl
 * @property {string} language
 * @property {string} timeZone
 * @property {NewsletterPreferences} newsletterPreferences
 * @property {ReadonlyArray<string>} productsOwned
 * @property {ReadonlyArray<string>} subscriptionIds
 * @property {ReadonlyArray<string>} entitlementIds
 * @property {ReadonlyArray<string>} downloadIds
 * @property {ReadonlyArray<string>} notificationIds
 * @property {ReadonlyArray<string>} savedRecommendationIds
 * @property {ReadonlyArray<string>} connectedApplicationIds
 * @property {string} supportStatus
 * @property {boolean} isProductionAccount
 * @property {string} createdAt
 * @property {string|null} updatedAt
 * @property {null} passwordHash — always null (auth out of scope)
 * @property {null} paymentMethods — always null
 * @property {null} billingAddress — always null
 */

const DEFAULT_NEWSLETTER = Object.freeze({
    productUpdates: false,
    books: false,
    applications: false,
    partnerOffers: false,
    systemMessages: true,
});

/**
 * Build a frozen customer record. Production accounts are forbidden in Phase 12.
 * @param {Partial<CustomerRecord> & { customerId: string, displayName: string }} input
 * @returns {Readonly<CustomerRecord>}
 */
export function createCustomerRecord(input) {
    if (!input?.customerId || typeof input.customerId !== "string") {
        throw new Error("customerId is required");
    }
    if (!input?.displayName || typeof input.displayName !== "string") {
        throw new Error("displayName is required");
    }
    if (input.isProductionAccount === true) {
        throw new Error(
            "Production customer accounts are not allowed in Phase 12 architecture",
        );
    }

    const supportStatus = input.supportStatus ?? SUPPORT_STATUSES.NONE;
    if (!SUPPORT_STATUS_LIST.includes(supportStatus)) {
        throw new Error(`Invalid supportStatus: ${supportStatus}`);
    }

    return Object.freeze({
        customerId: input.customerId,
        displayName: input.displayName,
        email: input.email ?? null,
        avatarUrl: input.avatarUrl ?? null,
        language: input.language ?? "en",
        timeZone: input.timeZone ?? "America/Los_Angeles",
        newsletterPreferences: Object.freeze({
            ...DEFAULT_NEWSLETTER,
            ...(input.newsletterPreferences || {}),
        }),
        productsOwned: Object.freeze([...(input.productsOwned || [])]),
        subscriptionIds: Object.freeze([...(input.subscriptionIds || [])]),
        entitlementIds: Object.freeze([...(input.entitlementIds || [])]),
        downloadIds: Object.freeze([...(input.downloadIds || [])]),
        notificationIds: Object.freeze([...(input.notificationIds || [])]),
        savedRecommendationIds: Object.freeze([
            ...(input.savedRecommendationIds || []),
        ]),
        connectedApplicationIds: Object.freeze([
            ...(input.connectedApplicationIds || []),
        ]),
        supportStatus,
        isProductionAccount: false,
        createdAt: input.createdAt ?? new Date(0).toISOString(),
        updatedAt: input.updatedAt ?? null,
        passwordHash: null,
        paymentMethods: null,
        billingAddress: null,
    });
}

/**
 * Validate architecture invariants for a customer record.
 * @param {CustomerRecord} customer
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateCustomerRecord(customer) {
    const errors = [];
    if (!customer?.customerId) errors.push("missing customerId");
    if (!customer?.displayName) errors.push("missing displayName");
    if (customer?.isProductionAccount) {
        errors.push("production accounts are forbidden");
    }
    if (customer?.passwordHash != null) errors.push("passwordHash must be null");
    if (customer?.paymentMethods != null) {
        errors.push("paymentMethods must be null");
    }
    if (customer?.billingAddress != null) {
        errors.push("billingAddress must be null");
    }
    if (
        customer?.supportStatus &&
        !SUPPORT_STATUS_LIST.includes(customer.supportStatus)
    ) {
        errors.push(`invalid supportStatus: ${customer.supportStatus}`);
    }
    return { ok: errors.length === 0, errors };
}

/** Empty production customer store — Phase 12 ships zero production accounts. */
export const CUSTOMER_CATALOG = Object.freeze([]);

export function listCustomers() {
    return CUSTOMER_CATALOG.slice();
}

export function getCustomerById(customerId) {
    return CUSTOMER_CATALOG.find((c) => c.customerId === customerId) || null;
}

/**
 * Architecture fixture for unit tests only — never a production account.
 * @returns {Readonly<CustomerRecord>}
 */
export function createArchitectureFixtureCustomer() {
    return createCustomerRecord({
        customerId: "arch-fixture-customer-001",
        displayName: "Architecture Fixture",
        email: null,
        language: "en",
        timeZone: "UTC",
        isProductionAccount: false,
        createdAt: "1970-01-01T00:00:00.000Z",
    });
}
