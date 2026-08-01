/**
 * Phase 12.3 — Subscription model (architecture only).
 * No billing provider, no prices, no activated paid subscriptions.
 */

import {
    PRODUCT_AVAILABILITY,
    SUBSCRIPTION_PLAN_STATUS,
    SUBSCRIPTION_TIER_LIST,
    SUBSCRIPTION_TIERS,
} from "./constants.js";

/**
 * @typedef {object} SubscriptionTierDefinition
 * @property {string} tier
 * @property {string[]} features
 * @property {Record<string, number|null>} limits — null means unlimited / TBD
 * @property {string[]} productAccess
 * @property {string[]} upgradePaths
 * @property {string[]} downgradePaths
 */

/**
 * @typedef {object} SubscriptionPlanRecord
 * @property {string} planId
 * @property {string} productId
 * @property {string} title
 * @property {string} tier
 * @property {string} status
 * @property {string} availability
 * @property {string[]} features
 * @property {Record<string, number|null>} limits
 * @property {string[]} productAccess
 * @property {string[]} upgradePaths
 * @property {string[]} downgradePaths
 * @property {null} price
 * @property {null} currency
 * @property {null} billingProvider
 * @property {boolean} activated
 */

const TIER_LADDER = [
    SUBSCRIPTION_TIERS.FREE,
    SUBSCRIPTION_TIERS.PLUS,
    SUBSCRIPTION_TIERS.PRO,
    SUBSCRIPTION_TIERS.FAMILY,
    SUBSCRIPTION_TIERS.TEAM,
    SUBSCRIPTION_TIERS.ENTERPRISE,
];

/**
 * Canonical tier definitions reusable across every CinNova application.
 * @type {ReadonlyArray<Readonly<SubscriptionTierDefinition>>}
 */
export const SUBSCRIPTION_TIER_DEFINITIONS = Object.freeze(
    TIER_LADDER.map((tier, index) =>
        Object.freeze({
            tier,
            features: Object.freeze(defaultFeaturesForTier(tier)),
            limits: Object.freeze(defaultLimitsForTier(tier)),
            productAccess: Object.freeze([]),
            upgradePaths: Object.freeze(TIER_LADDER.slice(index + 1)),
            downgradePaths: Object.freeze(TIER_LADDER.slice(0, index)),
        }),
    ),
);

function defaultFeaturesForTier(tier) {
    switch (tier) {
        case SUBSCRIPTION_TIERS.FREE:
            return ["Core product access", "Community updates"];
        case SUBSCRIPTION_TIERS.PLUS:
            return ["Everything in Free", "Expanded feature set"];
        case SUBSCRIPTION_TIERS.PRO:
            return ["Everything in Plus", "Advanced workflows", "Priority support path"];
        case SUBSCRIPTION_TIERS.FAMILY:
            return ["Everything in Plus", "Multi-profile household seats"];
        case SUBSCRIPTION_TIERS.TEAM:
            return ["Everything in Pro", "Shared workspaces", "Admin controls"];
        case SUBSCRIPTION_TIERS.ENTERPRISE:
            return ["Everything in Team", "SSO-ready architecture", "Custom contracts"];
        default:
            return [];
    }
}

function defaultLimitsForTier(tier) {
    switch (tier) {
        case SUBSCRIPTION_TIERS.FREE:
            return { seats: 1, projects: 1, apiCalls: 0 };
        case SUBSCRIPTION_TIERS.PLUS:
            return { seats: 1, projects: 5, apiCalls: null };
        case SUBSCRIPTION_TIERS.PRO:
            return { seats: 1, projects: null, apiCalls: null };
        case SUBSCRIPTION_TIERS.FAMILY:
            return { seats: 6, projects: 10, apiCalls: null };
        case SUBSCRIPTION_TIERS.TEAM:
            return { seats: 25, projects: null, apiCalls: null };
        case SUBSCRIPTION_TIERS.ENTERPRISE:
            return { seats: null, projects: null, apiCalls: null };
        default:
            return { seats: null, projects: null, apiCalls: null };
    }
}

/**
 * @param {object} input
 * @returns {Readonly<SubscriptionPlanRecord>}
 */
export function createSubscriptionPlan(input) {
    if (!input?.planId || !input?.productId || !input?.title) {
        throw new Error("Subscription plan requires planId, productId, title");
    }
    if (!SUBSCRIPTION_TIER_LIST.includes(input.tier)) {
        throw new Error(`Invalid tier: ${input.tier}`);
    }
    if (input.price != null || input.currency != null) {
        throw new Error("Subscription prices must remain null in Phase 12");
    }
    if (input.billingProvider != null) {
        throw new Error("billingProvider must remain null in Phase 12");
    }
    if (input.activated === true) {
        throw new Error("Subscriptions cannot be activated in Phase 12");
    }
    if (input.status === SUBSCRIPTION_PLAN_STATUS.ACTIVE) {
        throw new Error("ACTIVE subscription status is forbidden until billing exists");
    }

    const tierDef =
        SUBSCRIPTION_TIER_DEFINITIONS.find((t) => t.tier === input.tier) || null;

    return Object.freeze({
        planId: input.planId,
        productId: input.productId,
        title: input.title,
        tier: input.tier,
        status: input.status ?? SUBSCRIPTION_PLAN_STATUS.ARCHITECTURE_ONLY,
        availability: input.availability ?? PRODUCT_AVAILABILITY.UNAVAILABLE,
        features: Object.freeze([
            ...(input.features || tierDef?.features || []),
        ]),
        limits: Object.freeze({
            ...(tierDef?.limits || {}),
            ...(input.limits || {}),
        }),
        productAccess: Object.freeze([...(input.productAccess || [input.productId])]),
        upgradePaths: Object.freeze([
            ...(input.upgradePaths || tierDef?.upgradePaths || []),
        ]),
        downgradePaths: Object.freeze([
            ...(input.downgradePaths || tierDef?.downgradePaths || []),
        ]),
        price: null,
        currency: null,
        billingProvider: null,
        activated: false,
    });
}

