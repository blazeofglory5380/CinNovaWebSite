// ClaudeBeginnerGuide — /?page=claude-beginner-guide   CSS prefix: ait-
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import {
    TutorialHero, TutorialSEO, Step, Callout, PromptExample, FAQ, RelatedGuides, BackToHubCta, SafetyNote,
} from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "What makes Claude different from other assistants?", a: "People often use Claude for longer documents, careful summarizing, and writing tasks. In practice, the same clear-prompting habits work across all assistants — pick whichever tool fits your task and access." },
    { q: "Can I trust Claude's summaries?", a: "Summaries of text you provide are usually solid, but still skim the original for anything important. For facts, numbers, or claims, verify against the source." },
    { q: "Is it safe to paste a long document?", a: "Only if it contains nothing private or confidential. Remove names, secrets, and sensitive details first, and check the latest official settings on data handling." },
    { q: "Does Claude know current events?", a: "Don't assume it has live, up-to-date information unless a feature clearly says so. Verify anything time-sensitive yourself." },
];

export default function ClaudeBeginnerGuide() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="How to Use Claude | Step-by-Step Beginner Guide"
                description="Learn how to use Claude for writing, summarizing, studying, planning, coding help, and document-style work with beginner-friendly steps, examples, privacy tips, and common mistakes to avoid."
                pageKey="claude-beginner-guide"
                siteUrl={siteUrl}
            />

            <TutorialHero
                eyebrow="CLAUDE · BEGINNER"
                title="How to Use Claude: Step-by-Step Beginner Guide"
                intro="Claude is a conversational AI assistant that's popular for writing, summarizing, and working with longer documents. This guide walks you through getting clear, structured results — with examples, privacy tips, and beginner mistakes to avoid."
                level="Beginner"
                minutes={9}
            />

            <section className="section ait-guide-body">
                <h2>What is Claude?</h2>
                <p>
                    Claude is an AI chat assistant made by Anthropic. You type a message and it responds in
                    natural language. It's a general-purpose tool people often reach for when drafting,
                    summarizing, or thinking through longer pieces of text. CinNova is independent and not
                    affiliated with Anthropic; this is a neutral how-to guide.
                </p>

                <h2>What it's commonly used for</h2>
                <ul className="ait-list">
                    <li>Writing and editing — drafts, rewrites, and tone changes.</li>
                    <li>Summarizing — condensing text you provide into key points.</li>
                    <li>Studying — explaining concepts and organizing notes.</li>
                    <li>Planning and analysis — outlines, comparisons, and pros/cons.</li>
                    <li>Coding help — small functions, explanations, and reviews.</li>
                </ul>

                <h2>What it's good at</h2>
                <p>Clear explanations, careful rewriting, structured output, and working with longer text you paste in. It responds well to detailed instructions and step-by-step requests.</p>

                <h2>What it's not reliable for</h2>
                <Callout tone="warn" title="Verify these before trusting them">
                    <ul className="ait-list">
                        <li>Specific facts, figures, dates, and quotes.</li>
                        <li>Citations and links — confirm every source yourself.</li>
                        <li>Current events, unless a feature clearly provides live data.</li>
                        <li>High-stakes decisions: medical, legal, financial, or safety.</li>
                    </ul>
                </Callout>

                <h2>Step-by-step</h2>
                <div className="ait-steps">
                    <Step n={1} title="Explain your goal">
                        <p>Say what you want and why. A one-line goal steers the whole conversation.</p>
                        <PromptExample label="Example">I want a clear, friendly summary of this article for a newsletter. Goal: readers should grasp the main point in 30 seconds.</PromptExample>
                    </Step>
                    <Step n={2} title="Provide enough context">
                        <p>Paste the text or details it should work from (nothing private), plus the audience and tone.</p>
                    </Step>
                    <Step n={3} title="Ask for structured output">
                        <p>Request a format: bullet points, a table, sections with headings, or a short paragraph.</p>
                        <PromptExample label="Example">Return the summary as 4 short bullets, then one closing sentence.</PromptExample>
                    </Step>
                    <Step n={4} title="Use Claude for drafts and summaries">
                        <p>Let it produce a first draft or a summary of material you supply — then you refine.</p>
                        <PromptExample label="Example">Summarize the notes below into a tight paragraph. Use only what I provided; don't add facts. Notes: [paste].</PromptExample>
                    </Step>
                    <Step n={5} title="Ask for revisions and alternatives">
                        <p>Request variations to compare, or point at the exact part to change.</p>
                        <PromptExample label="Example">Give me two more versions — one more formal, one more casual — each under 60 words.</PromptExample>
                    </Step>
                    <Step n={6} title="Use it for planning and analysis">
                        <p>Ask for outlines, comparisons, and structured pros and cons to organize your thinking.</p>
                        <PromptExample label="Example">Compare these two options as a simple pros/cons table, then recommend one and explain why: [paste].</PromptExample>
                    </Step>
                    <Step n={7} title="Review and verify important information">
                        <p>Skim the source and confirm any fact, number, or claim before you rely on it. Treat output as a draft.</p>
                    </Step>
                    <Step n={8} title="Avoid pasting sensitive information">
                        <p>Strip out names, passwords, keys, and confidential details before sharing text. Check the latest official settings on how data is handled.</p>
                    </Step>
                </div>

                <h2>Example prompts for writing</h2>
                <PromptExample label="Writing">Rewrite this so it's clear and warm for a general audience, keep all facts, and return only the rewrite: [paste].</PromptExample>

                <h2>Example prompts for summarizing</h2>
                <PromptExample label="Summarize">Summarize the text below into 5 key points a busy reader can scan. Text: [paste].</PromptExample>

                <h2>Example prompts for studying / planning</h2>
                <PromptExample label="Plan">Turn this goal into a simple weekly plan with small daily steps: [goal].</PromptExample>

                <h2>Example prompts for coding help</h2>
                <PromptExample label="Coding">Explain what this function does line by line and suggest one safer improvement: [paste].</PromptExample>

                <h2>Good vs bad prompts</h2>
                <Callout tone="good" title="Good — clear goal, format, and material">
                    <PromptExample>Summarize the pasted meeting notes into 3 decisions and 3 action items with owners. Notes: [paste].</PromptExample>
                </Callout>
                <Callout tone="bad" title="Bad — no material, no format">
                    <PromptExample>summarize my meeting</PromptExample>
                </Callout>

                <h2>Common beginner mistakes</h2>
                <ul className="ait-list">
                    <li>Asking for a summary without pasting the text to summarize.</li>
                    <li>Skipping format instructions, then getting a wall of text.</li>
                    <li>Trusting facts and citations without checking them.</li>
                    <li>Pasting sensitive or confidential material.</li>
                </ul>

                <h2>Privacy &amp; safety</h2>
                <SafetyNote />

                <h2>FAQ</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            <RelatedGuides />
            <BackToHubCta note="Want sharper results? The prompt writing guide pairs perfectly with Claude." />
        </div>
    );
}
