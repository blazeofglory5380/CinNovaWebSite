import "../App.css";
// Shared dark ecosystem tokens + the below-hero dark theme. Both load after
// App.css so they win over the light defaults. Hero CSS is untouched.
import "../styles/brand-dna.css";
import "./ProductDark.css";
// Phase 3E foundation-refresh sections (loaded last so it inherits --pd-* tokens).
import "./Kiddo.css";
import SEO from "../components/SEO.jsx";
import KiddoHero from "../components/KiddoHero.jsx";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import KiddoArtwork from "../components/KiddoArtwork.jsx";
import { kiddoAssets } from "../data/kiddoAssets.js";
import { productHero3DConfigs } from "../data/productHero3D.js";
import { saveSubscriber } from "../data/newsletterService.js";
import { siteUrl } from "../data/seoConfig.js";
import { getProductUrl } from "../data/products.js";
import { buildFaqSchema, buildImageObject, withSchemaGraph } from "../data/schemaHelpers.js";
import { MotionHeroWrap } from "../motion/MotionHeroWrap.jsx";
import { MotionCardWrap } from "../motion/MotionCardWrap.jsx";
import { MotionSectionWrap } from "../motion/MotionSectionWrap.jsx";

const kiddoHero = productHero3DConfigs.kiddo;

const learningWorlds = [
    {
        name: "Alphabet Forest",
        focus: "Letters & phonics",
        description: "Meet friendly letter guides and discover sounds through woodland trails.",
        ages: "Ages 2\u20135",
        asset: kiddoAssets.worlds.alphabetForest,
        accent: "#34d399",
    },
    {
        name: "Number Mountain",
        focus: "Counting & math",
        description: "Climb counting paths, solve addition puzzles, and collect golden stars.",
        ages: "Ages 3\u20136",
        asset: kiddoAssets.worlds.numberMountain,
        accent: "#fbbf24",
    },
    {
        name: "Reading Castle",
        focus: "Stories & literacy",
        description: "Unlock story towers with sight words, rhymes, and interactive tales.",
        ages: "Ages 4\u20137",
        asset: kiddoAssets.worlds.readingCastle,
        accent: "#a78bfa",
    },
    {
        name: "Science Lab",
        focus: "Experiments & discovery",
        description: "Mix experiments, explore nature, and ask why the world works.",
        ages: "Ages 4\u20137",
        asset: kiddoAssets.worlds.scienceLab,
        accent: "#38bdf8",
    },
    {
        name: "Ocean Discovery",
        focus: "Geography & nature",
        description: "Dive into habitats, marine life, and maps across the deep blue.",
        ages: "Ages 4\u20137",
        asset: kiddoAssets.worlds.oceanDiscovery,
        accent: "#2dd4bf",
    },
    {
        name: "Space Explorer",
        focus: "Science & curiosity",
        description: "Rocket through planets, constellations, and curiosity-fueled missions.",
        ages: "Ages 5\u20137",
        asset: kiddoAssets.worlds.spaceExplorer,
        accent: "#818cf8",
    },
];

const characters = [
    {
        name: "Luna",
        title: "The Curious Explorer",
        personality: "Brave, kind, and always ready to help a friend find the way.",
        teaches: "Reading quests, story choices, and empathy",
        variant: "luna",
        asset: kiddoAssets.characters.luna,
    },
    {
        name: "Oliver",
        title: "The Wise Owl",
        personality: "Patient, thoughtful, and full of gentle encouragement.",
        teaches: "Phonics, vocabulary, and comprehension",
        variant: "oliver",
        asset: kiddoAssets.characters.oliver,
    },
    {
        name: "Nova",
        title: "The Star Captain",
        personality: "Energetic, inventive, and obsessed with big questions.",
        teaches: "Science, space, and problem solving",
        variant: "nova",
        asset: kiddoAssets.characters.nova,
    },
    {
        name: "Coral",
        title: "The Ocean Guide",
        personality: "Playful, curious, and loves sharing fun facts.",
        teaches: "Geography, nature, and social skills",
        variant: "coral",
        asset: kiddoAssets.characters.coral,
    },
    {
        name: "Max",
        title: "The Mountain Coach",
        personality: "Cheerful, determined, and celebrates every small win.",
        teaches: "Counting, math challenges, and persistence",
        variant: "max",
        asset: kiddoAssets.characters.max,
    },
    {
        name: "Leo",
        title: "The Brave Adventurer",
        personality: "Bold, encouraging, and always ready to lead the next quest.",
        teaches: "Writing adventures, storytelling, and confidence",
        variant: "leo",
        asset: kiddoAssets.characters.leo,
    },
    {
        name: "Kai",
        title: "The Clever Explorer",
        personality: "Inventive, quick-thinking, and loves a good puzzle.",
        teaches: "Puzzles, patterns, and problem solving",
        variant: "kai",
        asset: kiddoAssets.characters.kai,
    },
];

