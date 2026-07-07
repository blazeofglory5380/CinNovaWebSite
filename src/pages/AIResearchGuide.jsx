// AIResearchGuide — /?page=ai-research-guide   CSS prefix: ait-
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import {
    TutorialHero, TutorialSEO, Step, Callout, PromptExample, FAQ, BackToHubCta, SafetyNote,
} from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "Can I cite an AI tool as a source?", a: "Generally no. AI output is not a primary source and can be wrong. Use AI to find and understand ideas, then cite the original, verifiable sources you confirm yourself." },
    { q: "Why did the AI invent a study or a link?", a: "Language models can 'hallucinate' — produce confident text that isn't true, including fake citations and URLs. Always open and verify any source before relying on it." },
    { q: "Is using AI for research considered cheating?", a: "It depends on your school or workplace rules. Using AI to explain concepts or organize your thinking is often fine; submitting AI-written work as your own may not be. Check the policy and be transparent." },
    { q: "What is AI actually good at for research?", a: "Explaining concepts in plain language, suggesting search terms and angles, outlining, and summarizing text you provide. It is weakest at facts, numbers, and citations, which you must verify." },
];

export default function AIResearchGuide() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="How to Use AI for Research | Step-by-Step Beginner Guide"
                description="Learn how to use AI for research, outlines, summaries, source discovery, and study support while avoiding hallucinations and verifying facts carefully."
                pageKey="ai-research-guide"
                siteUrl={siteUrl}
            />

            <TutorialHero
                eyebrow="AI RESEARCH · BEGINNER"
                title="How to Use AI for Research: Step-by-Step Beginner Guide"
                intro="AI can make research faster — helping you understand a topic, find angles, and organize notes. But it can also invent facts and fake sources. This guide shows how to get the speed without the risk."
                level="Beginner"
                minutes={9}
            />

            <section className="section ait-guide-body">
                <h2>What "AI research help" really means</h2>
                <p>
                    Using AI for research doesn't mean asking it for the answer and copying it down. It
                    means using AI as a fast, tireless assistant that explains ideas, suggests directions,
                    and organizes information — while you stay in charge of judging what's true.
                </p>

                <h2>What AI is good at</h2>
                <ul className="ait-list">
                    <li>Explaining unfamiliar concepts in plain language.</li>
                    <li>Suggesting search terms, subtopics, and angles you hadn't considered.</li>
                    <li>Outlining a paper, report, or study plan.</li>
                    <li>Summarizing long text that <em>you</em> provide.</li>
                    <li>Turning your rough notes into a clean structure.</li>
                </ul>

                <h2>What AI is not reliable for</h2>
                <Callout tone="warn" title="Treat these with caution — always verify">
                    <ul className="ait-list">
                        <li>Specific facts, dates, statistics, and quotes.</li>
                        <li>Citations, study names, and URLs — these are often invented.</li>
                        <li>Recent events, if the tool wasn't trained on or connected to current data.</li>
                        <li>Anything high-stakes: medical, legal, financial, or safety decisions.</li>
                    </ul>
                </Callout>

                <h2>Step-by-step</h2>
                <div className="ait-steps">
                    <Step n={1} title="Define your research question">
                        <p>A focused question guides everything. Narrow "climate change" into something answerable.</p>
                        <PromptExample label="Example">Help me sharpen this into one focused research question: "how remote work affects small-town economies."</PromptExample>
                    </Step>
                    <Step n={2} title="Ask for a background explanation">
                        <p>Get oriented before you dive in. Ask for a plain-language overview and the main schools of thought.</p>
                        <PromptExample label="Example">Explain the basics of [topic] for someone new to it, and list the main viewpoints or debates.</PromptExample>
                    </Step>
                    <Step n={3} title="Ask for key terms">
                        <p>Better vocabulary means better searching. Have the AI list the terms, names, and concepts experts use.</p>
                        <PromptExample label="Example">List 10 key terms and 5 well-known researchers or organizations associated with [topic] so I can search them.</PromptExample>
                    </Step>
                    <Step n={4} title="Ask for a research outline">
                        <p>Turn the topic into a structure you can fill with verified sources.</p>
                        <PromptExample label="Example">Create an outline for a 5-page report on [question], with sections and 2–3 sub-points each.</PromptExample>
                    </Step>
                    <Step n={5} title="Ask for source suggestions (then verify)">
                        <p>Ask what <em>kinds</em> of sources to look for and where to look — not for exact citations to trust blindly.</p>
                        <PromptExample label="Example">What types of sources (journals, agencies, datasets) would be credible for [topic], and what search terms should I use to find them?</PromptExample>
                    </Step>
                    <Step n={6} title="Verify facts with trusted sources">
                        <p>This is the most important step. Open primary sources yourself, confirm each claim, and discard anything you can't verify.</p>
                        <Callout tone="bad" title="Never do this">
                            <p>Don't copy an AI-provided statistic, quote, or citation into your work without confirming it in the original source. If you can't find the source, don't use the claim.</p>
                        </Callout>
                    </Step>
                    <Step n={7} title="Turn notes into a summary">
                        <p>Paste your own verified notes and ask the AI to organize them — not to add new facts.</p>
                        <PromptExample label="Example">Summarize the notes below into a clear paragraph. Use only what I provided; do not add facts. Notes: [paste].</PromptExample>
                    </Step>
                    <Step n={8} title="Create citations manually and carefully">
                        <p>Build citations from the real sources you opened, using your required style guide. Double-check author, title, date, and link by hand — AI-generated citations are frequently wrong.</p>
                    </Step>
                </div>

                <h2>Example prompts</h2>
                <PromptExample label="Understand">Explain [concept] to me like I'm new to the field, then give one real-world example.</PromptExample>
                <PromptExample label="Organize">Here are my verified notes. Group them into themes and flag anything that seems contradictory: [paste].</PromptExample>

                <h2>Mistakes to avoid</h2>
                <ul className="ait-list">
                    <li>Treating AI answers as facts instead of leads to verify.</li>
                    <li>Copying AI-generated citations without opening the sources.</li>
                    <li>Asking one broad question instead of narrowing the topic first.</li>
                    <li>Letting the AI "summarize" material you never actually read.</li>
                </ul>

                <h2>A warning about hallucinations</h2>
                <Callout tone="warn" title="Confident ≠ correct">
                    <p>AI tools can produce fluent, authoritative-sounding text that is simply false, including fabricated studies, statistics, and web links. The fix is always the same: verify every fact and every source in a trusted, original place before you use it.</p>
                </Callout>

                <h2>Privacy &amp; academic honesty</h2>
                <SafetyNote />
                <Callout tone="info" title="Be honest about AI use">
                    <p>Follow your school or workplace policy on AI. Using AI to understand and organize is usually fine; submitting AI-written text as your own may not be. When in doubt, disclose how you used it.</p>
                </Callout>

                <h2>FAQ</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            <BackToHubCta note="Want to build something with what you research? The AI coding guide walks through it step by step." />
        </div>
    );
}
