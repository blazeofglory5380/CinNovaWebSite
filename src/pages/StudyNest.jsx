import "../App.css";
import SEO from "../components/SEO.jsx";
import StudyNestHero from "../components/StudyNestHero.jsx";
import FeaturePhotoCard from "../components/FeaturePhotoCard.jsx";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import MarketingPhoto from "../components/MarketingPhoto.jsx";
import { productMarketing } from "../data/marketingImages.js";
import { productHero3DConfigs } from "../data/productHero3D.js";
import { saveSubscriber } from "../data/newsletterService.js";
import { siteUrl } from "../data/seoConfig.js";
import { buildFaqSchema, buildImageObject, withSchemaGraph } from "../data/schemaHelpers.js";
import { MotionCardWrap } from "../motion/MotionCardWrap.jsx";
import { MotionSectionWrap } from "../motion/MotionSectionWrap.jsx";
import { MotionAiPanelWrap } from "../motion/MotionAiPanelWrap.jsx";

const { features } = productMarketing.studynest;
const studyNestHero = productHero3DConfigs.studynest;

const howItWorks = [
    {
        step: "01",
        title: "Capture your material",
        description:
            "Import class notes, lecture outlines, and reading highlights into organized subjects and topics.",
    },
    {
        step: "02",
        title: "Generate active practice",
        description:
            "Turn notes into flashcards, quizzes, and study guides automatically — ready for spaced repetition.",
    },
    {
        step: "03",
        title: "Review with AI support",
        description:
            "Ask the AI tutor to explain gaps, schedule review sessions, and track progress in one dashboard.",
    },
];

const audiences = [
    {
        title: "High school students",
        description: "Build consistent study habits across subjects with guided review and exam prep.",
    },
    {
        title: "College learners",
        description: "Manage dense coursework, lecture notes, and midterm cram sessions without app switching.",
    },
    {
        title: "Self-directed learners",
        description: "Structure independent study with flashcards, quizzes, and an always-available tutor.",
    },
    {
        title: "Parents & tutors",
        description: "Support learners with visible progress, organized materials, and repeatable study routines.",
    },
];

const pricingPlans = [
    {
        name: "Free",
        price: "$0",
        description: "Basic notes, flashcards, and starter quizzes to begin studying smarter.",
        featured: false,
    },
    {
        name: "Student Pro",
        price: "$9.99/mo",
        description: "AI Tutor, unlimited notes, quizzes, study guides, and priority feature access.",
        featured: true,
    },
    {
        name: "School Plan",
        price: "Coming Soon",
        description: "Teacher tools, classrooms, and student progress dashboards for schools.",
        featured: false,
    },
];

const faqItems = [
    {
        question: "When will StudyNest launch?",
        answer:
            "StudyNest is in active development. Join the waitlist to get launch updates and early access invitations.",
    },
    {
        question: "Who is StudyNest for?",
        answer:
            "StudyNest is built for students who want one workspace for notes, flashcards, quizzes, and AI tutoring — from high school through college.",
    },
    {
        question: "How is StudyNest different from flashcard apps?",
        answer:
            "Most apps handle one piece of studying. StudyNest connects note capture, practice generation, scheduling, and AI explanations in a single flow.",
    },
    {
        question: "Will there be a free plan?",
        answer: "Yes. StudyNest will launch with a free tier for core notes and flashcards, plus Student Pro for advanced AI features.",
    },
];

const studynestSchema = withSchemaGraph(
    {
        "@type": "SoftwareApplication",
        name: "StudyNest",
        applicationCategory: "EducationApplication",
        description:
            "AI-powered study tools with notes, flashcards, quizzes, AI tutoring, and study planning for students.",
        operatingSystem: "Web",
        url: `${siteUrl}/?page=studynest`,
        screenshot: buildImageObject({ src: studyNestHero.posterSrc, alt: studyNestHero.alt }),
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
    },
    buildFaqSchema(faqItems),
);

