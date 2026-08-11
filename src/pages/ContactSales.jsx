import SEO from "../components/SEO.jsx";
import { getPublicPageUrl } from "../data/publicPageRoutes.js";
import { getMonetizationString } from "../data/monetizationI18n.js";
import { MONETIZATION_FLAGS } from "../data/monetizationFlags.js";
import { trackSponsorCtaClick } from "../utils/analytics.js";

/**
 * Dedicated sales inquiry surface — no live booking or payments.
 */
function ContactSales({ onNavigate, locale = "en" }) {
    const title = getMonetizationString("contactSalesTitle", locale);

    function go(destination) {
        trackSponsorCtaClick({
            page: "contact-sales",
            cta: destination,
            target: destination,
        });
        onNavigate?.(destination);
    }

    return (
        <main className="product-page business-center-page">
            <SEO
                title={`${title} | Cin Nova`}
                description="Contact Cin Nova sales for sponsorships, newsletter sponsorship, display advertising, branded content, app sponsorship, and product partnerships."
                url={getPublicPageUrl("contact-sales")}
                type="website"
            />

            <section className="section">
                <div className="section-heading">
                    <p className="eyebrow">SALES</p>
                    <h1>{title}</h1>
                    <p>
                        Sponsorship, advertising, newsletter placements, app sponsorship, and
                        product partnership inquiries. Intrusive ads are not enabled
                        {MONETIZATION_FLAGS.ads ? "" : " (ads flag off)"}.
                    </p>
                </div>

                <div className="product-grid" style={{ maxWidth: "880px", margin: "0 auto" }}>
                    {[
                        { label: "General contact form", page: "contact" },
                        { label: "Media kit & rates", page: "media-kit" },
                        { label: "Advertise", page: "advertise" },
                        { label: "Sponsor the newsletter", page: "sponsor-newsletter" },
                        { label: "Partner with us", page: "partner-with-us" },
                        { label: "Press", page: "press-center" },
                    ].map((item) => (
                        <button
                            key={item.page}
                            type="button"
                            className="primary-btn"
                            style={{ minHeight: "44px" }}
                            onClick={() => go(item.page)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default ContactSales;
