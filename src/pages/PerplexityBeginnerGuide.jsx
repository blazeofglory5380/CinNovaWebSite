// PerplexityBeginnerGuide — /?page=perplexity-beginner-guide   CSS prefix: ait-
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import {
    TutorialHero, TutorialSEO, Step, Callout, PromptExample, FAQ, RelatedGuides, BackToHubCta, SafetyNote,
} from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "Is Perplexity free to use?", a: "There are free ways to get started as well as paid options with more features. Availability and features change over time — check the latest official details before deciding." },
    { q: "Does Perplexity show sources?", a: "It's designed to answer questions and point to sources you can open and check. Always click through and confirm the source actually supports the claim before you rely on it." },
    { q: "Can I trust the answers without checking?", a: "No. Like any AI tool, it can summarize a source incorrectly, mix up details, or miss context. Use it to find leads and starting points, then verify anything important yourself." },
    { q: "Is it better than a normal search engine?", a: "It's a different style of tool: instead of a list of links, you get a written answer with references. Both are useful — many people use an answer engine to get oriented, then normal search to dig deeper." },
    { q: "Can it see my files or private accounts?", a: "Don't assume it can access anything you haven't clearly shared through an official feature. Never paste passwords, private data, or confidential files into any prompt." },
];

export default function PerplexityBeginnerGuide() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="How to Use Perplexity | Step-by-Step Beginner Guide"
                description="Learn how to use Perplexity as a beginner: ask clear research questions, follow up, compare sources, and verify facts. Includes example prompts, good vs bad prompts, common mistakes, and privacy tips."
                pageKey="perplexity-beginner-guide"
                siteUrl={siteUrl}
            />

            <TutorialHero
                eyebrow="PERPLEXITY · BEGINNER"
                title="How to Use Perplexity: Step-by-Step Beginner Guide"
                intro="Perplexity is an AI answer engine that responds to questions in plain language and points you to sources you can check. This guide shows how to use it for real research — with example prompts, safety tips, and the mistakes beginners make most."
                level="Beginner"
                minutes={9}
            />

            <section className="section ait-guide-body">
                <h2>What is Perplexity?</h2>
                <p>
                    Perplexity is an AI "answer engine." You ask a question in normal language and it
                    writes a short, readable answer while linking to the sources it drew from. Instead of
                    handing you a page of blue links to sort through, it tries to summarize what those pages
                    say — with references you can open to check the details yourself. CinNova is independent
                    and not affiliated with Perplexity; this is a neutral how-to guide.
                </p>

                <h2>What it's commonly used for</h2>
                <ul className="ait-list">
                    <li>Quick research — getting oriented on an unfamiliar topic fast.</li>
                    <li>Answering specific questions with references to follow up on.</li>
                    <li>Comparing options — tools, approaches, definitions, or points of view.</li>
                    <li>Summarizing what several sources say about a question.</li>
                    <li>Learning a new subject step by step with follow-up questions.</li>
                </ul>

                <h2>What it's good at</h2>
                <p>
                    Turning a messy question into a clear starting answer, surfacing sources you might not
                    have found, and letting you ask follow-ups in a natural conversation. It's strongest when
                    your question is specific and you treat its answer as a map to real sources — not as the
                    final word.
                </p>

                <h2>What it's not reliable for</h2>
                <Callout tone="warn" title="Always verify these">
                    <ul className="ait-list">
                        <li>Exact facts, numbers, dates, and quotes — open the source and confirm them.</li>
                        <li>Whether a source is trustworthy — a link is not proof the claim is correct.</li>
                        <li>Very recent or fast-changing events, where sources may lag or conflict.</li>
                        <li>High-stakes decisions: medical, legal, financial, or safety choices.</li>
                        <li>Niche topics with few good sources, where it may fill gaps with guesses.</li>
                    </ul>
                </Callout>

                <h2>Step-by-step</h2>
                <div className="ait-steps">
                    <Step n={1} title="Start with a clear research question">
                        <p>The more specific your question, the more useful the answer. Name the topic, the angle, and any constraints so the tool knows exactly what you're after.</p>
                        <PromptExample label="Example">What are the main pros and cons of a 15-year vs 30-year mortgage for a first-time buyer? Keep it beginner-friendly.</PromptExample>
                    </Step>
                    <Step n={2} title="Ask for a simple explanation">
                        <p>If a topic is new to you, ask for a plain-language overview before the details. You can always go deeper afterward.</p>
                        <PromptExample label="Example">Explain what "index funds" are as if I've never invested before, in under 150 words.</PromptExample>
                    </Step>
                    <Step n={3} title="Ask follow-up questions">
                        <p>Treat it like a conversation. Narrow down, ask for examples, or challenge the answer to see how well it holds up.</p>
                        <PromptExample label="Example">Now give me one real-world example, and explain the biggest risk a beginner should know about.</PromptExample>
                    </Step>
                    <Step n={4} title="Compare answers across sources">
                        <p>Open the linked sources and see whether they actually agree. When sources conflict, that's a signal to dig deeper rather than trust a single summary.</p>
                        <PromptExample label="Example">Do the sources you used agree on this? Point out any disagreements between them.</PromptExample>
                    </Step>
                    <Step n={5} title="Verify important information">
                        <p>Before you use any fact, statistic, or quote, confirm it directly in a trusted source. The written answer is a starting point, not evidence on its own.</p>
                    </Step>
                    <Step n={6} title="Turn findings into notes or an outline">
                        <p>Ask it to reshape what you've learned into notes or an outline you can build on. This makes research reusable instead of a one-off answer.</p>
                        <PromptExample label="Example">Summarize what we covered as a bullet-point outline I can use to write a short article.</PromptExample>
                    </Step>
                    <Step n={7} title="Save useful research prompts">
                        <p>When a question format works well, keep it as a reusable template with placeholders you can swap in next time.</p>
                        <PromptExample label="Template">Give me a beginner-friendly overview of [topic], the [3] most important points, and [2] common misconceptions. Keep it under [150] words.</PromptExample>
                    </Step>
                    <Step n={8} title="Protect private information">
                        <p>Never paste passwords, personal identifiers, client details, or confidential files into your questions. Keep research questions general and safe.</p>
                    </Step>
                </div>

                <h2>Example prompts for research</h2>
                <PromptExample label="Research">Give me an evidence-based overview of [topic], list the strongest arguments on each side, and note where experts disagree.</PromptExample>

                <h2>Example prompts for comparisons</h2>
                <PromptExample label="Compare">Compare [Option A] and [Option B] for a beginner. Use a short table with columns for ease of use, cost factors to consider, and best use case.</PromptExample>

                <h2>Example prompts for learning a topic</h2>
                <PromptExample label="Learn">Teach me [topic] in 3 steps, from basic to intermediate. After each step, give me one quick question to check I understood.</PromptExample>

                <h2>Good vs bad prompts</h2>
                <Callout tone="good" title="Good — specific and checkable">
                    <PromptExample>What are the main differences between HTTP and HTTPS for a non-technical website owner? Keep it under 120 words and include why it matters for security.</PromptExample>
                </Callout>
                <Callout tone="bad" title="Bad — vague">
                    <PromptExample>tell me about websites</PromptExample>
                </Callout>

                <h2>Common beginner mistakes</h2>
                <ul className="ait-list">
                    <li>Trusting the summary without opening a single source.</li>
                    <li>Asking questions so broad the answer can't be specific.</li>
                    <li>Assuming a linked source proves the claim — always read it.</li>
                    <li>Using it for high-stakes decisions without expert input.</li>
                    <li>Pasting private or confidential information into questions.</li>
                </ul>

                <h2>Privacy &amp; safety</h2>
                <SafetyNote />

                <h2>FAQ</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            <RelatedGuides />
            <BackToHubCta note="Perplexity shines for research — the AI research guide and prompt writing guide are the best next steps." />
        </div>
    );
}