/** Architecture catalog of product-linked plans (no billing). */
export const COMMERCE_SUBSCRIPTION_PLANS = Object.freeze([
    createSubscriptionPlan({
        planId: "poisonguard-free",
        productId: "commerce-app-poisonguard",
        title: "PoisonGuard Free",
        tier: SUBSCRIPTION_TIERS.FREE,
        features: ["Basic hazard lookup"],
    }),
    createSubscriptionPlan({
        planId: "poisonguard-plus",
        productId: "commerce-app-poisonguard",
        title: "PoisonGuard Plus",
        tier: SUBSCRIPTION_TIERS.PLUS,
        features: ["Expanded hazard database", "Saved profiles"],
    }),
    createSubscriptionPlan({
        planId: "poisonguard-pro",
        productId: "commerce-app-poisonguard",
        title: "PoisonGuard Premium / Pro",
        tier: SUBSCRIPTION_TIERS.PRO,
        features: ["Multi-pet household", "Priority guidance flows"],
    }),
    createSubscriptionPlan({
        planId: "poisonguard-family",
        productId: "commerce-app-poisonguard",
        title: "PoisonGuard Family",
        tier: SUBSCRIPTION_TIERS.FAMILY,
        features: ["Family seats", "Shared alerts"],
    }),
    createSubscriptionPlan({
        planId: "studynest-free",
        productId: "commerce-app-studynest",
        title: "StudyNest Free",
        tier: SUBSCRIPTION_TIERS.FREE,
    }),
    createSubscriptionPlan({
        planId: "studynest-pro",
        productId: "commerce-app-studynest",
        title: "StudyNest Pro",
        tier: SUBSCRIPTION_TIERS.PRO,
        features: ["Advanced study tools", "Practice tests path", "Teacher tools path"],
    }),
    createSubscriptionPlan({
        planId: "real-estate-pro",
        productId: "commerce-app-real-estate",
        title: "Real Estate AI Professional",
        tier: SUBSCRIPTION_TIERS.PRO,
        features: ["Deal analysis", "Scenario modeling"],
    }),
    createSubscriptionPlan({
        planId: "stagescout-pro",
        productId: "commerce-app-stagescout",
        title: "StageScout Premium",
        tier: SUBSCRIPTION_TIERS.PRO,
        features: ["Premium discovery", "Group planning path"],
    }),
    createSubscriptionPlan({
        planId: "techmate-pro",
        productId: "commerce-app-techmate",
        title: "TechMate AI Pro",
        tier: SUBSCRIPTION_TIERS.PRO,
    }),
    createSubscriptionPlan({
        planId: "cinnova-team",
        productId: "commerce-membership-cinnova-plus",
        title: "CinNova Team",
        tier: SUBSCRIPTION_TIERS.TEAM,
    }),
    createSubscriptionPlan({
        planId: "cinnova-enterprise",
        productId: "commerce-service-enterprise",
        title: "CinNova Enterprise",
        tier: SUBSCRIPTION_TIERS.ENTERPRISE,
    }),
]);

export function listSubscriptionTier() {
    return SUBSCRIPTION_TIER_DEFINITIONS.slice();
}

export function getSubscriptionTierDefinition(tier) {
    return SUBSCRIPTION_TIER_DEFINITIONS.find((t) => t.tier === tier) || null;
}

export function listCommerceSubscriptionPlans() {
    return COMMERCE_SUBSCRIPTION_PLANS.slice();
}

export function getCommerceSubscriptionPlanById(planId) {
    return COMMERCE_SUBSCRIPTION_PLANS.find((p) => p.planId === planId) || null;
}

export function listPlansForProduct(productId) {
    return COMMERCE_SUBSCRIPTION_PLANS.filter((p) => p.productId === productId);
}

/** Never true in Phase 12 — requires ACTIVE + price + provider. */
export function isSubscriptionPlanPurchasable(plan) {
    return (
        plan?.status === SUBSCRIPTION_PLAN_STATUS.ACTIVE &&
        plan?.availability === PRODUCT_AVAILABILITY.AVAILABLE &&
        plan?.price != null &&
        plan?.billingProvider != null &&
        plan?.activated === true
    );
}

export function validateSubscriptionArchitecture(
    plans = COMMERCE_SUBSCRIPTION_PLANS,
) {
    const errors = [];
    for (const plan of plans) {
        if (plan.price != null) errors.push(`${plan.planId}: price set`);
        if (plan.billingProvider != null) {
            errors.push(`${plan.planId}: billingProvider set`);
        }
        if (plan.activated) errors.push(`${plan.planId}: activated`);
        if (plan.status === SUBSCRIPTION_PLAN_STATUS.ACTIVE) {
            errors.push(`${plan.planId}: ACTIVE status`);
        }
        if (isSubscriptionPlanPurchasable(plan)) {
            errors.push(`${plan.planId}: unexpectedly purchasable`);
        }
    }
    return { ok: errors.length === 0, errors };
}