const gameplayFeatures = [
    { title: "Treasure hunts", copy: "Follow clues across worlds to unlock story surprises." },
    { title: "Mini games", copy: "Quick, joyful games that build skills in short bursts." },
    { title: "Reading quests", copy: "Choose-your-path stories that grow vocabulary naturally." },
    { title: "Math challenges", copy: "Friendly number games with instant, encouraging feedback." },
    { title: "Badges", copy: "Achievement moments parents and kids can celebrate together." },
    { title: "Rewards", copy: "Stars, stickers, and treasures that keep motivation high." },
    { title: "Unlockable worlds", copy: "New destinations open as skills grow." },
    { title: "Daily challenges", copy: "Gentle streaks that celebrate consistency, not pressure." },
];

const parentFeatures = [
    { title: "Progress tracking", copy: "See what your child mastered today and what comes next." },
    { title: "Learning reports", copy: "Weekly snapshots written for busy parents, not data scientists." },
    { title: "Screen-time controls", copy: "Set daily limits and quiet-hour schedules you control." },
    { title: "Safe environment", copy: "Closed experience with no social feeds or open chat." },
    { title: "No ads", copy: "Zero ad networks, zero surprise purchases, zero dark patterns." },
    { title: "Privacy-first design", copy: "Built with family privacy and COPPA-minded defaults." },
];

const learningSubjects = [
    { name: "Reading", color: "#a78bfa" },
    { name: "Writing", color: "#fb7185" },
    { name: "Math", color: "#fbbf24" },
    { name: "Science", color: "#38bdf8" },
    { name: "Geography", color: "#2dd4bf" },
    { name: "Creativity", color: "#f472b6" },
    { name: "Problem Solving", color: "#818cf8" },
    { name: "Languages", color: "#34d399" },
];

// ── Phase 3E: foundation-refresh content ──────────────────────────────
// Honest, development-stage messaging. Kiddo is being designed, not shipped —
// copy here deliberately avoids present-tense "it does X" claims.
const clarityPoints = [
    {
        title: "A learning companion, not a screen filler",
        copy: "Kiddo is being designed to turn learning into guided missions, friendly explanations, and creative challenges kids actually want to return to.",
    },
    {
        title: "Made for kids and their families",
        copy: "Built for early learners and the parents guiding them, so curiosity grows inside a safe, supportive, parent-aware space.",
    },
    {
        title: "Characters that guide the way",
        copy: "Friendly AI characters are being designed to explain ideas in kid-friendly language, cheer on progress, and make each skill feel like a mission worth finishing.",
    },
    {
        title: "Part of the CinNova ecosystem",
        copy: "Kiddo is the playful, family-facing member of the CinNova family of learning products — sharing the same care for craft and safety.",
    },
    {
        title: "Built carefully, safety first",
        copy: "We are developing Kiddo deliberately, with family controls and parent-aware design as a foundation rather than an afterthought.",
    },
];

const helpCards = [
    {
        title: "Turn lessons into adventures",
        copy: "Everyday learning becomes guided missions and story-driven quests that keep kids curious.",
    },
    {
        title: "Explain ideas in kid-friendly language",
        copy: "Characters are designed to break big ideas into small, friendly steps a child can follow and enjoy.",
    },
    {
        title: "Create practice missions",
        copy: "Short, playful challenges reinforce new skills through doing, not just watching.",
    },
    {
        title: "Encourage creativity",
        copy: "Open-ended, imaginative activities invite kids to make, try, and express themselves.",
    },
    {
        title: "Support parent-guided learning",
        copy: "Designed so parents can stay informed and involved, guiding learning without hovering.",
    },
];

const journeySteps = [
    {
        step: "01",
        title: "Choose a learning world",
        copy: "Pick a themed world that matches what your child wants to explore next.",
    },
    {
        step: "02",
        title: "Meet a character guide",
        copy: "A friendly character introduces the world and becomes a companion for the journey.",
    },
    {
        step: "03",
        title: "Start a mission",
        copy: "Begin a guided activity built around a single, achievable learning goal.",
    },
    {
        step: "04",
        title: "Practice through challenges",
        copy: "Playful challenges reinforce the skill with encouragement at every step.",
    },
    {
        step: "05",
        title: "Share progress with parents",
        copy: "Progress is designed to roll up into simple, parent-friendly updates.",
    },
];

