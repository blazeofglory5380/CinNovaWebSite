// ClaudeWebsiteDesignGuide — /guides/claude-website-design   CSS prefix: ait-
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import {
    TutorialHero, TutorialSEO, Step, Callout, PromptExample, FAQ, RelatedGuides, BackToHubCta, SafetyNote,
} from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "Can Claude build my whole website?", a: "It's best used to plan, write copy, and draft structure — not to hand you a finished, production-ready site. You (or a developer) still build, test, and review the real thing. CinNova is independent and not affiliated with any AI company." },
    { q: "Can Claude write the code too?", a: "It can draft HTML, CSS, and components, but treat that code as a starting point. Run it, test it, and review it carefully before using it — see the AI coding guide for safe habits." },
    { q: "Will the copy be accurate?", a: "Claude can write persuasive copy quickly, but it can invent facts, features, or claims. Verify everything — especially product details, numbers, and legal or safety statements — before publishing." },
    { q: "Is it safe to share my site content with Claude?", a: "Keep private data, customer information, credentials, and confidential business details out of prompts. Share only general context and check the latest official privacy settings." },
];

export default function ClaudeWebsiteDesignGuide() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="How to Use Claude to Design a Website | Step-by-Step Guide"
                description="Learn how to use Claude to plan a website: define goals, build a sitemap, draft homepage copy, write wireframe notes, improve UX, and prepare developer handoff. Includes example prompts, safety tips, and common mistakes."
                pageKey="claude-website-design-guide"
                siteUrl={siteUrl}
            />

            <TutorialHero
                eyebrow="CLAUDE WORKFLOW · WEBSITES"
                title="How to Use Claude to Design a Website: Step-by-Step Guide"
                intro="This guide shows how to use Claude to plan, prompt, draft, organize, and review a website — from goals and sitemap to copy, wireframe notes, and developer handoff. Claude handles the thinking and words; you (or your developer) build the real site."
                level="Workflow"
                minutes={11}
            />

            <section className="section ait-guide-body">
                <h2>How Claude can help with website planning</h2>
                <p>
                    A good website starts with a plan, and that's where Claude is genuinely useful. Use Claude
                    to clarify the goal, map the pages, draft the copy, describe each section, and pressure-test
                    the user experience — so that by the time anyone opens a design or code editor, the hard
                    thinking is done. CinNova is independent and not affiliated with any AI company; this is a
                    neutral how-to guide.
                </p>
                <ul className="ait-list">
                    <li>Defining the site's purpose and the single action you want visitors to take.</li>
                    <li>Building a sitemap and a logical page structure.</li>
                    <li>Drafting homepage and section copy you can refine.</li>
                    <li>Writing wireframe notes that describe each section's job.</li>
                    <li>Reviewing for clarity, accessibility, SEO, and mobile layout.</li>
                </ul>

                <h2>What Claude cannot replace</h2>
                <Callout tone="warn" title="Claude plans; people build and verify">
                    <ul className="ait-list">
                        <li>Real design craft, brand judgment, and visual polish.</li>
                        <li>Working, tested code — draft code must be run and reviewed.</li>
                        <li>Accurate facts — verify every product claim, number, and statement.</li>
                        <li>Legal, accessibility, and compliance sign-off by a qualified person.</li>
                    </ul>
                </Callout>

                <h2>Step-by-step</h2>
                <div className="ait-steps">
                    <Step n={1} title="Define the website goal">
                        <p>Tell Claude who the site is for and the one main action you want visitors to take. Everything else follows from this.</p>
                        <PromptExample label="Example">I'm building a site for a freelance wedding photographer. Main goal: get couples to request a quote. Help me define the site's purpose and primary call-to-action.</PromptExample>
                    </Step>
                    <Step n={2} title="Create a sitemap">
                        <p>Ask for a simple page structure that serves the goal without bloat. Fewer, clearer pages usually beat many thin ones.</p>
                        <PromptExample label="Example">Propose a minimal sitemap for this site — the pages I actually need and what each one is for.</PromptExample>
                    </Step>
                    <Step n={3} title="Create homepage copy">
                        <p>Draft the homepage message: a clear headline, supporting text, and a strong call-to-action you can refine.</p>
                        <PromptExample label="Example">Write homepage copy: a headline, subheadline, 3 short value points, and a call-to-action for the quote request.</PromptExample>
                    </Step>
                    <Step n={4} title="Generate section-by-section wireframe notes">
                        <p>For each page, ask Claude to describe the sections in order and what each one should communicate — a text wireframe before any visuals.</p>
                        <PromptExample label="Example">For the homepage, list the sections top to bottom. For each, describe its purpose, the content it holds, and the action it drives.</PromptExample>
                    </Step>
                    <Step n={5} title="Ask for UX improvements">
                        <p>Have it review the flow for friction — confusing steps, missing trust signals, or unclear next actions.</p>
                        <PromptExample label="Example">Review this page flow for a first-time visitor. Where might they get confused or hesitate, and what would you change?</PromptExample>
                    </Step>
                    <Step n={6} title="Create design prompts for visuals">
                        <p>Ask for descriptive prompts you can take into a design or image tool — style, mood, and imagery direction for each section.</p>
                        <PromptExample label="Example">Write image direction notes for the hero section: mood, style, subject, and what to avoid, so I can create or source the right visual.</PromptExample>
                    </Step>
                    <Step n={7} title="Turn the plan into code or handoff notes">
                        <p>Ask for clean handoff notes for a developer, or draft starter code you'll run and review. Never ship code you haven't tested.</p>
                        <PromptExample label="Example">Turn this homepage plan into a developer handoff: sections, content, behavior, and responsive notes. Keep it clear and implementation-agnostic.</PromptExample>
                    </Step>
                    <Step n={8} title="Review accessibility, SEO, and mobile layout">
                        <p>Ask for a review pass: readable contrast and structure, sensible headings and meta text, and how each section should adapt on small screens.</p>
                        <PromptExample label="Example">Review this plan for accessibility, on-page SEO basics, and mobile layout. List concrete improvements a beginner can apply.</PromptExample>
                    </Step>
                </div>

                <h2>Example prompts for landing pages</h2>
                <PromptExample label="Landing page">Draft a focused landing page for [offer] aimed at [audience]. One clear goal, a strong headline, benefit-led sections, social proof placeholder, and a single call-to-action.</PromptExample>

                <h2>Example prompts for hero sections</h2>
                <PromptExample label="Hero section">Write 5 hero headline + subheadline options for [product], each with a different angle (outcome, speed, simplicity, trust, price-free value). Keep them concrete.</PromptExample>

                <h2>Example prompts for product pages</h2>
                <PromptExample label="Product page">Outline a product page for [product]: sections, the questions each must answer, objections to address, and where to place the call-to-action.</PromptExample>

                <h2>Example prompts for developer handoff</h2>
                <PromptExample label="Handoff">Convert this page plan into structured handoff notes: section list, content per section, interactive behavior, states, and responsive rules. No fragile UI instructions.</PromptExample>

                <h2>Good vs bad prompts</h2>
                <Callout tone="good" title="Good — specific and goal-driven">
                    <PromptExample>Write homepage copy for a local bakery that wants online cake orders. Warm, simple tone. Include a headline, 3 reasons to order, and a clear "Order a cake" call-to-action.</PromptExample>
                </Callout>
                <Callout tone="bad" title="Bad — vague">
                    <PromptExample>make me a website</PromptExample>
                </Callout>

                <h2>Common mistakes</h2>
                <ul className="ait-list">
                    <li>Designing before defining the goal and primary action.</li>
                    <li>Shipping generated copy without verifying claims and facts.</li>
                    <li>Using draft code without running, testing, and reviewing it.</li>
                    <li>Ignoring accessibility, SEO, and mobile until the end.</li>
                    <li>Pasting private customer or business data into prompts.</li>
                </ul>

                <h2>Privacy &amp; safety</h2>
                <SafetyNote />

                <h2>FAQ</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            <RelatedGuides />
            <BackToHubCta note="Turning a plan into safe, working code is its own skill — the AI coding guide and prompt writing guide are great next steps." />
        </div>
    );
}
