/**
 * Phase 12 — CinNova Commerce Platform public API.
 * Architecture foundation only: no payments, checkout, or production accounts.
 */

export {
    COMMERCE_PLATFORM_PHASE,
    PRODUCT_CATEGORIES,
    PRODUCT_CATEGORY_LIST,
    PRODUCT_CATEGORY_LABELS,
    OWNERSHIP_TYPES,
    OWNERSHIP_TYPE_LIST,
    LAUNCH_STATUSES,
    LAUNCH_STATUS_LIST,
    PLATFORM_TARGETS,
    PLATFORM_TARGET_LIST,
    PRODUCT_AVAILABILITY,
    PRODUCT_AVAILABILITY_LIST,
    SUBSCRIPTION_TIERS,
    SUBSCRIPTION_TIER_LIST,
    SUBSCRIPTION_TIER_LABELS,
    SUBSCRIPTION_PLAN_STATUS,
    ENTITLEMENT_KINDS,
    ENTITLEMENT_KIND_LIST,
    ENTITLEMENT_STATUS,
    ENTITLEMENT_STATUS_LIST,
    LICENSE_TYPES,
    LICENSE_TYPE_LIST,
    LICENSE_STATES,
    LICENSE_STATE_LIST,
    NOTIFICATION_CATEGORIES,
    NOTIFICATION_CATEGORY_LIST,
    NOTIFICATION_SEVERITY,
    DASHBOARD_SECTIONS,
    DASHBOARD_SECTION_LIST,
    RELATIONSHIP_KINDS,
    RELATIONSHIP_KIND_LIST,
    FUTURE_PAYMENT_PROVIDERS,
    FUTURE_PAYMENT_PROVIDER_LIST,
    SUPPORT_STATUSES,
    SUPPORT_STATUS_LIST,
    RECORD_KINDS,
    RECORD_KIND_LIST,
    FORBIDDEN_COMMERCE_ANALYTICS_EVENTS,
} from "./constants.js";

export {
    createCustomerRecord,
    validateCustomerRecord,
    CUSTOMER_CATALOG,
    listCustomers,
    getCustomerById,
    createArchitectureFixtureCustomer,
} from "./customerModel.js";

export {
    createCommerceProduct,
    COMMERCE_PRODUCT_CATALOG,
    listCommerceProducts,
    listPublicCommerceProducts,
    listArchitecturePlaceholders,
    getCommerceProductById,
    getCommerceProductBySlug,
    listCommerceProductsByCategory,
    isArchitecturePlaceholder,
    canOfferHostedCheckout,
    countActiveCommercialInventory,
    validateCommerceProductCatalog,
} from "./productCatalog.js";

export {
    SUBSCRIPTION_TIER_DEFINITIONS,
    COMMERCE_SUBSCRIPTION_PLANS,
    createSubscriptionPlan,
    listSubscriptionTier,
    getSubscriptionTierDefinition,
    listCommerceSubscriptionPlans,
    getCommerceSubscriptionPlanById,
    listPlansForProduct,
    isSubscriptionPlanPurchasable,
    validateSubscriptionArchitecture,
} from "./subscriptionModel.js";

export {
    createEntitlement,
    ENTITLEMENT_STORE,
    ENTITLEMENT_ARCHITECTURE_EXAMPLES,
    listEntitlements,
    listEntitlementsForCustomer,
    customerHasProductAccess,
    customerHasFeature,
    storeHasActiveEntitlementRecord,
    validateEntitlementStore,
} from "./entitlementEngine.js";

export {
    createLicense,
    LICENSE_STORE,
    LICENSE_TYPE_ARCHITECTURE,
    listLicenses,
    listLicensesForCustomer,
    validateLicenseStore,
    licenseGrantsAccess,
} from "./licensingModel.js";

export {
    evaluateProductAccess,
    isAuthenticatedCommercePrincipal,
    trustUserSuppliedCustomerId,
    relationshipGrantsEntitlement,
    amazonOutboundClickGrantsOwnership,
    newsletterSubscriptionIsPaidEntitlement,
    customerHasProductAccessFailClosed,
} from "./accessControl.js";

export {
    createProductRelationship,
    listProductRelationships,
    listRecommendationsForProduct,
    listRelatedProductIds,
    validateProductRelationships,
} from "./productRelationships.js";

export {
    createNotification,
    NOTIFICATION_STORE,
    NOTIFICATION_CATEGORY_ARCHITECTURE,
    listNotifications,
    listNotificationsForCustomer,
    validateNotificationStore,
} from "./notificationModel.js";

export {
    buildCustomerDashboard,
    listDashboardSections,
} from "./customerDashboard.js";

export {
    getCommerceAdminSummary,
    validateCommerceAdminFoundation,
} from "./adminFoundation.js";

export {
    listPaymentProviderSlots,
    getPaymentProviderSlot,
    TAX_HANDLING_ARCHITECTURE,
    INVOICING_ARCHITECTURE,
    MOBILE_IAP_ARCHITECTURE,
    isAnyPaymentProviderConfigured,
} from "./providers.js";

export {
    createEmptyCart,
    assertCheckoutAllowed,
    beginCheckoutArchitecture,
    completePurchaseArchitecture,
    applyCouponArchitecture,
    CHECKOUT_STATES,
    TAX_ARCHITECTURE,
} from "./checkoutArchitecture.js";

export {
    createSignedDownloadGrant,
    revokeDownloadGrant,
    listDemoEntitlements,
    DIGITAL_DELIVERY_RULES,
} from "./digitalDelivery.js";

export { validateCouponArchitecture } from "./couponArchitecture.js";

export { getRevenueDashboardModel } from "./revenueDashboard.js";

import { validateCommerceAdminFoundation } from "./adminFoundation.js";
import { validateProductRelationships } from "./productRelationships.js";
import { validateNotificationStore } from "./notificationModel.js";
import { isAnyPaymentProviderConfigured } from "./providers.js";
import { listCustomers } from "./customerModel.js";
import {
    isSubscriptionPlanPurchasable,
    listCommerceSubscriptionPlans,
} from "./subscriptionModel.js";
import {
    amazonOutboundClickGrantsOwnership,
    newsletterSubscriptionIsPaidEntitlement,
    trustUserSuppliedCustomerId,
} from "./accessControl.js";
import { countActiveCommercialInventory } from "./productCatalog.js";

/**
 * Aggregate platform health check for tests and docs.
 */
export function validateCommercePlatform() {
    const errors = [];
    const admin = validateCommerceAdminFoundation();
    const relationships = validateProductRelationships();
    const notifications = validateNotificationStore();

    errors.push(...admin.errors, ...relationships.errors, ...notifications.errors);

    if (listCustomers().length > 0) {
        errors.push("customer catalog must remain empty in Phase 12");
    }
    if (isAnyPaymentProviderConfigured()) {
        errors.push("payment providers must not be configured");
    }
    if (listCommerceSubscriptionPlans().some(isSubscriptionPlanPurchasable)) {
        errors.push("no subscription plan may be purchasable");
    }
    if (countActiveCommercialInventory() !== 0) {
        errors.push("active commercial inventory must be zero");
    }
    if (amazonOutboundClickGrantsOwnership()) {
        errors.push("Amazon outbound must not grant ownership");
    }
    if (newsletterSubscriptionIsPaidEntitlement()) {
        errors.push("newsletter must not be a paid entitlement");
    }
    if (trustUserSuppliedCustomerId("anyone")) {
        errors.push("user-supplied customer ids must not be trusted");
    }

    return {
        ok: errors.length === 0,
        errors,
        summary: admin.summary,
    };
}
