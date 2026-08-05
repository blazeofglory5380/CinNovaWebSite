import { useEffect, useState } from "react";
import "../App.css";
import "./LegalCenter.css";
import SEO from "../components/SEO.jsx";
import BusinessHero from "../components/business/BusinessHero.jsx";
import BusinessSection from "../components/business/BusinessSection.jsx";
import BusinessCTABanner from "../components/business/BusinessCTABanner.jsx";
import { getPublicPageUrl } from "../data/publicPageRoutes.js";
import { siteUrl } from "../data/seoConfig.js";
import { buildBreadcrumbSchema, withSchemaGraph } from "../data/schemaHelpers.js";
import {
    NEWSLETTER_CATEGORIES,
    NEWSLETTER_CONTACT_EMAIL,
    NEWSLETTER_FORMATS,
    NEWSLETTER_FREQUENCIES,
    NEWSLETTER_PREMIUM,
    NEWSLETTER_PRIVACY_CONTROLS,
    getDefaultCategoryKeys,
    normalizePreferences,
} from "../data/newsletterProgram.js";
import { safeJsonParse } from "../utils/security.js";
import { trackEvent } from "../utils/analytics.js";

const STORAGE_KEY = "cinNovaNewsletterPreferences";

function readStoredPreferences() {
    if (typeof window === "undefined") {
        return normalizePreferences({ categories: getDefaultCategoryKeys() });
    }
    return normalizePreferences(safeJsonParse(window.localStorage.getItem(STORAGE_KEY), {}));
}

const preferencesSchema = withSchemaGraph(
    {
        "@type": "WebPage",
        name: "Email Preferences & Privacy Controls | Cin Nova Newsletter",
        description:
            "Choose which Cin Nova newsletter editions you receive, cap delivery frequency, switch to plain text, or request a data export or deletion.",
        url: getPublicPageUrl("newsletter-preferences"),
        publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
    },
    buildBreadcrumbSchema([
        { name: "Home", url: siteUrl },
        { name: "Newsletter", url: `${siteUrl}/newsletter` },
        { name: "Email preferences", url: getPublicPageUrl("newsletter-preferences") },
    ]),
);

/**
 * Preference center.
 *
 * Selections are stored in this browser only. There is no subscriber account
 * system yet, so the page is explicit that saving here sets your local defaults
 * and that changing a live subscription still goes through the link in an email
 * — rather than pretending to update a record that does not exist.
 */
