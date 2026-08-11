import { useMemo } from "react";
import SEO from "../components/SEO.jsx";
import { getPublicPageUrl } from "../data/publicPageRoutes.js";
import { getMonetizationString } from "../data/monetizationI18n.js";
import { MONETIZATION_FLAGS, isCheckoutLive, isStoreLive } from "../data/monetizationFlags.js";
import { listArchitecturePlaceholders, listPublicCommerceProducts } from "../data/commerce/platform/productCatalog.js";
import { createEmptyCart, assertCheckoutAllowed } from "../data/commerce/platform/checkoutArchitecture.js";
import { listAppPromos, getAppPromoCta } from "../data/promoAppsCatalog.js";

function StorePage({ onNavigate, locale = "en" }) {
    const products = useMemo(() => {
        const publicItems = listPublicCommerceProducts();
        if (publicItems.length) return publicItems;
        return listArchitecturePlaceholders().slice(0, 24);
    }, []);
    const apps = useMemo(() => listAppPromos(), []);
    const storeLive = isStoreLive();
    const title = getMonetizationString("storeTitle", locale);

    return (
        <main className="product-page">
            <SEO
                title={`${title} | Cin Nova`}
                description="Browse Cin Nova products. Hosted checkout remains offline until payments are explicitly activated."
                url={getPublicPageUrl("store")}
                type="website"
                noindex={!storeLive}
            />

            <section className="section">
                <div className="section-heading">
                    <p className="eyebrow">STORE</p>
                    <h1>{title}</h1>
                    <p role="status">
                        {storeLive
                            ? "Store flags are on — provider confirmation still required for purchases."
                            : getMonetizationString("storeOffline", locale)}
                    </p>
                    <p>
                        Phase M2: server-authoritative pricing + Stripe TEST mode architecture ready.
                        LIVE payments remain blocked until tax, legal review, and explicit approval.
                    </p>
                    <p>
                        Flags — store: {String(MONETIZATION_FLAGS.store)}, checkout:{" "}
                        {String(MONETIZATION_FLAGS.checkout)}, payments:{" "}
                        {String(MONETIZATION_FLAGS.payments)}
                    </p>
                </div>

                <div className="hero-actions" style={{ justifyContent: "center", gap: "12px" }}>
                    <button type="button" className="secondary-btn" style={{ minHeight: "44px" }} onClick={() => onNavigate?.("cart")}>
                        Cart
                    </button>
                    <button type="button" className="secondary-btn" style={{ minHeight: "44px" }} onClick={() => onNavigate?.("books")}>
                        Books
                    </button>
                    <button type="button" className="secondary-btn" style={{ minHeight: "44px" }} onClick={() => onNavigate?.("products")}>
                        Apps
                    </button>
                </div>
            </section>

            <section className="section" aria-label="Product catalog">
                <h2>Catalog (architecture)</h2>
                <ul>
                    {products.length === 0 && <li>No catalog entries.</li>}
                    {products.map((p) => (
                        <li key={p.id || p.slug}>
                            <strong>{p.name}</strong>
                            {p.category ? ` · ${p.category}` : ""}
                            {" — "}
                            {p.availability || p.launchStatus || "architecture"}
                            {p.recordKind === "architecture_placeholder" ? " (placeholder, not for sale)" : ""}
                        </li>
                    ))}
                </ul>
            </section>

            <section className="section" aria-label="App cross-promotion">
                <h2>Apps</h2>
                <ul>
                    {apps.map((app) => {
                        const cta = getAppPromoCta(app);
                        return (
                            <li key={app.id}>
                                <strong>{app.name}</strong> — {app.availability}. {app.description}{" "}
                                {cta.href ? (
                                    <a href={cta.href}>{cta.label}</a>
                                ) : (
                                    <span>{cta.label}</span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </section>
        </main>
    );
}

function CartPage({ onNavigate, locale = "en" }) {
    const cart = createEmptyCart();
    return (
        <main className="product-page">
            <SEO
                title="Cart | Cin Nova"
                description="Cin Nova shopping cart. Checkout is disabled until payments are authorized."
                url={getPublicPageUrl("cart")}
                type="website"
                noindex
            />
            <section className="section">
                <div className="section-heading">
                    <h1>Cart</h1>
                    <p role="status">{getMonetizationString("cartEmpty", locale)}</p>
                    <p>Items: {cart.items.length}. Total: {cart.total} {cart.currency} (server-validated totals only).</p>
                    <button type="button" className="primary-btn" style={{ minHeight: "44px" }} onClick={() => onNavigate?.("checkout")}>
                        Proceed to checkout
                    </button>
                </div>
            </section>
        </main>
    );
}

function CheckoutPage({ locale = "en" }) {
    const gate = assertCheckoutAllowed();
    const live = isCheckoutLive();
    return (
        <main className="product-page">
            <SEO
                title="Checkout | Cin Nova"
                description="Cin Nova checkout. Fails closed when payment providers are disabled."
                url={getPublicPageUrl("checkout")}
                type="website"
                noindex
            />
            <section className="section">
                <div className="section-heading">
                    <h1>Checkout</h1>
                    <p role="alert">
                        {live && gate.ok
                            ? "Checkout architecture ready — provider must confirm payment. No fake successes."
                            : getMonetizationString("checkoutDisabled", locale)}
                    </p>
                    {!gate.ok && <p>{gate.message}</p>}
                </div>
            </section>
        </main>
    );
}

export { StorePage, CartPage, CheckoutPage };
export default StorePage;
