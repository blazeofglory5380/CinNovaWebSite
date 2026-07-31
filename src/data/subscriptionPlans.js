/**
 * Future premium subscription plan architecture (Phase 11.1).
 * No Stripe, no checkout, no prices — price remains null until approved.
 */

import { COMMERCE_AVAILABILITY } from "./commerceModels.js";

export const BILLING_MODELS = Object.freeze({
    MONTHLY: "MONTHLY",
    ANNUAL: "ANNUAL",
    ONE_TIME: "ONE_TIME",
    TBD: "TBD",
});

export const PLAN_STATUS = Object.freeze({
    ARCHITECTURE_ONLY: "ARCHITECTURE_ONLY",
    READY_TO_ACTIVATE: "READY_TO_ACTIVATE",
    ACTIVE: "ACTIVE",
});

/** @type {ReadonlyArray<object>} */
export const subscriptionPlans = Object.freeze([
    {
        planId: "poisonguard-premium",
        productId: "poisonguard",
        title: "PoisonGuard Premium",
        status: PLAN_STATUS.ARCHITECTURE_ONLY,
        billingModel: BILLING_MODELS.TBD,
        availability: COMMERCE_AVAILABILITY.UNAVAILABLE,
        features: [
            "Expanded hazard database",
            "Multi-pet / household profiles",
            "Priority guidance flows",
        ],
        price: null,
        currency: null,
    },
    {
        planId: "studynest-premium",
        productId: "studynest",
        title: "StudyNest Premium",
        status: PLAN_STATUS.ARCHITECTURE_ONLY,
        billingModel: BILLING_MODELS.TBD,
        availability: COMMERCE_AVAILABILITY.UNAVAILABLE,
        features: ["Advanced study tools", "Planner depth", "Tutor capacity"],
        price: null,
        currency: null,
    },
    {
        planId: "real-estate-ai-premium",
        productId: "real-estate",
        title: "CinNova Real Estate AI",
        status: PLAN_STATUS.ARCHITECTURE_ONLY,
        billingModel: BILLING_MODELS.TBD,
        availability: COMMERCE_AVAILABILITY.UNAVAILABLE,
        features: ["Deal analysis", "Scenario modeling", "Portfolio tools"],
        price: null,
        currency: null,
    },
    {
        planId: "stagescout-premium",
        productId: "stagescout",
        title: "StageScout Premium",
        status: PLAN_STATUS.ARCHITECTURE_ONLY,
        billingModel: BILLING_MODELS.TBD,
        availability: COMMERCE_AVAILABILITY.UNAVAILABLE,
        features: ["Premium discovery", "Saved trips", "Partner offers (future)"],
        price: null,
        currency: null,
    },
]);

export function getSubscriptionPlans() {
    return subscriptionPlans.slice();
}

export function getSubscriptionPlanById(planId) {
    return subscriptionPlans.find((plan) => plan.planId === planId) || null;
}

/** True only when a plan is commercially active with a real price — never today. */
export function isSubscriptionPlanPurchasable(plan) {
    return (
        plan?.status === PLAN_STATUS.ACTIVE &&
        plan?.availability === COMMERCE_AVAILABILITY.AVAILABLE &&
        plan?.price != null
    );
}