function NewsletterPreferences({ onNavigate }) {
    const [prefs, setPrefs] = useState(() => normalizePreferences({ categories: getDefaultCategoryKeys() }));
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setPrefs(readStoredPreferences());
    }, []);

    function toggleCategory(key) {
        setSaved(false);
        setPrefs((current) => {
            const has = current.categories.includes(key);
            return {
                ...current,
                categories: has
                    ? current.categories.filter((item) => item !== key)
                    : [...current.categories, key],
            };
        });
    }

    function update(field, value) {
        setSaved(false);
        setPrefs((current) => ({ ...current, [field]: value }));
    }

    function save() {
        const normalized = normalizePreferences(prefs);
        setPrefs(normalized);
        if (typeof window !== "undefined") {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        }
        setSaved(true);
        trackEvent("newsletter_preferences_save", {
            categories: normalized.categories.join(","),
            frequency: normalized.frequency,
            format: normalized.format,
        });
    }

    function reset() {
        const defaults = normalizePreferences({ categories: getDefaultCategoryKeys() });
        setPrefs(defaults);
        if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
        setSaved(false);
    }

    return (
        <main className="product-page business-center-page lg-page">
            <SEO
                title="Email Preferences & Privacy Controls | Cin Nova Newsletter"
                description="Choose which Cin Nova editions you receive, cap delivery to a weekly or monthly digest, switch to tracking-free plain text, or request a data export or deletion at any time."
                url={getPublicPageUrl("newsletter-preferences")}
                type="website"
                schema={preferencesSchema}
            />

            <BusinessHero
                eyebrow="EMAIL PREFERENCES"
                title="Decide exactly what arrives, and how often."
                description="Six editions, three delivery caps, and a plain-text option with no tracking pixel. Every control here is real — none of them is a dark pattern that quietly re-subscribes you later."
                pills={["Per-edition control", "Digest caps", "Plain text", "Data export and deletion"]}
                actions={[
                    { label: "Subscribe", onClick: () => onNavigate?.("newsletter") },
                    { label: "Read the archive", onClick: () => onNavigate?.("newsletter-archive"), variant: "secondary" },
                ]}
            />

            <BusinessSection
                eyebrow="HOW THIS PAGE WORKS"
                title="Saved in your browser, not in an account"
                description="CinNova has no subscriber login yet, so this page stores your choices locally and applies them when you subscribe from this device."
            >
                <div className="newsletter-card bc-list-card">
                    <p>
                        To change an existing live subscription, use the preference link in the footer of any
                        email you have received, or email{" "}
                        <a href={`mailto:${NEWSLETTER_CONTACT_EMAIL}`}>{NEWSLETTER_CONTACT_EMAIL}</a>. Saving
                        here does not reach into a list you already joined from another device — and the page
                        says so rather than letting you believe otherwise.
                    </p>
                </div>
            </BusinessSection>

            <BusinessSection eyebrow="EDITIONS" title="What you want to receive" className="showcase-section">
                <form className="lg-prefs" onSubmit={(event) => { event.preventDefault(); save(); }}>
                    <fieldset className="lg-fieldset">
                        <legend>Editions</legend>
                        <div className="lg-option-grid">
                            {NEWSLETTER_CATEGORIES.map((category) => (
                                <label className="lg-option" key={category.key}>
                                    <input
                                        type="checkbox"
                                        checked={prefs.categories.includes(category.key)}
                                        onChange={() => toggleCategory(category.key)}
                                    />
                                    <span>
                                        <strong>{category.label}</strong>
                                        <em>{category.cadence}</em>
                                        {category.blurb}
                                    </span>
                                </label>
                            ))}
                        </div>
                        {prefs.categories.length === 0 && (
                            <p className="lg-hint" role="status">
                                Nothing selected. Saving with no editions is the same as unsubscribing, so the
                                default two will be restored instead.
                            </p>
                        )}
                    </fieldset>

                    <fieldset className="lg-fieldset">
                        <legend>How often</legend>
                        <div className="lg-option-grid">
                            {NEWSLETTER_FREQUENCIES.map((option) => (
                                <label className="lg-option" key={option.key}>
                                    <input
                                        type="radio"
                                        name="frequency"
                                        value={option.key}
                                        checked={prefs.frequency === option.key}
                                        onChange={() => update("frequency", option.key)}
                                    />
                                    <span>
                                        <strong>{option.label}</strong>
                                        {option.note}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <fieldset className="lg-fieldset">
                        <legend>Format</legend>
                        <div className="lg-option-grid">
                            {NEWSLETTER_FORMATS.map((option) => (
                                <label className="lg-option" key={option.key}>
                                    <input
                                        type="radio"
                                        name="format"
                                        value={option.key}
                                        checked={prefs.format === option.key}
                                        onChange={() => update("format", option.key)}
                                    />
                                    <span>
                                        <strong>{option.label}</strong>
                                        {option.note}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <div className="lg-prefs-actions">
                        <button type="submit" className="primary-btn">
                            Save preferences
                        </button>
                        <button type="button" className="secondary-btn" onClick={reset}>
                            Reset to defaults
                        </button>
                        {saved && (
                            <p className="lg-saved" role="status">
                                Saved in this browser.
                            </p>
                        )}
                    </div>
                </form>
            </BusinessSection>

            <BusinessSection
                eyebrow="PRIVACY CONTROLS"
                title="What you can always do"
                description="These are commitments, not settings that quietly stop working."
            >
                <div className="product-grid">
                    {NEWSLETTER_PRIVACY_CONTROLS.map((control) => (
                        <article className="product-card" key={control.key}>
                            <p className="product-category">Control</p>
                            <h3>{control.title}</h3>
                            <p>{control.detail}</p>
                        </article>
                    ))}
                </div>
            </BusinessSection>

            <BusinessSection
                eyebrow="PREMIUM"
                title={`${NEWSLETTER_PREMIUM.name} — ${NEWSLETTER_PREMIUM.status}`}
                description={NEWSLETTER_PREMIUM.summary}
                className="showcase-section"
            >
                <div className="newsletter-card bc-list-card">
                    <h3>Planned benefits</h3>
                    <ul className="partner-type-benefits">
                        {NEWSLETTER_PREMIUM.plannedBenefits.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                    <h3>Commitments if it launches</h3>
                    <ul className="partner-type-benefits">
                        {NEWSLETTER_PREMIUM.commitments.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                    <p>
                        There is no signup, no waitlist charge, and no payment collected. Nothing on this page
                        can be bought.
                    </p>
                </div>
            </BusinessSection>

            <BusinessCTABanner
                eyebrow="RELATED"
                title="Read the policies behind these controls"
                description="The cookie policy explains what is stored in your browser, and the privacy policy covers the subscriber record itself."
                primaryLabel="Cookie policy"
                onPrimary={() => onNavigate?.("legal-cookie-policy")}
                secondaryLabel="Privacy policy"
                onSecondary={() => onNavigate?.("privacy")}
            />
        </main>
    );
}

export default NewsletterPreferences;
