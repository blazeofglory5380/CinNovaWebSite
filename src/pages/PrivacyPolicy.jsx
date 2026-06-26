import "../App.css";
import SEO from "../components/SEO.jsx";
import { siteUrl } from "../data/blogPosts.js";

const privacySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy — Cin Nova",
    description:
        "How Cin Nova collects, uses, and protects information on cin-nova-web-site.vercel.app, including analytics, newsletter signups, downloads, and contact forms.",
    url: `${siteUrl}/?page=privacy`,
    publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
};

const sections = [
    {
        title: "Overview",
        body: [
            "Cin Nova (“we,” “us,” or “our”) operates the Cin Nova public website and related product pages. This Privacy Policy explains what information we collect, how we use it, and the choices you have.",
            "By using this site, you agree to the practices described here. If you do not agree, please do not use the site.",
        ],
    },
    {
        title: "Information we collect",
        body: [
            "Newsletter signups: When you subscribe to our newsletter or join a product waitlist, we collect the email address you provide and optional details such as your name, interests, or product tags associated with the signup form.",
            "Contact form: When you use the Contact page, we collect your name, email address, inquiry type, and message content. Submissions are validated in your browser; we do not currently transmit contact form data to a third-party backend from this site.",
            "Resource and image downloads: When you download guides, checklists, or other resources, we may record which resource was accessed. Downloaded files may include images and documents stored on or linked from our site.",
            "Analytics: We use Google Analytics 4 (GA4) to understand how visitors use the site. GA4 may collect information such as pages viewed, approximate location (derived from IP), device and browser type, referral source, and interaction events. We configure analytics using a measurement ID supplied through environment configuration, not through public source code secrets.",
            "localStorage: Parts of this site store data in your browser’s localStorage, including newsletter subscriber records used for on-site administration, blog management drafts, and session flags (for example, whether a newsletter popup was dismissed). This data stays on your device unless you clear site data.",
        ],
    },
    {
        title: "How we use information",
        body: [
            "We use collected information to operate and improve the website, deliver newsletters and product updates, respond to inquiries, measure content performance, and develop Cin Nova products.",
            "We do not sell your personal information. We do not use newsletter or contact data for unrelated third-party marketing without your consent.",
        ],
    },
    {
        title: "Analytics and cookies",
        body: [
            "Google Analytics 4 may set cookies or use similar technologies to distinguish unique visitors and measure traffic. You can limit analytics collection through browser settings, privacy extensions, or Google’s opt-out tools.",
            "Our Content Security Policy allows connections to Google Analytics and Google Tag Manager domains required for measurement.",
        ],
    },
    {
        title: "Data retention",
        body: [
            "Newsletter and admin-related records stored in localStorage remain until you clear browser storage or we update the site’s storage logic.",
            "Analytics data is retained according to Google Analytics settings and policies.",
            "Contact form messages are not persistently stored on a server by this site at this time; treat any future backend integration as subject to an updated policy.",
        ],
    },
    {
        title: "Your rights and choices",
        body: [
            "Depending on where you live, you may have rights to access, correct, delete, or restrict certain processing of your personal information.",
            "You may unsubscribe from marketing emails using the unsubscribe mechanism in our messages when available, or by contacting us.",
            "You can clear local site data through your browser settings to remove localStorage entries associated with this site.",
        ],
    },
    {
        title: "Data deletion requests",
        body: [
            "To request deletion of personal information we hold about you (such as a newsletter subscription once backend processing is enabled), contact us through the Contact page and include “Privacy — Data Deletion Request” in your message along with the email address associated with your request.",
            `Contact page: ${siteUrl}/?page=contact`,
        ],
    },
    {
        title: "Children’s privacy",
        body: [
            "This site is intended for a general audience. We do not knowingly collect personal information from children under 13 without appropriate parental consent. If you believe a child has provided personal information, contact us so we can take appropriate steps.",
        ],
    },
    {
        title: "Changes to this policy",
        body: [
            "We may update this Privacy Policy from time to time. The “Last updated” date below reflects the most recent revision. Continued use of the site after changes constitutes acceptance of the updated policy.",
        ],
    },
];

function PrivacyPolicy({ onNavigate }) {
    return (
        <main className="product-page legal-page">
            <SEO
                title="Privacy Policy | Cin Nova"
                description="Learn how Cin Nova handles analytics, newsletter signups, resource downloads, localStorage, contact forms, and your privacy rights."
                url={`${siteUrl}/?page=privacy`}
                type="website"
                schema={privacySchema}
            />

            <section className="section legal-hero">
                <div className="section-heading">
                    <p className="eyebrow">LEGAL</p>
                    <h1>Privacy Policy</h1>
                    <p className="legal-updated">Last updated: June 26, 2026</p>
                </div>
            </section>

            <section className="section legal-content">
                {sections.map((section) => (
                    <article key={section.title} className="legal-section">
                        <h2>{section.title}</h2>
                        {section.body.map((paragraph) => (
                            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                        ))}
                    </article>
                ))}
                <p className="legal-contact">
                    Questions about this policy?{" "}
                    <button type="button" className="legal-inline-link" onClick={() => onNavigate?.("contact")}>
                        Contact Cin Nova
                    </button>
                    .
                </p>
            </section>
        </main>
    );
}

export default PrivacyPolicy;
