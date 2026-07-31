import "../App.css";
// Shared dark ecosystem tokens (same layer as the home/products pages), then
// the StudyNest below-hero theme. Both load after App.css so they win.
import "../styles/brand-dna.css";
import "./StudyNest.css";
import SEO from "../components/SEO.jsx";
import StudyNestHero from "../components/StudyNestHero.jsx";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import MarketingPhoto from "../components/MarketingPhoto.jsx";
import { productHero3DConfigs } from "../data/productHero3D.js";
import { saveSubscriber } from "../data/newsletterService.js";
import { siteUrl } from "../data/seoConfig.js";
import { getProductUrl } from "../data/products.js";
import { buildFaqSchema, buildImageObject, withSchemaGraph } from "../data/schemaHelpers.js";
import { MotionCardWrap } from "../motion/MotionCardWrap.jsx";
import { MotionSectionWrap } from "../motion/MotionSectionWrap.jsx";
import { MotionAiPanelWrap } from "../motion/MotionAiPanelWrap.jsx";

const studyNestHero = productHero3DConfigs.studynest;

// ── Section data ──────────────────────────────────────────────────────────────

const helpCards = [
    {
        icon: "💡",
        title: "Explain confusing topics",
        description:
            "Ask the AI tutor to break down any concept in plain language using examples from your actual course material.",
    },
    {
        icon: "📅",
        title: "Build a study plan",
        description:
            "Get a personalized weekly schedule built around your upcoming exams, subject load, and available study time.",
    },
    {
        icon: "✏️",
        title: "Generate practice questions",
        description:
            "Turn your notes or any topic into quiz questions, fill-in-the-blank exercises, and review prompts automatically.",
    },
    {
        icon: "📊",
        title: "Track weak areas",
        description:
            "See which topics need more work and get targeted review suggestions to close knowledge gaps before exams.",
    },
    {
        icon: "🎯",
        title: "Prepare for quizzes and exams",
        description:
            "Build flashcard decks, run mock quizzes, and work through spaced-repetition review sessions all in one place.",
    },
];

const workflowSteps = [
    {
        step: "01",
        title: "Add class material",
        description:
            "Import your notes, paste a reading, or describe your topic. StudyNest organizes everything by subject and course.",
    },
    {
        step: "02",
        title: "Choose what you need help with",
        description:
            "Understanding a concept? Need practice questions? Want a study schedule? Tell StudyNest your goal for the session.",
    },
    {
        step: "03",
        title: "Get a study plan",
        description:
            "StudyNest builds a focused plan around your schedule, upcoming exams, and the material you have shared.",
    },
    {
        step: "04",
        title: "Practice and review",
        description:
            "Work through flashcards, quiz questions, and AI-guided explanations at your own pace on any device.",
    },
    {
        step: "05",
        title: "Track your progress",
        description:
            "See which topics you have mastered, what still needs more work, and where to focus your study time next.",
    },
];

const roadmapItems = [
    {
        title: "AI Study Planner",
        description: "Personalized weekly plans built around your exam calendar and study habits.",
    },
    {
        title: "Textbook Simplifier",
        description: "Paste any dense paragraph and get a clear, plain-language explanation you can actually use.",
    },
    {
        title: "Quiz Generator",
        description: "Auto-generate practice questions from your notes or any uploaded material, in seconds.",
    },
    {
        title: "Flashcard Builder",
        description: "Smart flashcard decks with spaced repetition scheduling built in from the start.",
    },
    {
        title: "Progress Dashboard",
        description: "Track review streaks, topic mastery scores, and exam readiness all in one view.",
    },
    {
        title: "Parent & Teacher Tools",
        description: "Visibility into student progress and study habits — planned for a later release.",
        future: true,
    },
];

const audiences = [
    {
        title: "High school students",
        description: "Build consistent study habits across subjects with guided review and exam prep.",
    },
    {
        title: "College learners",
        description: "Manage dense coursework, lecture notes, and midterm prep without switching between apps.",
    },
    {
        title: "Self-directed learners",
        description: "Structure independent study with flashcards, quizzes, and an always-available AI tutor.",
    },
    {
        title: "Parents & tutors",
        description: "Support learners with clear progress tracking, organized materials, and repeatable study routines.",
    },
];

