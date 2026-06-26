import "../App.css";
import SEO from "../components/SEO.jsx";
import { siteUrl } from "../data/blogPosts.js";

const termsSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms of Service — Cin Nova",
    description:
        "Terms governing use of the Cin Nova website, blog, resources, and product information, including AI and informational disclaimers.",
    url: `${siteUrl}/?page=terms`,
    publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
};

const sections = [
    {
        title: "Agreement to terms",
        body: [
            "These Terms of Service (“Terms”) govern your access to and use of the Cin Nova website, blog, downloadable resources, and related pages (collectively, the “Site”). By using the Site, you agree to these Terms.",
            "If you do not agree, do not use the Site.",
        ],
    },
    {
        title: "Informational content only",
        body: [
            "Articles, guides, resource downloads, product descriptions, and other materials on the Site are provided for general informational and educational purposes only.",
            "Content may become outdated, incomplete, or inaccurate. We do not guarantee that any information on the Site is current, complete, or suitable for your situation.",
        ],
    },
    {
        title: "AI limitations",
        body: [
            "Cin Nova products and Site content may reference or demonstrate artificial intelligence features. AI-generated or AI-assisted outputs can be incorrect, incomplete, biased, or misleading.",
            "Do not rely on AI outputs as a sole source of truth for decisions involving health, safety, legal matters, finances, education outcomes, or emergencies.",
        ],
    },
    {
        title: "No professional advice",
        body: [
            "Nothing on the Site constitutes medical, veterinary, legal, tax, investment, engineering, or other professional advice.",
            "PoisonGuard and related safety content are not a substitute for professional medical, veterinary, emergency, or poison-control advice. In an emergency, call 911 or Poison Control at 1-800-222-1222 in the U.S.",
            "Always seek qualified professionals before making decisions that could affect health, safety, property, or finances.",
        ],
    },
    {
        title: "User responsibility",
        body: [
            "You are responsible for how you use the Site and any information obtained from it. You agree to verify important information through authoritative sources before acting on it.",
            "You are responsible for maintaining the security of your devices, accounts, and any data stored locally in your browser when using Site features.",
        ],
    },
    {
        title: "Acceptable use",
        body: [
            "You agree not to misuse the Site, including by attempting unauthorized access, interfering with Site operation, scraping or harvesting data in violation of applicable law, uploading malware, or using the Site for unlawful, harassing, or fraudulent activity.",
            "You may not imply endorsement, partnership, or affiliation with Cin Nova without our prior written consent.",
            "We may suspend or restrict access if we reasonably believe these Terms have been violated.",
        ],
    },
    {
        title: "Intellectual property",
        body: [
            "The Site, including its design, text, graphics, logos, and software, is owned by Cin Nova or its licensors and is protected by applicable intellectual property laws.",
            "You may view and download resources made available for personal, non-commercial use unless a specific resource states otherwise. You may not reproduce, distribute, or create derivative works without permission.",
        ],
    },
    {
        title: "Third-party links and services",
        body: [
            "The Site may link to third-party websites or services (for example, analytics providers or image hosts). We are not responsible for third-party content, policies, or practices.",
        ],
    },
    {
        title: "Disclaimer of warranties",
        body: [
            'The Site is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement.',
        ],
    },
    {
        title: "Limitation of liability",
        body: [
            "To the fullest extent permitted by law, Cin Nova and its officers, directors, employees, and affiliates will not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, or goodwill, arising from your use of the Site.",
            "Our total liability for any claim relating to the Site will not exceed the greater of one hundred U.S. dollars (USD $100) or the amount you paid us, if any, in the twelve months before the claim.",
        ],
    },
    {
        title: "Changes",
        body: [
            "We may update these Terms from time to time. The “Last updated” date below indicates when they were last revised. Continued use after changes constitutes acceptance of the updated Terms.",
        ],
    },
    {
        title: "Contact",
        body: [
            "For questions about these Terms, contact us through the Contact page.",
            `Contact page: ${siteUrl}/?page=contact`,
        ],
    },
];

function TermsOfService({ onNavigate }) {
    return (
        <main className="product-page legal-page">
            <SEO
                title="Terms of Service | Cin Nova"
                description="Terms governing use of the Cin Nova website, including informational disclaimers, AI limitations, acceptable use, and limitation of liability."
                url={`${siteUrl}/?page=terms`}
                type="website"
                schema={termsSchema}
            />

            <section className="section legal-hero">
                <div className="section-heading">
                    <p className="eyebrow">LEGAL</p>
                    <h1>Terms of Service</h1>
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
                    Questions about these Terms?{" "}
                    <button type="button" className="legal-inline-link" onClick={() => onNavigate?.("contact")}>
                        Contact Cin Nova
                    </button>
                    .
                </p>
            </section>
        </main>
    );
}

export default TermsOfService;
