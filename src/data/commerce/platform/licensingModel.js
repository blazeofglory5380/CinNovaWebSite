/**
 * Phase 12.8 — Licensing model (architecture only).
 * No license activation in this phase.
 */

import {
    LICENSE_STATE_LIST,
    LICENSE_STATES,
    LICENSE_TYPE_LIST,
    LICENSE_TYPES,
} from "./constants.js";

/**
 * @typedef {object} LicenseRecord
 * @property {string} licenseId
 * @property {string} customerId
 * @property {string} productId
 * @property {string} licenseType
 * @property {string} state
 * @property {string|null} issuedAt
 * @property {string|null} expiresAt
 * @property {boolean} activated
 * @property {string} notes
 */

/**
 * @param {object} input
 * @returns {Readonly<LicenseRecord>}
 */
export function createLicense(input) {
    if (!input?.licenseId || !input?.customerId || !input?.productId) {
        throw new Error("License requires licenseId, customerId, productId");
    }
    const licenseType = input.licenseType ?? LICENSE_TYPES.APPLICATION;
    const state = input.state ?? LICENSE_STATES.PENDING;
    if (!LICENSE_TYPE_LIST.includes(licenseType)) {
        throw new Error(`Invalid licenseType: ${licenseType}`);
    }
    if (!LICENSE_STATE_LIST.includes(state)) {
        throw new Error(`Invalid license state: ${state}`);
    }
    if (input.activated === true) {
        throw new Error("License activation is forbidden in Phase 12");
    }
    if (state === LICENSE_STATES.ACTIVE && input.activated !== false) {
        // Allow representing the ACTIVE state enum in docs/tests only when
        // activated remains explicitly false (architecture preview).
    }

    return Object.freeze({
        licenseId: input.licenseId,
        customerId: input.customerId,
        productId: input.productId,
        licenseType,
        state,
        issuedAt: input.issuedAt ?? null,
        expiresAt: input.expiresAt ?? null,
        activated: false,
        notes: input.notes ?? "Architecture license — not activated",
    });
}

/** Empty live license store. */
export const LICENSE_STORE = Object.freeze([]);

export const LICENSE_TYPE_ARCHITECTURE = Object.freeze([
    LICENSE_TYPES.DIGITAL_BOOK,
    LICENSE_TYPES.APPLICATION,
    LICENSE_TYPES.ENTERPRISE,
    LICENSE_TYPES.COURSE,
    LICENSE_TYPES.BUNDLE,
    LICENSE_TYPES.MEMBERSHIP,
]);

export function listLicenses() {
    return LICENSE_STORE.slice();
}

export function listLicensesForCustomer(customerId) {
    return LICENSE_STORE.filter((l) => l.customerId === customerId);
}

export function validateLicenseStore(store = LICENSE_STORE) {
    const errors = [];
    for (const license of store) {
        if (license.activated) {
            errors.push(`${license.licenseId}: activated`);
        }
        if (license.state === LICENSE_STATES.ACTIVE) {
            errors.push(
                `${license.licenseId}: ACTIVE licenses forbidden in Phase 12 store`,
            );
        }
    }
    return { ok: errors.length === 0, errors };
}
