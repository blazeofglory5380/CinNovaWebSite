/**
 * Phase M2 — safe automated test transaction harness.
 * Provider-dependent portions SKIP honestly when credentials are absent.
 * Never fabricates a passing live/test charge without mode+credentials.
 */

import { resolvePaymentMode, PAYMENT_MODES, canCreateTestCheckoutSession } from "./paymentMode.js";
import {
    registerEphemeralTestPrice,
    clearEphemeralTestPrices,
    quoteServerCheckout,
} from "./serverPricing.js";
import {
    createCartState,
    beginServerCheckout,
    completeCheckoutFromProvider,
    CHECKOUT_FLOW_STATES,
} from "./checkoutFlow.js";
import { createCustomerIdentity, clearCustomerIdentityStore } from "./customerIdentity.js";
import {
    clearOrderStore,
    createOrderRecord,
    ORDER_STATES,
} from "./orderModel.js";
import {
    clearWebhookIdempotencyStore,
    handleWebhookEventArchitecture,
    verifyWebhookSignature,
} from "./webhookArchitecture.js";
import {
    clearEntitlementGrantStore,
    authorizeSecureDownload,
    revokeEntitlementForRefund,
} from "./entitlementGrants.js";
import { initiateRefund } from "./refundLifecycle.js";

function skip(name, reason) {
    return { name, status: "SKIP", reason, ok: true };
}

function pass(name, detail = null) {
    return { name, status: "PASS", detail, ok: true };
}

function fail(name, reason) {
    return { name, status: "FAIL", reason, ok: false };
}