function StudyNest() {
    return (
        <main className="product-page studynest-landing">
            <SEO
                title="StudyNest | AI Study Tools for Students — Cin Nova"
                description="StudyNest helps students organize notes, generate flashcards, take quizzes, create study guides, and get AI tutoring support. Currently in development by Cin Nova."
                url={`${siteUrl}/?page=studynest`}
                type="website"
                schema={studynestSchema}
            />

            {/* Main StudyNest hero — animated glowing-book spotlight. Renders
                the page <h1>. Primary CTA uses a placeholder anchor until a
                StudyNest articles route exists (see TODO in StudyNestHero);
                secondary links to the on-page Cin Nova ecosystem section. */}
            <StudyNestHero
                headingLevel="h1"
                primaryHref="#studynest-articles"
                secondaryHref="#product-ecosystem-title"
            />

            <section className="sn-trust-bar" aria-label="StudyNest value highlights">
                <div className="sn-trust-inner">
                    <span>Built for modern students</span>
                    <span>Notes → practice → review in one flow</span>
                    <span>Part of the Cin Nova ecosystem</span>
                </div>
            </section>

            <section className="section sn-problem" aria-labelledby="sn-problem-title">
                <div className="sn-problem-grid">
                    <div className="sn-problem-copy">
                        <p className="eyebrow">WHY STUDYNEST</p>
                        <h2 id="sn-problem-title">Stop rereading. Start remembering.</h2>
                        <p>
                            Students often split notes, flashcards, calendars, and tutoring across four different apps.
                            That fragmentation creates hidden work — switching tools feels like progress, but retention
                            suffers.
                        </p>
                        <p>
                            StudyNest turns your notes into active recall practice, schedules review around your exams,
                            and gives you an AI tutor that understands the material you are actually studying.
                        </p>
                    </div>
                    <div className="sn-problem-visual">
                        <MarketingPhoto
                            src="/images/education/ai-tutor-personalized-learning-dashboard.jpg"
                            alt="Student using a personalized AI learning dashboard on a laptop"
                            className="sn-problem-img"
                            loading="lazy"
                        />
                    </div>
                </div>
            </section>

            <section className="section sn-features" id="features" aria-labelledby="sn-features-title">
                <div className="sn-section-head">
                    <p className="eyebrow">FEATURES</p>
                    <h2 id="sn-features-title">Everything students need in one study workspace</h2>
                    <p>
                        From first lecture notes to final exam review — StudyNest keeps the full learning loop in one
                        connected product.
                    </p>
                </div>
                <div className="product-grid product-grid-photo sn-feature-grid">
                    {features.map((feature) => (
                        <FeaturePhotoCard key={feature.title} image={feature.src} alt={feature.alt} {...feature} />
                    ))}
                </div>
            </section>

            <section className="section sn-how" aria-labelledby="sn-how-title">
                <div className="sn-section-head">
                    <p className="eyebrow">HOW IT WORKS</p>
                    <h2 id="sn-how-title">A simple study loop you can repeat every week</h2>
                </div>
                <div className="sn-how-grid">
                    {howItWorks.map((item) => (
                        <MotionCardWrap as="article" key={item.step} className="sn-how-card">
                            <span className="sn-how-step">{item.step}</span>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </MotionCardWrap>
                    ))}
                </div>
            </section>

            <section className="section sn-preview" aria-labelledby="sn-preview-title">
                <div className="sn-section-head">
                    <p className="eyebrow">PRODUCT PREVIEW</p>
                    <h2 id="sn-preview-title">Study tools that feel simple, focused, and useful</h2>
                    <p>Early interface concepts showing how StudyNest supports explanation, recall, and planning.</p>
                </div>
                <div className="sn-preview-grid">
                    <MotionCardWrap as="article" className="sn-preview-card">
                        <p className="sn-preview-label">AI Tutor</p>
                        <h3>Ask questions in plain language</h3>
                        <div className="sn-chat">
                            <div className="sn-chat-user">What is photosynthesis?</div>
                            <MotionAiPanelWrap className="sn-chat-ai">
                                Plants use sunlight, water, and carbon dioxide to produce glucose and oxygen. Think of
                                it as the plant&apos;s way of making food from light.
                            </MotionAiPanelWrap>
                        </div>
                    </MotionCardWrap>
                    <MotionCardWrap as="article" className="sn-preview-card">
                        <p className="sn-preview-label">Flashcards</p>
                        <h3>Active recall built in</h3>
                        <div className="sn-flashcard">
                            <p className="sn-flashcard-prompt">What is active recall?</p>
                            <p className="sn-flashcard-answer">Testing yourself instead of only rereading notes.</p>
                        </div>
                    </MotionCardWrap>
                    <MotionCardWrap as="article" className="sn-preview-card sn-preview-card-wide">
                        <p className="sn-preview-label">Study Planner</p>
                        <h3>See what to review next</h3>
                        <div className="sn-planner-rows">
                            <div className="sn-planner-row">
                                <span>Biology — Flashcards</span>
                                <strong>Today · 20 min</strong>
                            </div>
                            <div className="sn-planner-row">
                                <span>History — Quiz review</span>
                                <strong>Tomorrow · 15 min</strong>
                            </div>
                            <div className="sn-planner-row">
                                <span>Chemistry — AI tutor session</span>
                                <strong>Thu · 25 min</strong>
                            </div>
                        </div>
                    </MotionCardWrap>
                </div>
            </section>

            <section className="section sn-audiences" aria-labelledby="sn-audiences-title">
                <div className="sn-section-head">
                    <p className="eyebrow">WHO IT&apos;S FOR</p>
                    <h2 id="sn-audiences-title">Built for learners at every stage</h2>
                </div>
                <div className="sn-audiences-grid">
                    {audiences.map((item) => (
                        <article key={item.title} className="sn-audience-card">
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="section sn-pricing" id="pricing" aria-labelledby="sn-pricing-title">
                <div className="sn-section-head">
                    <p className="eyebrow">PRICING</p>
                    <h2 id="sn-pricing-title">Simple plans for students</h2>
                    <p>Start free while StudyNest is in development. Upgrade when you need full AI tutoring power.</p>
                </div>
                <div className="sn-pricing-grid">
                    {pricingPlans.map((plan) => (
                        <MotionCardWrap
                            as="article"
                            key={plan.name}
                            className={`sn-pricing-card${plan.featured ? " sn-pricing-card--featured" : ""}`}
                        >
                            {plan.featured && <span className="sn-pricing-flag">Most popular</span>}
                            <h3>{plan.name}</h3>
                            <div className="sn-pricing-price">{plan.price}</div>
                            <p>{plan.description}</p>
                            <a href="#waitlist" className={plan.featured ? "primary-btn sn-btn-primary" : "secondary-btn"}>
                                Join Waitlist
                            </a>
                        </MotionCardWrap>
                    ))}
                </div>
            </section>

            <section className="section sn-faq" aria-labelledby="sn-faq-title">
                <div className="sn-section-head">
                    <p className="eyebrow">FAQ</p>
                    <h2 id="sn-faq-title">Common questions about StudyNest</h2>
                </div>
                <div className="sn-faq-list">
                    {faqItems.map((item) => (
                        <article key={item.question} className="sn-faq-item">
                            <h3>{item.question}</h3>
                            <p>{item.answer}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="section sn-waitlist" id="waitlist" aria-labelledby="sn-waitlist-title">
                <MotionSectionWrap className="sn-waitlist-card">
                    <div className="sn-waitlist-copy">
                        <p className="eyebrow">JOIN THE WAITLIST</p>
                        <h2 id="sn-waitlist-title">Be first to try StudyNest when it launches.</h2>
                        <p>
                            Get product updates, early access invitations, and study tips from the Cin Nova team. No
                            spam — unsubscribe anytime.
                        </p>
                    </div>
                    <div className="sn-waitlist-form">
                        <NewsletterSignup
                            onSubscribe={saveSubscriber}
                            source="StudyNest Waitlist"
                            tags={["StudyNest", "Waitlist"]}
                            buttonLabel="Join Waitlist"
                        />
                    </div>
                </MotionSectionWrap>
            </section>
        </main>
    );
}

export default StudyNest;
