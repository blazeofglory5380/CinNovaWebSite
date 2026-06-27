import "../App.css";
import SEO from "../components/SEO.jsx";
import ImmersiveHeroScene from "../components/ImmersiveHeroScene.jsx";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import KiddoArtwork from "../components/KiddoArtwork.jsx";
import { kiddoAssets } from "../data/kiddoAssets.js";
import { saveSubscriber } from "../data/newsletterService.js";
import { siteUrl } from "../data/blogPosts.js";

const kiddoSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Kiddo",
    applicationCategory: "EducationApplication",
    description:
        "Interactive early learning app for children ages 2\u20137 with reading, writing, math, science, and a parent dashboard.",
    operatingSystem: "Web",
    url: `${siteUrl}/?page=kiddo`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
};

const heroHighlights = [
    { value: "Ages 2\u20137", label: "Built for early learners" },
    { value: "Reading + Math", label: "Core skill worlds" },
    { value: "Safe", label: "Ad-free learning" },
];

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
        asset: { src: "/images/Kiddo/characters/kiki.png", alt: "Kiki — curious explorer and reading quest guide" },
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
        answer: "Yes. Kiddo is a closed, child-first environment with no open chat, social feeds, or external links in child mode.",
    },
    {
        question: "Does it have ads?",
        answer: "No. Kiddo is completely ad-free with no in-app purchases or surprise charges.",
    },
    {
        question: "What subjects does it teach?",
        answer: "Reading, writing, math, science, geography, creativity, problem solving, and early languages through playful worlds.",
    },
    {
        question: "Can parents track progress?",
        answer: "Yes. The parent dashboard shows learning progress, achievements, reports, and subject growth over time.",
    },
    {
        question: "Will it work on tablets?",
        answer: "Kiddo is being built for tablets, phones, and web browsers so families can learn at home or on the go.",
    },
];

function Kiddo() {
    return (
        <main className="product-page kiddo-landing">
            <SEO
                title="Kiddo | Early Learning App for Kids Ages 2\u20137 \u2014 Cin Nova"
                description="Kiddo makes learning to read, write, count, and explore the world a joyful adventure for children ages 2\u20137, with a parent dashboard to track progress. In development by Cin Nova."
                url={`${siteUrl}/?page=kiddo`}
                type="website"
                schema={kiddoSchema}
            />

            <section className="kd-hero section hero-with-immersive-scene" aria-labelledby="kd-hero-title">
                <ImmersiveHeroScene variant="kiddo" intensity="medium" />
                <div className="kd-hero-blobs" aria-hidden="true">
                    <span className="kd-blob kd-blob--1" />
                    <span className="kd-blob kd-blob--2" />
                    <span className="kd-blob kd-blob--3" />
                </div>
                <div className="kd-hero-grid">
                    <div className="kd-hero-copy">
                        <div className="kd-hero-badges">
                            <span className="kd-status-badge">Adventure Awaits</span>
                            <span className="kd-category-badge">Early Learning</span>
                        </div>
                        <p className="eyebrow">KIDDO</p>
                        <h1 id="kd-hero-title">Learning becomes an adventure.</h1>
                        <p className="kd-hero-lead">
                            Kiddo turns ABCs, reading, math, and curiosity into colorful worlds your child will
                            actually want to explore — with a parent dashboard that keeps you confidently in control.
                        </p>
                        <div className="kd-hero-actions">
                            <a href="#waitlist" className="primary-btn kd-btn-primary">
                                Join Waitlist
                            </a>
                            <a href="#worlds" className="secondary-btn kd-btn-secondary">
                                Explore Learning Worlds
                            </a>
                        </div>
                        <div className="kd-hero-stats" role="list" aria-label="Kiddo highlights">
                            {heroHighlights.map((stat) => (
                                <div key={stat.label} role="listitem" className="kd-hero-stat">
                                    <strong>{stat.value}</strong>
                                    <span>{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="kd-hero-visual">
                        <div className="kd-hero-frame">
                            <KiddoArtwork asset={kiddoAssets.hero} className="kd-hero-artwork" />
                            <span className="kd-hero-sparkle kd-hero-sparkle--1" />
                            <span className="kd-hero-sparkle kd-hero-sparkle--2" />
                        </div>
                    </div>
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
                        <article
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
                        </article>
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
                        <article key={character.name} className={`kd-character-card kd-character-card--${character.variant}`}>
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
                        </article>
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
                            <article key={item.title} className="kd-gameplay-chip">
                                <h3>{item.title}</h3>
                                <p>{item.copy}</p>
                            </article>
                        ))}
                    </div>
                    <div className="kd-gameplay-mocks">
                        <article className="kd-mock-card kd-mock-card-visual">
                            <KiddoArtwork asset={kiddoAssets.gameplay} className="kd-gameplay-preview-art" />
                        </article>
                        <article className="kd-mock-card">
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
                        </article>
                        <article className="kd-mock-card">
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
                        </article>
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
                            <article key={item.title} className="kd-parent-feature">
                                <h3>{item.title}</h3>
                                <p>{item.copy}</p>
                            </article>
                        ))}
                    </div>
                    <div className="kd-parent-visual">
                        <KiddoArtwork asset={kiddoAssets.parentDashboard} className="kd-parent-dashboard-art" />
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

            <section className="section kd-pricing" id="pricing" aria-labelledby="kd-pricing-title">
                <div className="kd-section-head">
                    <p className="eyebrow">PRICING</p>
                    <h2 id="kd-pricing-title">Plans for every family</h2>
                    <p>Start free, upgrade when your explorer is ready for more worlds.</p>
                </div>
                <div className="kd-pricing-grid">
                    {pricingPlans.map((plan) => (
                        <article
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
                        </article>
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
                <div className="kd-waitlist-card">
                    <div className="kd-waitlist-copy">
                        <p className="eyebrow">JOIN THE WAITLIST</p>
                        <h2 id="kd-waitlist-title">Give your child a head start on the adventure.</h2>
                        <p>
                            Get launch updates, early access invitations, and family learning tips from the Cin Nova
                            team. No spam — unsubscribe anytime.
                        </p>
                    </div>
                    <div className="kd-waitlist-form">
                        <NewsletterSignup
                            onSubscribe={saveSubscriber}
                            source="Kiddo Waitlist"
                            tags={["Kiddo", "Waitlist"]}
                            buttonLabel="Join Waitlist"
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Kiddo;
