// ClaudeBrandingMarketingGuide — /guides/claude-branding-marketing   CSS prefix: ait-
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import {
    TutorialHero, TutorialSEO, Step, Callout, PromptExample, FAQ, RelatedGuides, BackToHubCta, SafetyNote,
} from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "Can Claude create my whole brand for me?", a: "It's a strong thinking and drafting partner for positioning, voice, and content — but the final brand decisions, judgment, and taste are yours. Treat its output as drafts to refine, not a finished brand. CinNova is independent and not affiliated with any AI company." },
    { q: "Will the marketing copy be accurate and compliant?", a: "Not automatically. Claude can write persuasive copy that includes unverified claims. Check every fact, statistic, and promise, and make sure claims are truthful and compliant before publishing." },
    { q: "Can it replace a marketer or copywriter?", a: "No. It speeds up ideation and drafting, but human strategy, brand judgment, and editing are what make marketing land. Use Claude to plan, prompt, draft, organize, and review — then apply your own expertise." },
    { q: "Is it safe to share brand or customer data?", a: "Keep customer lists, private analytics, credentials, and confidential strategy out of prompts. Share only general context and check the latest official privacy settings." },
];

export default function ClaudeBrandingMarketingGuide() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="How to Use Claude for Branding and Marketing | Beginner Guide"
                description="Learn how to use Claude for branding and marketing: define your audience, build positioning, create a voice and tone guide, generate content pillars, and draft landing, social, and email copy. Includes example prompts and safety tips."
                pageKey="claude-branding-marketing-guide"
                siteUrl={siteUrl}
            />

            <TutorialHero
                eyebrow="CLAUDE WORKFLOW · BRANDING"
                title="How to Use Claude for Branding and Marketing Content"
                intro="This guide shows how to use Claude to plan, prompt, draft, organize, and review branding and marketing content — from audience and positioning to voice, content pillars, and launch copy. Claude accelerates the thinking and drafting; your strategy and judgment lead."
                level="Workflow"
                minutes={11}
            />

            <section className="section ait-guide-body">
                <h2>How Claude can help with brand strategy</h2>
                <p>
                    Branding is mostly clear thinking about who you serve and what you stand for — exactly the
                    kind of work Claude is good at supporting. Use it to sharpen your audience, articulate your
                    positioning, and stress-test your message, then bring your own taste and judgment to the
                    final calls. CinNova is independent and not affiliated with any AI company; this is a
                    neutral how-to guide.
                </p>

                <h2>How Claude can help with tone, messaging, and content ideas</h2>
                <ul className="ait-list">
                    <li>Defining a consistent voice and tone you can reuse everywhere.</li>
                    <li>Turning your positioning into clear, benefit-led messaging.</li>
                    <li>Generating content pillars and a steady stream of ideas.</li>
                    <li>Drafting landing page, social, and email copy to refine.</li>
                    <li>Reviewing everything for clarity, trust, and consistency.</li>
                </ul>

                <h2>What Claude cannot replace</h2>
                <Callout tone="warn" title="Claude drafts; you decide and verify">
                    <ul className="ait-list">
                        <li>Real strategy, brand taste, and the final creative decisions.</li>
                        <li>Truthful, compliant claims — verify every fact and promise.</li>
                        <li>Genuine understanding of your customers and market.</li>
                        <li>Editing and judgment that make copy actually resonate.</li>
                    </ul>
                </Callout>

                <h2>Step-by-step</h2>
                <div className="ait-steps">
                    <Step n={1} title="Define your audience">
                        <p>Start with who you're for. The sharper the audience, the sharper everything downstream.</p>
                        <PromptExample label="Example">Help me define the target audience for a subscription meal-prep service for busy parents. Cover who they are, their goals, and their frustrations.</PromptExample>
                    </Step>
                    <Step n={2} title="Create brand positioning">
                        <p>Ask Claude to draft a positioning statement — who you serve, what you offer, and why you're different.</p>
                        <PromptExample label="Example">Draft 3 positioning statements for this brand, each with a different angle. Keep them specific and free of buzzwords.</PromptExample>
                    </Step>
                    <Step n={3} title="Create a voice and tone guide">
                        <p>Turn the positioning into a reusable voice guide so all your content sounds like one brand.</p>
                        <PromptExample label="Example">Create a voice and tone guide: 3 voice traits, do/don't examples for each, and how the tone shifts between a landing page and a support reply.</PromptExample>
                    </Step>
                    <Step n={4} title="Generate content pillars">
                        <p>Ask for a few core themes your content will orbit, each tied to audience needs.</p>
                        <PromptExample label="Example">Suggest 4 content pillars for this brand, each with the audience need it serves and 3 example topics.</PromptExample>
                    </Step>
                    <Step n={5} title="Draft landing page copy">
                        <p>Draft the core page: headline, value points, proof, and a clear call-to-action — then refine.</p>
                        <PromptExample label="Example">Write landing page copy in our brand voice: headline, subheadline, 3 benefit sections, an objection-handling section, and a call-to-action.</PromptExample>
                    </Step>
                    <Step n={6} title="Create social post ideas">
                        <p>Generate a batch of on-brand post ideas mapped to your content pillars.</p>
                        <PromptExample label="Example">Give me 10 social post ideas across our 4 content pillars, each with a hook and the format that suits it. Keep our voice consistent.</PromptExample>
                    </Step>
                    <Step n={7} title="Create email / newsletter ideas">
                        <p>Plan an email or newsletter series that nurtures your audience toward the goal.</p>
                        <PromptExample label="Example">Outline a 4-email welcome series for new subscribers: the goal of each email, subject line options, and the key message.</PromptExample>
                    </Step>
                    <Step n={8} title="Review for clarity, trust, and consistency">
                        <p>Do a final review pass: is it clear, honest, on-brand, and free of unverified claims?</p>
                        <PromptExample label="Example">Review this copy for clarity, trust, and brand consistency. Flag any claims that need verifying and any tone that's off-brand.</PromptExample>
                    </Step>
                </div>

                <h2>Example prompts for brand voice</h2>
                <PromptExample label="Brand voice">Define a brand voice for [brand] serving [audience]. Give 3 traits, a one-line description of each, and a short "on-brand vs off-brand" example pair.</PromptExample>

                <h2>Example prompts for product messaging</h2>
                <PromptExample label="Product messaging">Turn these product features into benefit-led messaging for [audience]: [list features]. For each, give the benefit and a one-line message.</PromptExample>

                <h2>Example prompts for social media</h2>
                <PromptExample label="Social media">Write 5 social posts for [campaign/topic] in our brand voice. Vary the hooks, keep each self-contained, and end with a clear next step.</PromptExample>

                <h2>Example prompts for launch content</h2>
                <PromptExample label="Launch">Plan launch content for [product]: an announcement post, 3 teaser posts, a launch-day email, and a landing page headline. Keep messaging consistent across all of them.</PromptExample>

                <h2>Good vs bad prompts</h2>
                <Callout tone="good" title="Good — specific and on-brand">
                    <PromptExample>Write an Instagram caption for our eco-friendly water bottle aimed at outdoor beginners. Friendly, encouraging tone, one clear benefit, and a simple call-to-action. No hype or unverifiable claims.</PromptExample>
                </Callout>
                <Callout tone="bad" title="Bad — vague">
                    <PromptExample>write marketing for my product</PromptExample>
                </Callout>

                <h2>Common mistakes</h2>
                <ul className="ait-list">
                    <li>Skipping audience and positioning, so copy feels generic.</li>
                    <li>Publishing unverified claims, stats, or promises.</li>
                    <li>Letting voice drift so content stops feeling like one brand.</li>
                    <li>Chasing hype over clarity and trust.</li>
                    <li>Pasting customer data or confidential strategy into prompts.</li>
                </ul>

                <h2>Privacy &amp; safety</h2>
                <SafetyNote />

                <h2>FAQ</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            <RelatedGuides />
            <BackToHubCta note="Clear prompts and research make brand work stronger — the prompt writing guide and AI research guide are great next steps." />
        </div>
    );
}
