// ClaudeWithAdobeGuide — /?page=claude-with-adobe-guide   CSS prefix: ait-
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import {
    TutorialHero, TutorialSEO, Step, Callout, PromptExample, FAQ, RelatedGuides, BackToHubCta, SafetyNote,
} from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "Does Claude integrate with Adobe apps?", a: "This guide is about using Claude alongside Adobe tools, not an official integration. You do the planning and prompting in Claude, then create the actual artwork in your Adobe apps by hand. CinNova is independent and not affiliated with Anthropic or Adobe." },
    { q: "Can Claude edit my Photoshop or Illustrator files?", a: "No. Claude works with text — it helps you plan, brief, write copy, and review ideas. The design work itself happens in your creative tools." },
    { q: "Will Claude design the whole project for me?", a: "It's best treated as a planning and thinking partner, not a designer. Use it to sharpen the brief, generate directions, and review your work — then apply your own creative judgment." },
    { q: "Is it safe to share client work with Claude?", a: "Be careful. Don't paste confidential client files, contracts, passwords, or private data. Keep prompts general and check the latest official privacy settings before sharing anything sensitive." },
];

export default function ClaudeWithAdobeGuide() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="How to Use Claude with Adobe | Creative Workflow Guide"
                description="Learn how to use Claude alongside Adobe tools to plan creative projects: write briefs, generate mood board ideas, draft copy, request design variations, and review your work. Includes example prompts and privacy tips."
                pageKey="claude-with-adobe-guide"
                siteUrl={siteUrl}
            />

            <TutorialHero
                eyebrow="CLAUDE WORKFLOW · CREATIVE"
                title="How to Use Claude with Adobe: Creative Workflow Guide"
                intro="This guide shows how to use Claude alongside Adobe tools — to plan, brief, draft copy, and review — so you walk into Photoshop, Illustrator, or Premiere with a clear direction. Claude handles the thinking and words; you create the artwork."
                level="Workflow"
                minutes={10}
            />

            <section className="section ait-guide-body">
                <h2>What this workflow is for</h2>
                <p>
                    Adobe tools are where you make the artwork; Claude is where you think it through first.
                    In this workflow you use Claude alongside Adobe tools — not as an integration — to turn a
                    vague idea into a clear brief, generate creative directions, write the copy and captions,
                    and sanity-check your plan before you spend time in Photoshop, Illustrator, or Premiere.
                    CinNova is independent and not affiliated with Anthropic or Adobe; this is a neutral how-to
                    guide.
                </p>

                <h2>How Claude can help before opening Adobe tools</h2>
                <ul className="ait-list">
                    <li>Turning a rough idea into a structured creative brief.</li>
                    <li>Brainstorming mood-board directions, themes, and references to explore.</li>
                    <li>Writing headlines, captions, and layout notes to place in your design.</li>
                    <li>Suggesting design variations to try so you're not staring at a blank canvas.</li>
                    <li>Reviewing your described design for clarity, hierarchy, and consistency.</li>
                </ul>

                <h2>What Claude cannot replace</h2>
                <Callout tone="warn" title="Claude is a planning partner, not a designer">
                    <ul className="ait-list">
                        <li>It can't create or edit images, vectors, or video — that's your Adobe work.</li>
                        <li>It can't judge visual craft the way your trained eye can.</li>
                        <li>It doesn't know your brand, client, or context unless you tell it (safely).</li>
                        <li>It can be confidently wrong — review every suggestion before acting on it.</li>
                    </ul>
                </Callout>

                <h2>Step-by-step</h2>
                <div className="ait-steps">
                    <Step n={1} title="Define the creative goal">
                        <p>Start by telling Claude what you're making, for whom, and why. A clear goal shapes every later step.</p>
                        <PromptExample label="Example">I'm designing a promo graphic for a local coffee shop's autumn menu. Audience: regulars aged 25–45. Goal: make the seasonal drinks feel cozy and inviting. Help me clarify the creative direction.</PromptExample>
                    </Step>
                    <Step n={2} title="Ask Claude for a project brief">
                        <p>Have it turn your goal into a structured brief you can work from — objective, audience, tone, deliverables, and constraints.</p>
                        <PromptExample label="Example">Write a one-page creative brief for this project with sections for objective, audience, tone, key message, deliverables, and constraints.</PromptExample>
                    </Step>
                    <Step n={3} title="Generate mood board ideas">
                        <p>Ask for directions to explore — themes, color moods, typography feel, and reference styles — then gather your own visual references in Adobe.</p>
                        <PromptExample label="Example">Suggest 3 distinct visual directions for this brief. For each, describe the mood, color feeling, type style, and the kind of imagery to look for.</PromptExample>
                    </Step>
                    <Step n={4} title="Create copy, captions, and layout notes">
                        <p>Draft the words that will live in the design — headline options, supporting copy, and notes on where each piece should sit.</p>
                        <PromptExample label="Example">Give me 5 headline options and 2 short supporting lines for direction 2, plus notes on where each should go in the layout.</PromptExample>
                    </Step>
                    <Step n={5} title="Ask Claude for design variations">
                        <p>Explore alternatives before committing — different layouts, focal points, or hierarchies described in words you can then build.</p>
                        <PromptExample label="Example">Describe 3 layout variations for this graphic, each with a different focal point and visual hierarchy.</PromptExample>
                    </Step>
                    <Step n={6} title="Move the plan into Adobe tools manually">
                        <p>Now open your Adobe app and build the design yourself using the brief, copy, and layout notes as your guide. This is where your craft takes over.</p>
                    </Step>
                    <Step n={7} title="Use Claude to review the design">
                        <p>Describe what you built (or the choices you made) and ask for a critique on clarity, hierarchy, and whether it serves the goal.</p>
                        <PromptExample label="Example">Here's what I designed: [describe layout, colors, and copy]. Does it clearly serve the goal and audience? What would you tighten?</PromptExample>
                    </Step>
                    <Step n={8} title="Create export/checklist notes">
                        <p>Ask for a pre-export checklist so nothing slips — sizes, formats, text proofing, and platform requirements.</p>
                        <PromptExample label="Example">Give me a pre-export checklist for this graphic covering formats, sizes for print and social, text proofing, and common mistakes to avoid.</PromptExample>
                    </Step>
                </div>

                <h2>Example prompts for Photoshop-style projects</h2>
                <PromptExample label="Photoshop-style">Help me plan a photo-based promo image for [product]. Suggest a composition, where text should sit for readability, and a short list of edits to make the subject stand out.</PromptExample>

                <h2>Example prompts for Illustrator-style projects</h2>
                <PromptExample label="Illustrator-style">I'm creating a simple vector logo concept for [brand]. Suggest 3 visual metaphors, a shape direction for each, and copy for a one-line tagline.</PromptExample>

                <h2>Example prompts for Premiere / short video planning</h2>
                <PromptExample label="Video planning">Help me outline a 20-second promo video for [product]. Give me a shot list, on-screen text for each beat, and a suggested pacing — I'll edit it in my video tool.</PromptExample>

                <h2>Good vs bad prompts</h2>
                <Callout tone="good" title="Good — clear goal and constraints">
                    <PromptExample>Write a creative brief for a minimal Instagram post announcing a bookshop's poetry night. Warm, literary tone. Deliverable: one square graphic with a headline and date.</PromptExample>
                </Callout>
                <Callout tone="bad" title="Bad — vague">
                    <PromptExample>make me a cool design</PromptExample>
                </Callout>

                <h2>Common mistakes</h2>
                <ul className="ait-list">
                    <li>Expecting Claude to produce the artwork instead of the plan.</li>
                    <li>Skipping the brief and jumping straight into the design.</li>
                    <li>Accepting the first direction without exploring variations.</li>
                    <li>Not reviewing copy for accuracy before placing it in a design.</li>
                    <li>Pasting confidential client files or private data into prompts.</li>
                </ul>

                <h2>Privacy &amp; client-data safety</h2>
                <SafetyNote />

                <h2>FAQ</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            <RelatedGuides />
            <BackToHubCta note="Strong prompts make this workflow far more useful — the Claude beginner guide and prompt writing guide are great next steps." />
        </div>
    );
}