const characterWorldPillars = [
    {
        title: "Friendly guides",
        copy: "Character companions who explain, encourage, and make learning feel personal.",
    },
    {
        title: "Learning worlds",
        copy: "Themed spaces that group skills into imaginative, explorable destinations.",
    },
    {
        title: "Creative missions",
        copy: "Hands-on challenges that turn practice into play and steady progress.",
    },
    {
        title: "Rewards and progress",
        copy: "Stars, badges, and milestones designed to celebrate effort and growth.",
    },
    {
        title: "Parent-aware experience",
        copy: "An experience built to keep parents informed and in control as kids explore.",
    },
];

const roadmapItems = [
    { title: "Character-guided lessons", stage: "In design" },
    { title: "Creative learning missions", stage: "In design" },
    { title: "Reading and vocabulary support", stage: "Planned" },
    { title: "Math practice adventures", stage: "Planned" },
    { title: "Parent dashboard", stage: "Planned" },
    { title: "Progress reports", stage: "Planned" },
    { title: "Classroom & family modes", stage: "Exploring" },
];

const pricingPlans = [
    {
        name: "Free Explorer",
        price: "$0",
        description: "Alphabet Forest, starter counting, five stories, and mini games for one child.",
        featured: false,
    },
    {
        name: "Kiddo Plus",
        price: "$7.99/mo",
        description: "All learning worlds, unlimited stories, rewards, and parent dashboard for up to 3 kids.",
        featured: true,
    },
    {
        name: "Family Plan",
        price: "$11.99/mo",
        description: "Everything in Plus with shared family profiles, reports, and priority feature access.",
        featured: false,
    },
    {
        name: "Schools",
        price: "Coming Soon",
        description: "Classroom tools, educator dashboards, and curriculum alignment for Pre-K through Grade 2.",
        featured: false,
    },
];

const faqItems = [
    {
        question: "What age is Kiddo for?",
        answer: "Kiddo is designed for children ages 2\u20137, with worlds and difficulty that adapt as your child grows.",
    },
    {
        question: "Is Kiddo safe?",
        answer: "Safety is central to Kiddo's design. It is being built as a closed, child-first environment with no open chat, social feeds, or external links in child mode.",
    },
    {
        question: "Does it have ads?",
        answer: "No. Kiddo is being designed to be completely ad-free, with no in-app purchases or surprise charges.",
    },
    {
        question: "What subjects does it teach?",
        answer: "Reading, writing, math, science, geography, creativity, problem solving, and early languages through playful worlds.",
    },
    {
        question: "Can parents track progress?",
        answer: "Yes — a parent dashboard is planned to show learning progress, achievements, reports, and subject growth over time.",
    },
    {
        question: "Will it work on tablets?",
        answer: "Kiddo is being built for tablets, phones, and web browsers so families can learn at home or on the go.",
    },
];

const kiddoSchema = withSchemaGraph(
    {
        "@type": "SoftwareApplication",
        name: "Kiddo",
        applicationCategory: "EducationApplication",
        description:
            "Interactive early learning app for children ages 2\u20137 with reading, writing, math, science, and a parent dashboard.",
        operatingSystem: "Web",
        url: getProductUrl("kiddo"),
        screenshot: buildImageObject({ src: kiddoHero.posterSrc, alt: kiddoHero.alt }),
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
    },
    buildFaqSchema(faqItems),
);

