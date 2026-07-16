// ClaudeWithFigmaGuide — /guides/claude-with-figma   CSS prefix: ait-
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import {
    TutorialHero, TutorialSEO, Step, Callout, PromptExample, FAQ, RelatedGuides, BackToHubCta, SafetyNote,
} from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "Does Claude integrate with Figma?", a: "This guide is about using Claude alongside Figma, not an official integration. You do the UX planning, flows, and copy in Claude, then build the actual frames and components in Figma yourself. CinNova is independent and not affiliated with Anthropic or Figma." },
    { q: "Can Claude design the screens for me?", a: "No. Claude works with text — it helps you plan user flows, write wireframe notes and microcopy, and review usability. The visual design happens in Figma, where you build the layout." },
    { q: "Is Claude a replacement for a UX designer?", a: "No. It speeds up planning and drafting, but real design craft, user research, and product judgment are yours. Use it to plan, prompt, draft, organize, and review — then apply your expertise." },
    { q: "Is it safe to share product plans with Claude?", a: "Keep confidential product roadmaps, user data, credentials, and private business details out of prompts. Share only general context and check the latest official privacy settings." },
];

export default function ClaudeWithFigmaGuide() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="How to Use Claude with Figma | UX Design Workflow Guide"
                description="Learn how to use Claude alongside Figma to plan UX and product design: map user flows, write wireframe notes and microcopy, improve usability, and prepare developer handoff. Includes example prompts and safety tips."
                pageKey="claude-with-figma-guide"
                siteUrl={siteUrl}
            />

            <TutorialHero
                eyebrow="CLAUDE WORKFLOW · UX & PRODUCT"
                title="How to Use Claude with Figma: UX and Product Design Workflow Guide"
                intro="This guide shows how to use Claude alongside Figma — to plan user flows, write wireframe notes and UX copy, and review usability — so you build frames in Figma with a clear structure. Claude handles the thinking and words; you design in Figma."
                level="Workflow"
                minutes={11}
            />

            <section className="section ait-guide-body">
                <h2>What this workflow is for</h2>
                <p>
                    Good product design starts with clear thinking about flows, structure, and words — then
                    the visual craft happens in Figma. In this workflow you use Claude alongside Figma — not as
                    an integration — to map user flows, describe each screen's sections, draft UX copy, and
                    pressure-test usability before and after you build. CinNova is independent and not
                    affiliated with Anthropic or Figma; this is a neutral how-to guide.
                </p>

                <h2>How Claude can help with UX planning</h2>
                <ul className="ait-list">
                    <li>Mapping user flows and the steps a person takes to reach a goal.</li>
                    <li>Describing each screen's sections as a text wireframe.</li>
                    <li>Drafting UX copy and microcopy — labels, buttons, empty states, errors.</li>
                    <li>Spotting usability friction and suggesting improvements.</li>
                    <li>Reviewing for accessibility, clarity, and consistency.</li>
                </ul>

                <h2>What Claude cannot replace</h2>
                <Callout tone="warn" title="Claude plans; you design and validate">
                    <ul className="ait-list">
                        <li>Visual design craft, layout, and component work in Figma.</li>
                        <li>Real user research and testing with actual people.</li>
                        <li>Product judgment about trade-offs and priorities.</li>
                        <li>Accessibility and compliance sign-off by a qualified person.</li>
                    </ul>
                </Callout>

                <h2>Step-by-step</h2>
                <div className="ait-steps">
                    <Step n={1} title="Define the product or page goal">
                        <p>Tell Claude who the screen is for and the single outcome it should drive. Everything else follows from this.</p>
                        <PromptExample label="Example">I'm designing an onboarding screen for a budgeting app aimed at first-time users. Goal: get them to connect one account. Help me define the screen's purpose.</PromptExample>
                    </Step>
                    <Step n={2} title="Ask Claude for user flows">
                        <p>Map the steps a user takes to reach the goal, including decision points and edge cases.</p>
                        <PromptExample label="Example">Map the user flow for connecting an account: the steps, decision points, and what happens if it fails.</PromptExample>
                    </Step>
                    <Step n={3} title="Create wireframe section notes">
                        <p>For each screen, describe the sections top to bottom and what each one does — a text wireframe you'll build in Figma.</p>
                        <PromptExample label="Example">For the onboarding screen, list the sections in order. For each, describe its purpose, content, and the action it drives.</PromptExample>
                    </Step>
                    <Step n={4} title="Generate UX copy and microcopy">
                        <p>Draft the words users read — headings, button labels, helper text, empty states, and error messages.</p>
                        <PromptExample label="Example">Write microcopy for this screen: heading, subtext, primary button label, and a friendly error message if the connection fails.</PromptExample>
                    </Step>
                    <Step n={5} title="Ask Claude for usability improvements">
                        <p>Have it review the flow for friction — confusing steps, missing feedback, or unclear next actions.</p>
                        <PromptExample label="Example">Review this flow for a first-time user. Where might they hesitate or get confused, and what would you change?</PromptExample>
                    </Step>
                    <Step n={6} title="Move the structure into Figma manually">
                        <p>Open Figma and build the frames, components, and layout using the flow, wireframe notes, and copy as your guide. This is where your design craft takes over.</p>
                    </Step>
                    <Step n={7} title="Use Claude to review accessibility and clarity">
                        <p>Describe your screens and ask for an accessibility and clarity review — readable structure, contrast considerations, and clear labels.</p>
                        <PromptExample label="Example">Review this screen's described structure for accessibility and clarity. List concrete improvements a beginner can apply.</PromptExample>
                    </Step>
                    <Step n={8} title="Create handoff notes for developers">
                        <p>Ask for clear, implementation-agnostic handoff notes: sections, behavior, states, and responsive rules.</p>
                        <PromptExample label="Example">Turn this screen into developer handoff notes: sections, interactive behavior, states, and responsive rules. No fragile UI instructions.</PromptExample>
                    </Step>
                </div>

                <h2>Example prompts for landing pages</h2>
                <PromptExample label="Landing page">Plan a landing page for [offer] aimed at [audience]. Give me the section flow top to bottom, the job of each section, and the single call-to-action.</PromptExample>

                <h2>Example prompts for app screens</h2>
                <PromptExample label="App screen">Plan the [screen name] for [app]. List the sections, the primary action, the states (empty, loading, error, success), and microcopy for each.</PromptExample>

                <h2>Example prompts for onboarding flows</h2>
                <PromptExample label="Onboarding">Design a 3-step onboarding flow for [app] that gets users to [key action]. For each step: goal, content, and the copy that keeps momentum.</PromptExample>

                <h2>Example prompts for design-system notes</h2>
                <PromptExample label="Design system">Help me document component guidelines for [button/input/card]: when to use it, its states, spacing intent, and accessibility notes. Keep it implementation-agnostic.</PromptExample>

                <h2>Good vs bad prompts</h2>
                <Callout tone="good" title="Good — specific and structured">
                    <PromptExample>Map the user flow for a password reset in a mobile app: the steps, the states, error handling, and microcopy for each screen. Keep it beginner-friendly.</PromptExample>
                </Callout>
                <Callout tone="bad" title="Bad — vague">
                    <PromptExample>design my app</PromptExample>
                </Callout>

                <h2>Common mistakes</h2>
                <ul className="ait-list">
                    <li>Designing screens before mapping the flow and goal.</li>
                    <li>Forgetting states — empty, loading, error, and success.</li>
                    <li>Writing microcopy as an afterthought instead of planning it.</li>
                    <li>Skipping accessibility until the very end.</li>
                    <li>Pasting confidential product or user data into prompts.</li>
                </ul>

                <h2>Privacy &amp; safety</h2>
                <SafetyNote />

                <h2>FAQ</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            <RelatedGuides />
            <BackToHubCta note="Planning websites and UX pairs well with clear prompts — the Claude website design guide and prompt writing guide are great next steps." />
        </div>
    );
}
