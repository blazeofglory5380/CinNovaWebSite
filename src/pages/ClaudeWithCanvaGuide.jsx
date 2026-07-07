// ClaudeWithCanvaGuide — /?page=claude-with-canva-guide   CSS prefix: ait-
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import {
    TutorialHero, TutorialSEO, Step, Callout, PromptExample, FAQ, RelatedGuides, BackToHubCta, SafetyNote,
} from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "Does Claude integrate with Canva?", a: "This guide is about using Claude alongside Canva, not an official integration. You do the planning, copy, and review in Claude, then build the actual design in Canva by hand. CinNova is independent and not affiliated with Anthropic or Canva." },
    { q: "Can Claude create the Canva design for me?", a: "No. Claude works with text — it helps you plan, write copy, and review ideas. The design itself happens in Canva, where you place and style everything yourself." },
    { q: "Will Claude keep my brand consistent?", a: "It can remind you of your brand rules and review described designs for consistency, but you apply the colors, fonts, and logo in Canva. Keep a simple brand reference to paste in (without private data)." },
    { q: "Is it safe to share client work with Claude?", a: "Be careful. Don't paste confidential client files, contracts, passwords, or private data. Keep prompts general and check the latest official privacy settings before sharing anything sensitive." },
];

export default function ClaudeWithCanvaGuide() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="How to Use Claude with Canva | Design Workflow Guide"
                description="Learn how to use Claude alongside Canva to plan designs: write creative briefs, draft copy and layout ideas, request variations, and review for brand consistency. Includes example prompts and privacy tips."
                pageKey="claude-with-canva-guide"
                siteUrl={siteUrl}
            />

            <TutorialHero
                eyebrow="CLAUDE WORKFLOW · DESIGN"
                title="How to Use Claude with Canva: Design Workflow Guide"
                intro="This guide shows how to use Claude alongside Canva — to plan, brief, draft copy, and review — so you open Canva with a clear direction instead of a blank page. Claude handles the thinking and words; you build the design in Canva."
                level="Workflow"
                minutes={10}
            />

            <section className="section ait-guide-body">
                <h2>What this workflow is for</h2>
                <p>
                    Canva is where you build the design; Claude is where you plan it. In this workflow you use
                    Claude alongside Canva — not as an integration — to turn a rough idea into a clear brief,
                    write the copy and captions, suggest layout directions, and review your work before and
                    after you build it. CinNova is independent and not affiliated with Anthropic or Canva; this
                    is a neutral how-to guide.
                </p>

                <h2>How Claude can help before opening Canva</h2>
                <ul className="ait-list">
                    <li>Turning a vague idea into a focused creative brief.</li>
                    <li>Writing headlines, captions, and body copy you can drop into a design.</li>
                    <li>Suggesting layout directions and what each section should communicate.</li>
                    <li>Generating design variations to try so you're not starting from scratch.</li>
                    <li>Reviewing a described design for clarity and brand consistency.</li>
                </ul>

                <h2>What Claude cannot replace</h2>
                <Callout tone="warn" title="Claude plans; you design in Canva">
                    <ul className="ait-list">
                        <li>It can't place elements, pick images, or style the layout — that's your Canva work.</li>
                        <li>It can't judge visual balance the way your eye can.</li>
                        <li>It doesn't know your brand or client unless you tell it (safely).</li>
                        <li>It can be confidently wrong — review every suggestion before using it.</li>
                    </ul>
                </Callout>

                <h2>Step-by-step</h2>
                <div className="ait-steps">
                    <Step n={1} title="Define the design goal">
                        <p>Tell Claude what you're making, for whom, and the one action you want it to drive. A clear goal shapes every later step.</p>
                        <PromptExample label="Example">I'm making an Instagram post for a yoga studio's new beginner class. Audience: local adults new to yoga. Goal: get sign-ups. Help me clarify the direction.</PromptExample>
                    </Step>
                    <Step n={2} title="Ask Claude for a creative brief">
                        <p>Have it turn the goal into a short brief — objective, audience, tone, key message, and deliverable.</p>
                        <PromptExample label="Example">Write a short creative brief for this post with objective, audience, tone, key message, and the single call-to-action.</PromptExample>
                    </Step>
                    <Step n={3} title="Generate copy and layout ideas">
                        <p>Draft the words and describe where they should sit — headline options, supporting line, and layout notes.</p>
                        <PromptExample label="Example">Give me 5 headline options, one supporting line, and notes on where each should go in a square layout.</PromptExample>
                    </Step>
                    <Step n={4} title="Create social post, presentation, or flyer text">
                        <p>Ask for the full text for your specific format, ready to place in Canva.</p>
                        <PromptExample label="Example">Write the full text for a 3-slide carousel: slide 1 hook, slide 2 benefit, slide 3 call-to-action. Keep each slide short.</PromptExample>
                    </Step>
                    <Step n={5} title="Ask Claude for design variations">
                        <p>Explore alternatives before committing — different focal points, hierarchies, or tones described in words.</p>
                        <PromptExample label="Example">Describe 3 layout variations for this post, each with a different focal point and visual emphasis.</PromptExample>
                    </Step>
                    <Step n={6} title="Move the plan into Canva manually">
                        <p>Open Canva and build the design yourself using the brief, copy, and layout notes. Pick a suitable size, place your text, and apply your visuals.</p>
                    </Step>
                    <Step n={7} title="Use Claude to review clarity and brand consistency">
                        <p>Describe what you built and ask whether it's clear, on-brand, and serves the goal.</p>
                        <PromptExample label="Example">Here's my design: [describe layout, colors, copy]. Is it clear and on-brand for the goal and audience? What would you tighten?</PromptExample>
                    </Step>
                    <Step n={8} title="Create export and posting checklist notes">
                        <p>Ask for a pre-export and posting checklist so nothing slips — sizes, formats, text proofing, and platform requirements.</p>
                        <PromptExample label="Example">Give me an export and posting checklist for this Instagram post: size, format, proofing, hashtags to consider, and common mistakes to avoid.</PromptExample>
                    </Step>
                </div>

                <h2>Example prompts for social media posts</h2>
                <PromptExample label="Social">Help me plan an Instagram post for [offer]. Give me a hook headline, a one-line benefit, a call-to-action, and layout notes for a square format.</PromptExample>

                <h2>Example prompts for presentations</h2>
                <PromptExample label="Presentation">Outline a 6-slide presentation about [topic] for [audience]. For each slide, give a title and 2–3 bullet points, plus a note on what visual would support it.</PromptExample>

                <h2>Example prompts for marketing graphics</h2>
                <PromptExample label="Marketing">Write text and layout notes for a promotional flyer for [product/event]: headline, key details, call-to-action, and where each should sit for readability.</PromptExample>

                <h2>Good vs bad prompts</h2>
                <Callout tone="good" title="Good — clear goal and format">
                    <PromptExample>Write copy for a square Instagram post announcing a bakery's new sourdough. Warm, friendly tone. Headline, one benefit line, and a "Try it this weekend" call-to-action.</PromptExample>
                </Callout>
                <Callout tone="bad" title="Bad — vague">
                    <PromptExample>make me a canva post</PromptExample>
                </Callout>

                <h2>Common mistakes</h2>
                <ul className="ait-list">
                    <li>Expecting Claude to build the Canva design instead of the plan.</li>
                    <li>Skipping the brief and designing without a clear goal.</li>
                    <li>Publishing without proofreading the copy in the final design.</li>
                    <li>Ignoring brand colors, fonts, and consistent spacing.</li>
                    <li>Pasting confidential client files or private data into prompts.</li>
                </ul>

                <h2>Privacy &amp; client-data safety</h2>
                <SafetyNote />

                <h2>FAQ</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            <RelatedGuides />
            <BackToHubCta note="Clear prompts make this workflow far more useful — the Claude beginner guide and prompt writing guide are great next steps." />
        </div>
    );
}
