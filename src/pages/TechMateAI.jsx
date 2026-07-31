import "../App.css";
// Shared dark ecosystem tokens + the shared below-hero dark theme, then the
// TechMate-specific layout for the Phase 3D sections. All load after App.css so
// they win over the light defaults. Hero CSS (.tmxr-hero) is untouched.
import "../styles/brand-dna.css";
import "./ProductDark.css";
import "./TechMateAI.css";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import TechMateHero from "../components/TechMateHero.jsx";
import TechMateFeatureCards from "../components/TechMateFeatureCards.jsx";
import { saveSubscriber } from "../data/newsletterService.js";
import SEO from "../components/SEO.jsx";
import { siteUrl } from "../data/blogPosts.js";
import { getProductUrl } from "../data/products.js";
import { MotionCardWrap } from "../motion/MotionCardWrap.jsx";
import { MotionSectionWrap } from "../motion/MotionSectionWrap.jsx";
import { MotionAiPanelWrap } from "../motion/MotionAiPanelWrap.jsx";

// ── Section data ────────────────────────────────────────────────────────────

// How TechMate AI helps — the honest, everyday-focused set from the brief.
// Rendered by TechMateFeatureCards (circuit-inspired icon panels, no photos).
const helpCards = [
    {
        category: "Devices",
        title: "Diagnose common device problems",
        description:
            "Describe what your laptop, phone, printer, or tablet is doing and TechMate AI helps narrow down the most likely cause in plain language.",
    },
    {
        category: "Errors",
        title: "Explain error messages",
        description:
            "Paste a confusing error code or message and get a clear, jargon-free explanation of what it means and what to check next.",
    },
    {
        category: "Setup",
        title: "Guide setup and installation",
        description:
            "Walk through installing software, connecting a new device, or changing a setting one calm, clearly explained step at a time.",
    },
    {
        category: "Smart Home",
        title: "Help with smart-home issues",
        description:
            "Work through Wi-Fi, smart plugs, speakers, cameras, and other connected-home gadgets that won't cooperate.",
    },
    {
        category: "Support",
        title: "Organize repair/support steps",
        description:
            "Keep track of what you have already tried and what to do next, so troubleshooting stays organized instead of overwhelming.",
    },
];

// Troubleshooting workflow preview — non-interactive, five plain steps.
const workflowSteps = [
    {
        step: "1",
        title: "Describe the issue",
        description: "Tell TechMate AI what's going wrong in your own words — no technical vocabulary required.",
    },
    {
        step: "2",
        title: "Add device or app details",
        description: "Share what device, operating system, or app you're using so the guidance fits your situation.",
    },
    {
        step: "3",
        title: "Get likely causes",
        description: "See the most probable reasons for the problem, explained simply and ranked by how common they are.",
    },
    {
        step: "4",
        title: "Follow guided troubleshooting steps",
        description: "Work through clear, ordered steps at your own pace, checking what helps as you go.",
    },
    {
        step: "5",
        title: "Know when to contact support or a technician",
        description: "If a fix needs a professional, TechMate AI tells you plainly — it never pretends to replace real repair help.",
    },
];

// Coming-soon roadmap — everything below is in development, not live.
const roadmapItems = [
    {
        title: "AI troubleshooting assistant",
        description: "Conversational, step-by-step help that turns a vague problem into a clear plan of what to try.",
    },
    {
        title: "Device setup guides",
        description: "Guided walkthroughs for connecting and configuring new devices without the manual.",
    },
    {
        title: "Smart-home support",
        description: "Focused help for connected-home gear — Wi-Fi, plugs, cameras, speakers, and hubs.",
    },
    {
        title: "Error-message explainer",
        description: "Plain-language explanations for error codes and cryptic pop-ups, with what to check next.",
    },
    {
        title: "Repair checklist builder",
        description: "Turn a troubleshooting session into an organized checklist you can follow and revisit.",
    },
    {
        title: "Support history dashboard",
        description: "Keep a simple record of past issues and fixes so you're never solving the same thing twice.",
    },
    {
        title: "Business IT support tools",
        description: "Team-friendly troubleshooting and shared knowledge for small businesses — planned for a later release.",
        future: true,
    },
];

const techmateSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TechMate AI",
    applicationCategory: "UtilitiesApplication",
    description:
        "An AI-powered tech support companion in development by Cin Nova. It helps people understand device, computer, smart-home, and software problems and follow clearer step-by-step troubleshooting.",
    operatingSystem: "Web",
    url: getProductUrl("techmate"),
    // No Offer — products are not sold on-site; do not invent price 0.
    publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
};

function TechMateAI() {
    return (
        <div className="product-page techmate-landing brand-dna">
            <SEO
                title="TechMate AI | AI Tech Support Companion — Cin Nova"
                description="TechMate AI is an AI-powered tech support companion in development by Cin Nova. It turns confusing device, computer, smart-home, and software problems into simple step-by-step guidance."
                url={getProductUrl("techmate")}
                type="website"
                schema={techmateSchema}
            />

            {/* Hero — UNTOUCHED. .tmxr-hero sets its own background, color, and
                font, isolated from the brand-dna layer. Do not modify. */}
            <TechMateHero primaryHref="#waitlist" secondaryHref="#product-ecosystem-title" />

            <section className="tm-trust-bar" aria-label="TechMate AI highlights">
                <div className="tm-trust-inner">
                    <span>Built for everyday tech problems</span>
                    <span>Plain-language troubleshooting</span>
                    <span>Part of the Cin Nova ecosystem</span>
                </div>
            </section>

            {/* ── 1. Product clarity ───────────────────────────────────────── */}
            <section className="section" aria-labelledby="tm-clarity-title">
                <div className="tm-clarity-grid">
                    <div className="tm-clarity-copy">
                        <p className="eyebrow">WHAT IS TECHMATE AI</p>
                        <h2 id="tm-clarity-title">Tech support, simplified by AI.</h2>
                        <p>
                            TechMate AI helps people understand tech problems, organize symptoms, and follow clearer
                            troubleshooting steps for devices, apps, smart-home tools, and everyday computer issues.
                        </p>
                        <p>
                            It's for anyone who feels stuck when something won't work — no IT background needed. Instead of
                            confusing forums and hold music, TechMate AI turns a frustrating problem into calm, plain-language
                            steps you can actually follow.
                        </p>
                        <p>
                            TechMate AI is being developed as part of the Cin Nova ecosystem. It is not yet live, and it is not
                            a real-time device scanner — it's a guidance companion that helps you think through the fix.
                        </p>
                    </div>

                    <div className="tm-clarity-panel">
                        <div>
                            <p className="tm-clarity-list-label">Good for</p>
                            <ul className="tm-clarity-list tm-clarity-list--yes">
                                <li>Everyday device, app, and computer problems</li>
                                <li>Understanding error messages in plain language</li>
                                <li>Setting up and connecting new devices</li>
                                <li>Sorting out smart-home and Wi-Fi headaches</li>
                            </ul>
                        </div>
                        <hr className="tm-clarity-divider" />
                        <div>
                            <p className="tm-clarity-list-label">Not a replacement for</p>
                            <ul className="tm-clarity-list tm-clarity-list--no">
                                <li>Professional hardware repair or IT services</li>
                                <li>Scanning or controlling your devices in real time</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 2. How TechMate AI helps ─────────────────────────────────── */}
            <section className="section" id="features" aria-labelledby="tm-help-title">
                <div className="section-heading">
                    <p className="eyebrow">HOW TECHMATE AI HELPS</p>
                    <h2 id="tm-help-title">Five ways TechMate AI makes tech less stressful</h2>
                    <p>
                        Each one is focused on helping you understand the problem and take the next step with confidence.
                    </p>
                </div>

                <TechMateFeatureCards features={helpCards} />
            </section>

            {/* ── 3. Troubleshooting workflow preview (non-interactive) ────── */}
            <section className="section" aria-labelledby="tm-workflow-title">
                <div className="section-heading">
                    <p className="eyebrow">HOW IT WILL WORK</p>
                    <h2 id="tm-workflow-title">Your troubleshooting flow, step by step</h2>
                    <p>A calm, repeatable path from “something's wrong” to “here's what to do.”</p>
                </div>

                <div className="tm-workflow-grid">
                    {workflowSteps.map((item) => (
                        <MotionCardWrap as="article" key={item.step} className="tm-step">
                            <span className="tm-step-num" aria-hidden="true">{item.step}</span>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </MotionCardWrap>
                    ))}
                </div>
            </section>

            {/* ── Illustrative example — early concept, clearly not a live demo ── */}
            <section className="section" aria-labelledby="tm-example-title">
                <div className="section-heading">
                    <p className="eyebrow">EARLY CONCEPT</p>
                    <h2 id="tm-example-title">What guided help is meant to feel like</h2>
                </div>

                <div className="tm-example-wrap">
                    <MotionCardWrap as="div" className="showcase-card">
                        <div className="chat-user">My Wi-Fi keeps dropping every few minutes.</div>
                        <MotionAiPanelWrap className="chat-ai">
                            Let's narrow it down together. First, does it drop on <strong>every</strong> device or just one?
                            <br /><br />
                            If it's every device, the router or your connection is the likely cause. If it's only one device,
                            we'll focus there instead.
                            <br /><br />
                            A good first step either way: unplug the router for 30 seconds, plug it back in, and watch whether the
                            drops continue. Tell me what you notice and we'll take the next step from there.
                        </MotionAiPanelWrap>
                    </MotionCardWrap>
                    <p className="tm-example-note">
                        Illustrative example of the assistant's step-by-step style. TechMate AI is still in development — this is
                        not a live demo, and it does not connect to or scan your devices.
                    </p>
                </div>
            </section>

            {/* ── 4. Coming-soon roadmap ───────────────────────────────────── */}
            <section className="section" aria-labelledby="tm-roadmap-title">
                <div className="section-heading">
                    <p className="eyebrow">COMING SOON</p>
                    <h2 id="tm-roadmap-title">What's being built</h2>
                    <p>TechMate AI is in active development. Here's what the team is working toward.</p>
                </div>

                <div className="tm-roadmap-grid">
                    {roadmapItems.map((item) => (
                        <article
                            key={item.title}
                            className={`tm-roadmap-item${item.future ? " tm-roadmap-item--future" : ""}`}
                        >
                            <div className="tm-roadmap-head">
                                <h3>{item.title}</h3>
                                <span className="tm-roadmap-status">
                                    {item.future ? "Planned later" : "In development"}
                                </span>
                            </div>
                            <p>{item.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* ── 5. Early-access CTA (honest) ─────────────────────────────── */}
            <section className="section" id="waitlist" aria-labelledby="tm-cta-title">
                <MotionSectionWrap className="newsletter-card">
                    <p className="eyebrow">EARLY ACCESS</p>
                    <h2 id="tm-cta-title">Join the TechMate AI early access list.</h2>
                    <p className="tm-cta-sub">
                        TechMate AI is not yet live. Add your email to get updates as the product develops and an invitation when
                        early access opens. No spam — unsubscribe anytime.
                    </p>
                    <NewsletterSignup
                        onSubscribe={saveSubscriber}
                        source="TechMate AI Early Access"
                        tags={["TechMate AI", "Early Access"]}
                        buttonLabel="Join Early Access"
                    />
                    <p className="tm-eco-line">
                        Curious about the rest of the lineup?{" "}
                        <a href="#product-ecosystem-title" className="tm-eco-link">Explore all CinNova products ↓</a>
                    </p>
                </MotionSectionWrap>
            </section>
        </div>
    );
}

export default TechMateAI;