function Kiddo() {
    return (
        <main className="product-page kiddo-landing brand-dna">
            <SEO
                title="Kiddo | Early Learning App for Kids Ages 2–7 — Cin Nova"
                description="Kiddo makes learning to read, write, count, and explore the world a joyful adventure for children ages 2–7, with a parent dashboard to track progress. In development by Cin Nova."
                url={getProductUrl("kiddo")}
                type="website"
                schema={kiddoSchema}
            />

            <MotionHeroWrap>
                <KiddoHero />
            </MotionHeroWrap>

            <section className="section kd-clarity" aria-labelledby="kd-clarity-title">
                <div className="kd-section-head">
                    <p className="eyebrow">WHAT IS KIDDO</p>
                    <h2 id="kd-clarity-title">Learning adventures powered by friendly AI characters.</h2>
                    <p>
                        Kiddo is being designed as a playful AI learning companion where children can explore lessons,
                        complete creative missions, and build confidence with friendly character guidance — while
                        parents stay informed and in control.
                    </p>
                    <p className="kd-dev-note">In active development · Not yet a live, child-facing app</p>
                </div>
                <div className="kd-clarity-grid">
                    {clarityPoints.map((point) => (
                        <MotionCardWrap as="article" key={point.title} className="kd-clarity-card">
                            <h3>{point.title}</h3>
                            <p>{point.copy}</p>
                        </MotionCardWrap>
                    ))}
                </div>
            </section>

            <section className="section kd-help" aria-labelledby="kd-help-title">
                <div className="kd-section-head">
                    <p className="eyebrow">HOW KIDDO HELPS</p>
                    <h2 id="kd-help-title">Little missions that build big confidence</h2>
                    <p>Every part of Kiddo is being designed to make learning feel playful, guided, and safe.</p>
                </div>
                <div className="kd-help-grid">
                    {helpCards.map((card) => (
                        <MotionCardWrap as="article" key={card.title} className="kd-help-card">
                            <span className="kd-help-dot" aria-hidden="true" />
                            <h3>{card.title}</h3>
                            <p>{card.copy}</p>
                        </MotionCardWrap>
                    ))}
                </div>
            </section>

            <section className="section kd-journey" aria-labelledby="kd-journey-title">
                <div className="kd-section-head">
                    <p className="eyebrow">LEARNING JOURNEY PREVIEW</p>
                    <h2 id="kd-journey-title">How a Kiddo adventure is designed to flow</h2>
                    <p>A preview of the planned experience — not a live demo. Here is the shape we are building toward.</p>
                </div>
                <ol className="kd-journey-steps">
                    {journeySteps.map((item) => (
                        <MotionCardWrap as="li" key={item.step} className="kd-journey-step">
                            <span className="kd-journey-num" aria-hidden="true">{item.step}</span>
                            <div className="kd-journey-copy">
                                <h3>{item.title}</h3>
                                <p>{item.copy}</p>
                            </div>
                        </MotionCardWrap>
                    ))}
                </ol>
            </section>

            <section className="section kd-charworld" aria-labelledby="kd-charworld-title">
                <div className="kd-section-head">
                    <p className="eyebrow">CHARACTERS & WORLDS</p>
                    <h2 id="kd-charworld-title">A character-driven learning world, taking shape</h2>
                    <p>
                        These are the pillars guiding Kiddo&apos;s design — a preview of how characters and worlds fit
                        together, not a finished product.
                    </p>
                </div>
                <div className="kd-charworld-grid">
                    {characterWorldPillars.map((pillar) => (
                        <MotionCardWrap as="article" key={pillar.title} className="kd-charworld-card">
                            <h3>{pillar.title}</h3>
                            <p>{pillar.copy}</p>
                        </MotionCardWrap>
                    ))}
                </div>
            </section>

            <section className="section kd-worlds" id="worlds" aria-labelledby="kd-worlds-title">
                <div className="kd-section-head">
                    <p className="eyebrow">LEARNING WORLDS</p>
                    <h2 id="kd-worlds-title">Six magical destinations to explore</h2>
                    <p>Every world is a playful chapter in your child&apos;s learning journey.</p>
                </div>
                <div className="kd-worlds-grid">
                    {learningWorlds.map((world) => (
                        <MotionCardWrap
                            as="article"
                            key={world.name}
                            className="kd-world-card"
                            style={{ "--kd-world-accent": world.accent }}
                        >
                            <div className="kd-world-photo">
                                <KiddoArtwork asset={world.asset} className="kd-world-artwork" placeholderLabel={world.name} />
                                <span className="kd-world-age">{world.ages}</span>
                            </div>
                            <div className="kd-world-body">
                                <p className="kd-world-focus">{world.focus}</p>
                                <h3>{world.name}</h3>
                                <p>{world.description}</p>
                            </div>
                        </MotionCardWrap>
                    ))}
                </div>
            </section>

            <section className="section kd-characters" aria-labelledby="kd-characters-title">
                <div className="kd-section-head">
                    <p className="eyebrow">MEET THE CHARACTERS</p>
                    <h2 id="kd-characters-title">Friends who make learning feel alive</h2>
                    <p>Each guide has a personality, a purpose, and a world to share.</p>
                </div>
                <div className="kd-characters-grid">
                    {characters.map((character) => (
                        <MotionCardWrap as="article" key={character.name} className={`kd-character-card kd-character-card--${character.variant}`}>
                            <div className="kd-character-portrait-wrap">
                                <KiddoArtwork
                                    asset={character.asset}
                                    className="kd-character-artwork"
                                    placeholderLabel={character.name}
                                />
                            </div>
                            <h3>{character.name}</h3>
                            <p className="kd-character-title">{character.title}</p>
                            <p className="kd-character-personality">{character.personality}</p>
                            <p className="kd-character-teaches">
                                <strong>Teaches:</strong> {character.teaches}
                            </p>
                        </MotionCardWrap>
                    ))}
                </div>
            </section>

            <section className="section kd-gameplay" aria-labelledby="kd-gameplay-title">
                <div className="kd-section-head">
                    <p className="eyebrow">ADVENTURE GAMEPLAY</p>
                    <h2 id="kd-gameplay-title">Play that builds real skills</h2>
                    <p>Quests, rewards, and discovery loops children love — parents trust.</p>
                </div>
                <div className="kd-gameplay-layout">
                    <div className="kd-gameplay-grid">
                        {gameplayFeatures.map((item) => (
                            <MotionCardWrap as="article" key={item.title} className="kd-gameplay-chip">
                                <h3>{item.title}</h3>
                                <p>{item.copy}</p>
                            </MotionCardWrap>
                        ))}
                    </div>
                    <div className="kd-gameplay-mocks">
                        <MotionCardWrap as="article" className="kd-mock-card kd-mock-card-visual">
                            <KiddoArtwork asset={kiddoAssets.gameplay} className="kd-gameplay-preview-art" placeholderLabel="Gameplay preview" />
                        </MotionCardWrap>
                        <MotionCardWrap as="article" className="kd-mock-card">
                            <p className="kd-mock-label">Treasure Map</p>
                            <h3>Find the hidden letter gems</h3>
                            <div className="kd-mock-map">
                                <span className="kd-mock-node kd-mock-node--done">A</span>
                                <span className="kd-mock-path" />
                                <span className="kd-mock-node kd-mock-node--active">B</span>
                                <span className="kd-mock-path" />
                                <span className="kd-mock-node">C</span>
                            </div>
                            <p className="kd-mock-caption">2 of 3 clues found in Alphabet Forest</p>
                        </MotionCardWrap>
                        <MotionCardWrap as="article" className="kd-mock-card kd-mock-card-wide">
                            <p className="kd-mock-label">Daily Challenge</p>
                            <h3>Star streak unlocked</h3>
                            <div className="kd-mock-streak">
                                <span className="kd-mock-star kd-mock-star--on" />
                                <span className="kd-mock-star kd-mock-star--on" />
                                <span className="kd-mock-star kd-mock-star--on" />
                                <span className="kd-mock-star" />
                                <span className="kd-mock-star" />
                            </div>
                            <p className="kd-mock-caption">Come back tomorrow for a surprise badge</p>
                        </MotionCardWrap>
                    </div>
                </div>
            </section>

            <section className="section kd-parents" aria-labelledby="kd-parents-title">
                <div className="kd-section-head">
                    <p className="eyebrow">PARENT DASHBOARD</p>
                    <h2 id="kd-parents-title">Confidence for parents, joy for kids</h2>
                    <p>Everything you need to guide learning without hovering over every tap.</p>
                </div>
                <div className="kd-parents-layout">
                    <div className="kd-parent-features">
                        {parentFeatures.map((item) => (
                            <MotionCardWrap as="article" key={item.title} className="kd-parent-feature">
                                <h3>{item.title}</h3>
                                <p>{item.copy}</p>
                            </MotionCardWrap>
                        ))}
                    </div>
                    <div className="kd-parent-visual">
                        <KiddoArtwork asset={kiddoAssets.parentDashboard} className="kd-parent-dashboard-art" placeholderLabel="Parent dashboard" />
                        <article className="kd-parent-dashboard-mock" aria-label="Parent dashboard preview">
                            <div className="kd-dashboard-header">
                                <strong>Emma&apos;s Week</strong>
                                <span>Age 5</span>
                            </div>
                            <div className="kd-dashboard-stats">
                                <div>
                                    <strong>14</strong>
                                    <span>Lessons</span>
                                </div>
                                <div>
                                    <strong>3h 20m</strong>
                                    <span>Learned</span>
                                </div>
                                <div>
                                    <strong>8</strong>
                                    <span>Stars</span>
                                </div>
                                <div>
                                    <strong>92%</strong>
                                    <span>Accuracy</span>
                                </div>
                            </div>
                            <div className="kd-dashboard-insight">
                                <p className="kd-dashboard-insight-label">Parent insight</p>
                                <p>Reading is Emma&apos;s superpower this week. Add 10 minutes of counting play tomorrow.</p>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            <section className="section kd-subjects" aria-labelledby="kd-subjects-title">
                <div className="kd-section-head">
                    <p className="eyebrow">LEARNING SUBJECTS</p>
                    <h2 id="kd-subjects-title">A full early-learning universe</h2>
                </div>
                <div className="kd-subjects-grid">
                    {learningSubjects.map((subject) => (
                        <article
                            key={subject.name}
                            className="kd-subject-card"
                            style={{ "--kd-subject-color": subject.color }}
                        >
                            <span className="kd-subject-dot" />
                            <h3>{subject.name}</h3>
                        </article>
                    ))}
                </div>
            </section>

            <section className="section kd-roadmap" aria-labelledby="kd-roadmap-title">
                <div className="kd-section-head">
                    <p className="eyebrow">COMING SOON</p>
                    <h2 id="kd-roadmap-title">On the Kiddo roadmap</h2>
                    <p>What we are building toward. Timing and features may evolve as Kiddo develops.</p>
                </div>
                <ul className="kd-roadmap-list">
                    {roadmapItems.map((item) => (
                        <MotionCardWrap as="li" key={item.title} className="kd-roadmap-item">
                            <span className="kd-roadmap-mark" aria-hidden="true" />
                            <span className="kd-roadmap-title">{item.title}</span>
                            <span className="kd-roadmap-stage">{item.stage}</span>
                        </MotionCardWrap>
                    ))}
                </ul>
            </section>

            <section className="section kd-pricing" id="pricing" aria-labelledby="kd-pricing-title">
                <div className="kd-section-head">
                    <p className="eyebrow">PRICING</p>
                    <h2 id="kd-pricing-title">Plans for every family</h2>
                    <p>Planned pricing while Kiddo is in development. Join the early access list — nothing is charged today.</p>
                </div>
                <div className="kd-pricing-grid">
                    {pricingPlans.map((plan) => (
                        <MotionCardWrap
                            as="article"
                            key={plan.name}
                            className={`kd-pricing-card${plan.featured ? " kd-pricing-card--featured" : ""}`}
                        >
                            {plan.featured && <span className="kd-pricing-flag">Most popular</span>}
                            <h3>{plan.name}</h3>
                            <div className="kd-pricing-price">{plan.price}</div>
                            <p>{plan.description}</p>
                            <a href="#waitlist" className={plan.featured ? "primary-btn kd-btn-primary" : "secondary-btn kd-btn-secondary"}>
                                Join Waitlist
                            </a>
                        </MotionCardWrap>
                    ))}
                </div>
            </section>

            <section className="section kd-faq" aria-labelledby="kd-faq-title">
                <div className="kd-section-head">
                    <p className="eyebrow">FAQ</p>
                    <h2 id="kd-faq-title">Questions parents ask most</h2>
                </div>
                <div className="kd-faq-list">
                    {faqItems.map((item) => (
                        <article key={item.question} className="kd-faq-item">
                            <h3>{item.question}</h3>
                            <p>{item.answer}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="section kd-waitlist" id="waitlist" aria-labelledby="kd-waitlist-title">
                <MotionSectionWrap className="kd-waitlist-card">
                    <div className="kd-waitlist-copy">
                        <p className="eyebrow">EARLY ACCESS</p>
                        <h2 id="kd-waitlist-title">Join the Kiddo early access list</h2>
                        <p className="kd-waitlist-status">Kiddo is not yet live — it is still being built.</p>
                        <p>
                            Get honest updates as the product develops, plus early access invitations and family
                            learning tips from the Cin Nova team. No spam — unsubscribe anytime.
                        </p>
                        <p className="kd-waitlist-eco">
                            <a href="/products">Explore all CinNova products →</a>
                        </p>
                    </div>
                    <div className="kd-waitlist-form">
                        <NewsletterSignup
                            onSubscribe={saveSubscriber}
                            source="Kiddo Early Access"
                            tags={["Kiddo", "Early Access"]}
                            buttonLabel="Get Updates"
                        />
                    </div>
                </MotionSectionWrap>
            </section>
        </main>
    );
}

export default Kiddo;
