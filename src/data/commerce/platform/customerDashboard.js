/**
 * Phase 12.5 — Unified customer dashboard architecture (no payment UI).
 * Returns structured section payloads for future UI — no public route in Phase 12.
 */

import { DASHBOARD_SECTION_LIST, DASHBOARD_SECTIONS } from "./constants.js";
import { listEntitlementsForCustomer } from "./entitlementEngine.js";
import { listLicensesForCustomer } from "./licensingModel.js";
import { listNotificationsForCustomer } from "./notificationModel.js";
import { listRecommendationsForProduct } from "./productRelationships.js";
import {
    getCommerceProductById,
    listPublicCommerceProducts,
} from "./productCatalog.js";
import { PRODUCT_CATEGORIES } from "./constants.js";
import { listPlansForProduct } from "./subscriptionModel.js";

/**
 * @typedef {object} DashboardSection
 * @property {string} key
 * @property {string} title
 * @property {string} status — architecture | placeholder | empty
 * @property {object} data
 */

const SECTION_TITLES = Object.freeze({
    [DASHBOARD_SECTIONS.PROFILE]: "Profile",
    [DASHBOARD_SECTIONS.PRODUCTS]: "Products",
    [DASHBOARD_SECTIONS.BOOKS]: "Books",
    [DASHBOARD_SECTIONS.APPLICATIONS]: "Applications",
    [DASHBOARD_SECTIONS.SUBSCRIPTIONS]: "Subscriptions",
    [DASHBOARD_SECTIONS.DOWNLOADS]: "Downloads",
    [DASHBOARD_SECTIONS.RECOMMENDATIONS]: "Recommendations",
    [DASHBOARD_SECTIONS.NOTIFICATIONS]: "Notifications",
    [DASHBOARD_SECTIONS.LICENSES]: "Licenses",
    [DASHBOARD_SECTIONS.INVOICES]: "Invoices",
    [DASHBOARD_SECTIONS.RECEIPTS]: "Receipts",
    [DASHBOARD_SECTIONS.SUPPORT]: "Support",
});

/**
 * Build a read-only dashboard view model for a customer record.
 * Invoices / receipts are always empty placeholders (no payments).
 * @param {object} customer
 */
export function buildCustomerDashboard(customer) {
    if (!customer?.customerId) {
        throw new Error("customer is required");
    }

    const ownedProducts = (customer.productsOwned || [])
        .map((id) => getCommerceProductById(id))
        .filter(Boolean);

    const recommendationEdges = ownedProducts.flatMap((p) =>
        listRecommendationsForProduct(p.id),
    );

    /** @type {DashboardSection[]} */
    const sections = [
        {
            key: DASHBOARD_SECTIONS.PROFILE,
            title: SECTION_TITLES[DASHBOARD_SECTIONS.PROFILE],
            status: "architecture",
            data: {
                customerId: customer.customerId,
                displayName: customer.displayName,
                email: customer.email,
                avatarUrl: customer.avatarUrl,
                language: customer.language,
                timeZone: customer.timeZone,
                newsletterPreferences: customer.newsletterPreferences,
                auth: "not_implemented",
            },
        },
        {
            key: DASHBOARD_SECTIONS.PRODUCTS,
            title: SECTION_TITLES[DASHBOARD_SECTIONS.PRODUCTS],
            status: ownedProducts.length ? "architecture" : "empty",
            data: { items: ownedProducts },
        },
        {
            key: DASHBOARD_SECTIONS.BOOKS,
            title: SECTION_TITLES[DASHBOARD_SECTIONS.BOOKS],
            status: "architecture",
            data: {
                catalogPreview: listPublicCommerceProducts().filter(
                    (p) => p.category === PRODUCT_CATEGORIES.BOOK,
                ),
                owned: ownedProducts.filter((p) => p.category === PRODUCT_CATEGORIES.BOOK),
            },
        },
        {
            key: DASHBOARD_SECTIONS.APPLICATIONS,
            title: SECTION_TITLES[DASHBOARD_SECTIONS.APPLICATIONS],
            status: "architecture",
            data: {
                catalogPreview: listPublicCommerceProducts().filter(
                    (p) => p.category === PRODUCT_CATEGORIES.APPLICATION,
                ),
                owned: ownedProducts.filter(
                    (p) => p.category === PRODUCT_CATEGORIES.APPLICATION,
                ),
            },
        },
        {
            key: DASHBOARD_SECTIONS.SUBSCRIPTIONS,
            title: SECTION_TITLES[DASHBOARD_SECTIONS.SUBSCRIPTIONS],
            status: "architecture",
            data: {
                subscriptionIds: customer.subscriptionIds || [],
                plans: (customer.productsOwned || []).flatMap((id) =>
                    listPlansForProduct(id),
                ),
                billing: "not_implemented",
                activated: false,
            },
        },
        {
            key: DASHBOARD_SECTIONS.DOWNLOADS,
            title: SECTION_TITLES[DASHBOARD_SECTIONS.DOWNLOADS],
            status: "empty",
            data: { downloadIds: customer.downloadIds || [] },
        },
        {
            key: DASHBOARD_SECTIONS.RECOMMENDATIONS,
            title: SECTION_TITLES[DASHBOARD_SECTIONS.RECOMMENDATIONS],
            status: recommendationEdges.length ? "architecture" : "empty",
            data: {
                savedRecommendationIds: customer.savedRecommendationIds || [],
                suggested: recommendationEdges,
            },
        },
        {
            key: DASHBOARD_SECTIONS.NOTIFICATIONS,
            title: SECTION_TITLES[DASHBOARD_SECTIONS.NOTIFICATIONS],
            status: "empty",
            data: {
                items: listNotificationsForCustomer(customer.customerId),
                delivery: "not_implemented",
            },
        },
        {
            key: DASHBOARD_SECTIONS.LICENSES,
            title: SECTION_TITLES[DASHBOARD_SECTIONS.LICENSES],
            status: "empty",
            data: {
                items: listLicensesForCustomer(customer.customerId),
                entitlements: listEntitlementsForCustomer(customer.customerId),
            },
        },
        {
            key: DASHBOARD_SECTIONS.INVOICES,
            title: SECTION_TITLES[DASHBOARD_SECTIONS.INVOICES],
            status: "placeholder",
            data: {
                items: [],
                note: "Invoices require a payment provider — not implemented in Phase 12",
            },
        },
        {
            key: DASHBOARD_SECTIONS.RECEIPTS,
            title: SECTION_TITLES[DASHBOARD_SECTIONS.RECEIPTS],
            status: "placeholder",
            data: {
                items: [],
                note: "Receipts require a payment provider — not implemented in Phase 12",
            },
        },
        {
            key: DASHBOARD_SECTIONS.SUPPORT,
            title: SECTION_TITLES[DASHBOARD_SECTIONS.SUPPORT],
            status: "architecture",
            data: {
                supportStatus: customer.supportStatus,
                connectedApplications: customer.connectedApplicationIds || [],
            },
        },
    ];

    return Object.freeze({
        customerId: customer.customerId,
        sections: Object.freeze(sections),
        sectionKeys: DASHBOARD_SECTION_LIST.slice(),
        paymentsEnabled: false,
        checkoutEnabled: false,
    });
}

export function listDashboardSections() {
    return DASHBOARD_SECTION_LIST.map((key) =>
        Object.freeze({ key, title: SECTION_TITLES[key] }),
    );
}