const pricingPlans = [
    {
        name: "Free",
        price: "$0",
        description: "Core notes, flashcards, and starter quizzes to begin studying smarter.",
        featured: false,
    },
    {
        name: "Student Pro",
        price: "$9.99/mo",
        description: "AI Tutor, unlimited notes, quizzes, study guides, and priority access to new features.",
        featured: true,
    },
    {
        name: "School Plan",
        price: "Coming Soon",
        description: "Teacher tools, class management, and student progress dashboards for schools.",
        featured: false,
    },
];

const faqItems = [
    {
        question: "When will StudyNest launch?",
        answer:
            "StudyNest is in active development. Join the early access list to get launch updates and an invitation when we open the first beta.",
    },
    {
        question: "Who is StudyNest for?",
        answer:
            "StudyNest is built for students from high school through college who want one organized workspace for notes, practice, and AI-powered support — without juggling multiple apps.",
    },
    {
        question: "How is StudyNest different from flashcard apps?",
        answer:
            "Most flashcard apps handle one slice of studying. StudyNest connects note capture, practice generation, AI explanations, scheduling, and progress tracking in a single flow.",
    },
    {
        question: "Will there be a free plan?",
        answer:
            "Yes. StudyNest will launch with a free tier covering core notes and flashcards. Student Pro adds full AI tutoring, study planning, and unlimited quizzes.",
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
        url: getProductUrl("studynest"),
        screenshot: buildImageObject({ src: studyNestHero.posterSrc, alt: studyNestHero.alt }),
        // No Offer — products are not sold on-site; do not invent price 0.
        publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
    },
    buildFaqSchema(faqItems),
);

