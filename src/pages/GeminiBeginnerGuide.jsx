// GeminiBeginnerGuide — /?page=gemini-beginner-guide   CSS prefix: ait-
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import {
    TutorialHero, TutorialSEO, Step, Callout, PromptExample, FAQ, RelatedGuides, BackToHubCta, SafetyNote,
} from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "Is Google Gemini free to use?", a: "There are free ways to get started and paid options with more capabilities. Availability and features change — check the latest official details before deciding." },
    { q: "Does Gemini always give correct answers?", a: "No. Like all assistants, it can be confidently wrong or produce fabricated sources. Verify anything important in a trusted place." },
    { q: "Can Gemini see my Google account data?", a: "Access to any connected data depends on the product and your settings. Don't assume it can see your files or account unless a feature clearly says so — and never paste confidential data." },
    { q: "How is Gemini different from other assistants?", a: "It's another general-purpose AI assistant. The clear-prompting habits in this guide transfer to any tool — use whichever fits your task and access." },
];

export default function GeminiBeginnerGuide() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="How to Use Google Gemini | Step-by-Step Beginner Guide"
                description="Learn how to use Google Gemini for writing, research support, planning, productivity, brainstorming, and everyday AI help with beginner-friendly steps, prompt examples, safety tips, and mistakes to avoid."
                pageKey="gemini-beginner-guide"
                siteUrl={siteUrl}
            />

            <TutorialHero
                eyebrow="GOOGLE GEMINI · BEGINNER"
                title="How to Use Google Gemini: Step-by-Step Beginner Guide"
                intro="Google Gemini is a general-purpose AI assistant for writing, research support, planning, and everyday tasks. This guide shows how to ask well, compare answers, and verify results — with example prompts and safety tips."
                level="Beginner"
                minutes={9}
            />

            <section className="section ait-guide-body">
                <h2>What is Google Gemini?</h2>
                <p>
                    Google Gemini is an AI assistant made by Google. You type a question or task and it
                    replies in natural language. It's a general-purpose tool for writing, explaining,
                    planning, and brainstorming. CinNova is independent and not affiliated with Google;
                    this is a neutral how-to guide.
                </p>

                <h2>What it's commonly used for</h2>
                <ul className="ait-list">
                    <li>Writing and rewriting — messages, posts, and drafts.</li>
                    <li>Research support — background, key terms, and angles to explore.</li>
                    <li>Planning — outlines, checklists, and schedules.</li>
                    <li>Productivity — summarizing and organizing information.</li>
                    <li>Brainstorming — ideas, names, and comparisons.</li>
                </ul>

                <h2>What it's good at</h2>
                <p>Explaining topics plainly, generating options fast, restructuring text, and helping you plan. It works best with a clear question and useful context.</p>

                <h2>What it's not reliable for</h2>
                <Callout tone="warn" title="Verify before trusting">
                    <ul className="ait-list">
                        <li>Specific facts, numbers, dates, and quotes.</li>
                        <li>Sources and links — confirm each one yourself.</li>
                        <li>Recent events, unless a feature clearly provides current data.</li>
                        <li>High-stakes advice: medical, legal, financial, or safety.</li>
                    </ul>
                </Callout>

                <h2>Step-by-step</h2>
                <div className="ait-steps">
                    <Step n={1} title="Ask a clear question">
                        <p>Be specific about what you want. A focused question gets a focused answer.</p>
                        <PromptExample label="Example">What are 3 beginner-friendly ways to start composting in a small apartment?</PromptExample>
                    </Step>
                    <Step n={2} title="Add context and constraints">
                        <p>Give your situation, audience, and limits — length, tone, and what to avoid.</p>
                        <PromptExample label="Example">Explain it for a total beginner, keep it under 150 words, and avoid expensive equipment.</PromptExample>
                    </Step>
                    <Step n={3} title="Ask for summaries, outlines, or comparisons">
                        <p>Use it to structure information: summarize text you provide, outline a plan, or compare options.</p>
                        <PromptExample label="Example">Summarize the text below into 5 bullets, then list any open questions. Text: [paste].</PromptExample>
                    </Step>
                    <Step n={4} title="Use it for planning and productivity">
                        <p>Turn goals into steps, draft schedules, and organize to-dos.</p>
                        <PromptExample label="Example">Turn this goal into a 2-week plan with small daily tasks: [goal].</PromptExample>
                    </Step>
                    <Step n={5} title="Ask for source-checking help — without blindly trusting it">
                        <p>Ask what kinds of sources would be credible and what to search for. Don't accept any specific citation without opening it yourself.</p>
                        <PromptExample label="Example">What types of credible sources should I look for on [topic], and what search terms would find them?</PromptExample>
                    </Step>
                    <Step n={6} title="Compare and refine answers">
                        <p>Ask for alternatives, then push the best one further with targeted follow-ups.</p>
                        <PromptExample label="Example">Give me a simpler version and a more detailed version, then tell me which fits a beginner better.</PromptExample>
                    </Step>
                    <Step n={7} title="Verify important facts">
                        <p>Confirm any fact, number, or source in a trusted place before you use it. Treat the answer as a draft.</p>
                    </Step>
                    <Step n={8} title="Protect private information">
                        <p>Don't paste passwords, keys, or confidential data. Check the latest official settings on how your data is used.</p>
                    </Step>
                </div>

                <h2>Example prompts for writing</h2>
                <PromptExample label="Writing">Draft a polite message asking a neighbor to move their car, keep it friendly and under 60 words.</PromptExample>

                <h2>Example prompts for research planning</h2>
                <PromptExample label="Research">Give me an outline and 8 key terms to research for a beginner report on [topic].</PromptExample>

                <h2>Example prompts for productivity</h2>
                <PromptExample label="Productivity">Summarize these to-dos into 3 priorities for today and explain the order: [paste].</PromptExample>

                <h2>Good vs bad prompts</h2>
                <Callout tone="good" title="Good — specific and bounded">
                    <PromptExample>Act as a trip planner. Build a relaxed 3-day itinerary for a first-time visitor to a coastal town, budget-friendly, as a day-by-day list.</PromptExample>
                </Callout>
                <Callout tone="bad" title="Bad — too open-ended">
                    <PromptExample>plan a trip</PromptExample>
                </Callout>

                <h2>Common beginner mistakes</h2>
                <ul className="ait-list">
                    <li>Asking broad questions instead of specific ones.</li>
                    <li>Skipping constraints, then getting long, unfocused answers.</li>
                    <li>Trusting facts, numbers, and links without checking them.</li>
                    <li>Pasting private or confidential information.</li>
                </ul>

                <h2>Privacy &amp; safety</h2>
                <SafetyNote />

                <h2>FAQ</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            <RelatedGuides />
            <BackToHubCta note="The prompt writing and research guides will make Gemini even more useful." />
        </div>
    );
}