export function runTestTransactionHarness({
    env = typeof process !== "undefined" ? process.env : {},
    simulateProvider = true,
} = {}) {
    const results = [];
    const mode = resolvePaymentMode(env);
    const hasTestCreds = canCreateTestCheckoutSession(mode) || (
        String(env.STRIPE_SECRET_KEY || "").startsWith("sk_test_")
        || String(env.STRIPE_TEST_SECRET_KEY || "").startsWith("sk_test_")
    );

    clearEphemeralTestPrices();
    clearOrderStore();
    clearCustomerIdentityStore();
    clearEntitlementGrantStore();
    clearWebhookIdempotencyStore();

    registerEphemeralTestPrice({
        productId: "test-digital-pack",
        unitAmountCents: 999,
        currency: "USD",
        available: true,
        label: "harness",
    });

    createCustomerIdentity({
        customerId: "cust_test_1",
        email: "test@example.com",
        emailVerified: true,
    });

    // Price tampering
    {
        const bad = quoteServerCheckout({
            items: [{ productId: "test-digital-pack", quantity: 1 }],
            clientPrice: 1,
            paymentMode: PAYMENT_MODES.TEST,
        });
        results.push(
            bad.error === "CLIENT_PRICE_REJECTED"
                ? pass("price_tampering_rejected")
                : fail("price_tampering_rejected", bad.error),
        );
    }

    // Coupon tampering
    {
        const bad = quoteServerCheckout({
            items: [{ productId: "test-digital-pack", quantity: 1 }],
            couponCode: "FAKE50",
            serverCouponRecord: null,
            paymentMode: PAYMENT_MODES.TEST,
        });
        results.push(
            bad.error === "COUPON_INVALID"
                ? pass("coupon_tampering_rejected")
                : fail("coupon_tampering_rejected", bad.error),
        );
    }

    // Valid coupon
    {
        const good = quoteServerCheckout({
            items: [{ productId: "test-digital-pack", quantity: 1 }],
            couponCode: "TEST10",
            serverCouponRecord: { code: "TEST10", discountCents: 100 },
            paymentMode: PAYMENT_MODES.TEST,
            taxConfigured: true,
            taxCents: 0,
        });
        results.push(good.ok ? pass("server_quote_ok", good.quote) : fail("server_quote_ok", good.error));
    }

    // Checkout success path (architecture simulation — not a real Stripe charge)
    {
        if (!simulateProvider) {
            results.push(skip("successful_payment", "simulation disabled"));
        } else {
            const cart = createCartState([{ productId: "test-digital-pack", quantity: 1 }]);
            const began = beginServerCheckout({
                cart,
                customerId: "cust_test_1",
                paymentMode: PAYMENT_MODES.TEST,
                taxConfigured: true,
                taxCents: 0,
            });
            if (!began.ok) {
                results.push(fail("successful_payment", began.error));
            } else {
                const fakeBrowser = completeCheckoutFromProvider({
                    orderId: began.orderId,
                    providerVerified: false,
                });
                results.push(
                    fakeBrowser.error === "PROVIDER_VERIFICATION_REQUIRED"
                        ? pass("browser_redirect_alone_rejected")
                        : fail("browser_redirect_alone_rejected", fakeBrowser.error),
                );

                const completed = completeCheckoutFromProvider({
                    orderId: began.orderId,
                    providerVerified: true,
                });
                results.push(
                    completed.state === CHECKOUT_FLOW_STATES.SUCCESS
                        ? pass("successful_payment", { orderId: began.orderId })
                        : fail("successful_payment", completed.error),
                );

                // Entitlement grant already in complete; verify download auth
                const ent = completed.entitlements?.[0]?.entitlement;
                if (ent) {
                    const dl = authorizeSecureDownload({
                        entitlementId: ent.entitlementId,
                        customerId: "cust_test_1",
                        productId: "test-digital-pack",
                    });
                    results.push(dl.ok ? pass("entitlement_grant_download") : fail("entitlement_grant_download", dl.error));

                    const unauth = authorizeSecureDownload({
                        entitlementId: ent.entitlementId,
                        customerId: "someone_else",
                        productId: "test-digital-pack",
                    });
                    results.push(
                        unauth.error === "UNAUTHORIZED"
                            ? pass("unauthorized_download_rejected")
                            : fail("unauthorized_download_rejected", unauth.error),
                    );

                    const expired = authorizeSecureDownload({
                        entitlementId: ent.entitlementId,
                        customerId: "cust_test_1",
                        productId: "test-digital-pack",
                        now: Date.parse(ent.expiresAt || "2099-01-01") + (ent.expiresAt ? 1 : 0),
                    });
                    // If no expiresAt, force revoke path instead
                    if (!ent.expiresAt) {
                        const rev = revokeEntitlementForRefund({
                            entitlementId: ent.entitlementId,
                            policyAllowsRevoke: true,
                        });
                        const after = authorizeSecureDownload({
                            entitlementId: ent.entitlementId,
                            customerId: "cust_test_1",
                            productId: "test-digital-pack",
                        });
                        results.push(rev.ok && after.error === "REVOKED_OR_INACTIVE"
                            ? pass("entitlement_revoke")
                            : fail("entitlement_revoke", after.error));
                    } else {
                        results.push(
                            expired.error === "EXPIRED"
                                ? pass("expired_download")
                                : fail("expired_download", expired.error),
                        );
                    }
                } else {
                    results.push(fail("entitlement_grant_download", "missing entitlement"));
                }

                // Refund
                const refund = initiateRefund({
                    orderId: began.orderId,
                    full: true,
                    providerAccepted: true,
                });
                results.push(refund.ok ? pass("refund") : fail("refund", refund.error));
            }
        }
    }

    // Failed / cancelled
    {
        const cart = createCartState([{ productId: "test-digital-pack", quantity: 1 }]);
        const began = beginServerCheckout({
            cart,
            customerId: "cust_test_1",
            paymentMode: PAYMENT_MODES.TEST,
            taxConfigured: true,
            taxCents: 0,
        });
        if (began.ok) {
            const failed = completeCheckoutFromProvider({ orderId: began.orderId, failed: true });
            results.push(failed.state === CHECKOUT_FLOW_STATES.FAILURE ? pass("failed_payment") : fail("failed_payment", failed.error));
        }
        const began2 = beginServerCheckout({
            cart,
            customerId: "cust_test_1",
            paymentMode: PAYMENT_MODES.TEST,
            taxConfigured: true,
            taxCents: 0,
        });
        if (began2.ok) {
            const cancelled = completeCheckoutFromProvider({ orderId: began2.orderId, cancelled: true });
            results.push(
                cancelled.state === CHECKOUT_FLOW_STATES.CANCELLED
                    ? pass("cancelled_checkout")
                    : fail("cancelled_checkout", cancelled.error),
            );
        }
    }

    // Webhooks
    {
        createOrderRecord({
            orderId: "ord_wh_1",
            customerId: "cust_test_1",
            totalCents: 999,
            status: ORDER_STATES.PAYMENT_PENDING,
            lineItems: [{ productId: "test-digital-pack", quantity: 1, unitAmountCents: 999, lineTotalCents: 999 }],
        });
        const sig = verifyWebhookSignature({
            payload: "{}",
            signatureHeader: "t=1,v1=abc",
            secret: "whsec_test",
            verifier: () => true,
        });
        results.push(sig.ok ? pass("webhook_signature_valid_path") : fail("webhook_signature_valid_path", sig.error));

        const invalid = verifyWebhookSignature({
            payload: "{}",
            signatureHeader: "t=1,v1=abc",
            secret: "whsec_test",
            verifier: () => false,
        });
        results.push(
            invalid.error === "SIGNATURE_INVALID"
                ? pass("invalid_webhook_rejected")
                : fail("invalid_webhook_rejected", invalid.error),
        );

        const first = handleWebhookEventArchitecture({
            eventId: "evt_1",
            eventType: "checkout.session.completed",
            orderId: "ord_wh_1",
            signatureOk: true,
        });
        const dup = handleWebhookEventArchitecture({
            eventId: "evt_1",
            eventType: "checkout.session.completed",
            orderId: "ord_wh_1",
            signatureOk: true,
        });
        results.push(first.ok && !first.duplicate ? pass("webhook_success") : fail("webhook_success", first.error));
        results.push(dup.ok && dup.duplicate ? pass("duplicate_webhook") : fail("duplicate_webhook", String(dup.duplicate)));
    }

    // Provider credential gate honesty
    if (!hasTestCreds) {
        results.push(
            skip(
                "provider_live_charge",
                "No Stripe sk_test_ credentials in env — provider-dependent charge SKIPPED (not fabricated).",
            ),
        );
    } else if (mode !== PAYMENT_MODES.TEST) {
        results.push(skip("provider_live_charge", `Payment mode is ${mode}, not TEST`));
    } else {
        results.push(
            pass(
                "provider_credentials_present",
                "Test credentials detected — wire Stripe SDK adapter in a later activation step before real test charges.",
            ),
        );
    }

    const failed = results.filter((r) => r.status === "FAIL");
    return {
        ok: failed.length === 0,
        mode,
        hasTestCreds,
        fabricatedPassingTransaction: false,
        results,
        failedCount: failed.length,
    };
}