// `brand-dna` on <main> opts the below-hero page into the shared dark ecosystem
// token layer (the same one the home and products pages use). The hero sets its
// own background/color/font-family, so it inherits nothing from this layer.
function StudyNest() {
    return (
        <main className="product-page studynest-landing brand-dna">
            <SEO
                title="StudyNest | AI Study Tools for Students — Cin Nova"
                description="StudyNest helps students organize notes, generate flashcards, take quizzes, create study guides, and get AI tutoring support. Currently in development by Cin Nova."
                url={getProductUrl("studynest")}
                type="website"
                schema={studynestSchema}
            />

            {/* Hero — UNTOUCHED. Sets its own background (#04080f), color, and
                font-family; deliberately isolated from brand-dna. Do not modify. */}
            <StudyNestHero
                headingLevel="h1"
                primaryHref="#studynest-articles"
                secondaryHref="#product-ecosystem-title"
            />

            <section className="sn-trust-bar" aria-label="StudyNest value highlights">
                <div className="sn-trust-inner">
                    <span>Built for students</span>
                    <span>Notes · practice · review in one place</span>
                    <span>Part of the Cin Nova ecosystem</span>
                </div>
            </section>

            {/* ── 1. Product clarity ─────────────────────────────────────────── */}
            <section className="section sn-problem" aria-labelledby="sn-clarity-title">
                <div className="sn-problem-grid">
                    <div className="sn-problem-copy">
                        <p className="eyebrow">WHAT IS STUDYNEST</p>
                        <h2 id="sn-clarity-title">An AI study companion built for students.</h2>
                        <p>
                            StudyNest helps students turn confusing class material into organized study plans, simpler
                            explanations, practice questions, and progress tracking — all in one place.
                        </p>
                        <p>
                            It is for students who struggle to keep up with notes across multiple subjects, who need
                            concepts explained in plain language, and who want to practice and prepare for exams without
                            switching between four different apps.
                        </p>
                    </div>
                    <div className="sn-problem-visual">
                        <MarketingPhoto
                            src="/images/education/ai-tutor-personalized-learning-dashboard.jpg"
                            alt="Student reviewing a personalized AI study plan on a laptop"
                            className="sn-problem-img"
                            loading="lazy"
                        />
                    </div>
                </div>
            </section>

            {/* ── 2. How StudyNest helps ─────────────────────────────────────── */}
            <section className="section sn-helps" id="features" aria-labelledby="sn-helps-title">
                <div className="sn-section-head">
                    <p className="eyebrow">HOW STUDYNEST HELPS</p>
                    <h2 id="sn-helps-title">Five ways StudyNest supports your studying</h2>
                    <p>
                        Every tool is focused on helping you understand material, build review habits, and feel prepared.
                    </p>
                </div>
                <div className="sn-helps-grid">
                    {helpCards.map((card) => (
                        <MotionCardWrap as="article" key={card.title} className="sn-helps-card">
                            <span className="sn-helps-icon" aria-hidden="true">{card.icon}</span>
                            <h3>{card.title}</h3>
                            <p>{card.description}</p>
                        </MotionCardWrap>
                    ))}
                </div>
            </section>

            {/* ── 3. Student workflow preview (non-interactive) ──────────────── */}
            <section className="section sn-how" aria-labelledby="sn-workflow-title">
                <div className="sn-section-head">
                    <p className="eyebrow">HOW IT WORKS</p>
                    <h2 id="sn-workflow-title">Your study workflow, step by step</h2>
                    <p>A repeatable process that fits any subject, any course, any week.</p>
                </div>
                <div className="sn-workflow-grid">
                    {workflowSteps.map((item) => (
                        <MotionCardWrap as="article" key={item.step} className="sn-how-card">
                            <span className="sn-how-step">{item.step}</span>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </MotionCardWrap>
                    ))}
                </div>
            </section>

            {/* ── 4. Coming-soon product roadmap ────────────────────────────── */}
            <section className="section sn-roadmap" aria-labelledby="sn-roadmap-title">
                <div className="sn-section-head">
                    <p className="eyebrow">COMING SOON</p>
                    <h2 id="sn-roadmap-title">What&apos;s being built</h2>
                    <p>StudyNest is in active development. Here is what the team is working toward.</p>
                </div>
                <div className="sn-roadmap-grid">
                    {roadmapItems.map((item) => (
                        <article
                            key={item.title}
                            className={`sn-roadmap-item${item.future ? " sn-roadmap-item--future" : ""}`}
                        >
                            <div className="sn-roadmap-head">
                                <h3>{item.title}</h3>
                                <span className="sn-roadmap-status">
                                    {item.future ? "Planned later" : "In development"}
                                </span>
                            </div>
                            <p>{item.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* Preview — early interface concepts, non-interactive ────────────── */}
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
                    <p>
                        Pricing plans shown here are planned for launch. Join the early access list to be notified when
                        StudyNest opens.
                    </p>
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
                            <a
                                href="#waitlist"
                                className={plan.featured ? "primary-btn sn-btn-primary" : "secondary-btn"}
                            >
                                Join Early Access
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

            {/* ── 5. Early access CTA ───────────────────────────────────────── */}
            <section className="section sn-waitlist" id="waitlist" aria-labelledby="sn-waitlist-title">
                <MotionSectionWrap className="sn-waitlist-card">
                    <div className="sn-waitlist-copy">
                        <p className="eyebrow">EARLY ACCESS</p>
                        <h2 id="sn-waitlist-title">Join the early access list.</h2>
                        <p>
                            StudyNest is not yet live. Add your email to get notified when early access opens, receive
                            development updates, and help shape what we build. No spam — unsubscribe anytime.
                        </p>
                        <p className="sn-waitlist-note">
                            Want to explore the rest of the Cin Nova ecosystem?{" "}
                            <a href="#product-ecosystem-title" className="sn-ecosystem-link">
                                See all products ↓
                            </a>
                        </p>
                    </div>
                    <div className="sn-waitlist-form">
                        <NewsletterSignup
                            onSubscribe={saveSubscriber}
                            source="StudyNest Waitlist"
                            tags={["StudyNest", "Waitlist"]}
                            buttonLabel="Join Early Access"
                        />
                    </div>
                </MotionSectionWrap>
            </section>
        </main>
    );
}

export default StudyNest;
