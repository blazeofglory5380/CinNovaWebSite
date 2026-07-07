// AIPromptGuide — /?page=ai-prompt-writing-guide   CSS prefix: ait-
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import {
    TutorialHero, TutorialSEO, Step, Callout, PromptExample, FAQ, BackToHubCta, SafetyNote, PromptGuideLangNav,
} from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "Do I need a paid AI tool to practice prompting?", a: "No. The same prompting skills work across most assistants. Start with any tool you already have access to and focus on writing clearer instructions." },
    { q: "How long should a prompt be?", a: "As long as it needs to be to remove ambiguity — and no longer. A few clear sentences that state the role, task, context, and format usually beat both one-word prompts and giant walls of text." },
    { q: "Why did the AI ignore part of my prompt?", a: "Long or contradictory prompts can cause the model to drop details. Break big requests into steps, put the most important instruction first, and ask it to confirm the requirements back to you." },
    { q: "Is it okay to reuse the same prompt?", a: "Yes — reusable prompt templates are one of the biggest time-savers. Keep a personal library and swap in the specifics each time." },
];

export default function AIPromptGuide() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="How to Write Better AI Prompts | Beginner Step-by-Step Guide"
                description="Learn how to write better AI prompts using role, task, context, format, and constraints. Includes examples, mistakes to avoid, privacy tips, and a beginner-friendly prompt formula."
                pageKey="ai-prompt-writing-guide"
                siteUrl={siteUrl}
            />

            <TutorialHero
                eyebrow="PROMPT WRITING · BEGINNER"
                title="How to Write Better AI Prompts: Step-by-Step Beginner Guide"
                intro="A prompt is just the instruction you give an AI tool. Small changes to how you ask can turn a vague, unhelpful answer into exactly what you needed. This guide teaches a simple, repeatable formula with real before-and-after examples."
                level="Beginner"
                minutes={8}
            />

            <PromptGuideLangNav current="en" />

            <section className="section ait-guide-body">
                <h2>What is an AI prompt?</h2>
                <p>
                    An AI prompt is the text you type to tell an AI tool what you want. It can be a
                    question, a task, or a set of instructions. The AI reads your prompt and predicts a
                    helpful response — so the clearer and more specific your prompt, the better the result.
                </p>

                <h2>Why prompts matter</h2>
                <p>
                    AI tools don't know your goal, your audience, or your standards unless you tell them.
                    A weak prompt forces the AI to guess, and it often guesses wrong. A strong prompt
                    removes the guesswork: it states who the AI should act as, what to do, what context
                    to use, how to format the answer, and what limits to respect.
                </p>

                <h2>The basic prompt formula</h2>
                <div className="ait-formula">
                    <b>Role</b> + <b>Task</b> + <b>Context</b> + <b>Format</b> + <b>Constraints</b>
                </div>
                <p>
                    You won't always need all five, but keeping them in mind is the fastest way to write
                    a prompt that works on the first try. Here's how to apply each one.
                </p>

                <h2>Step-by-step</h2>
                <div className="ait-steps">
                    <Step n={1} title="Tell the AI what role to play">
                        <p>Give the AI a perspective so it uses the right tone and expertise. "Act as a patient math tutor" produces very different output than "act as a peer reviewer."</p>
                        <PromptExample label="Example">Act as a friendly career coach who explains things simply.</PromptExample>
                    </Step>
                    <Step n={2} title="Explain the task clearly">
                        <p>State exactly what you want done, using a strong action verb: summarize, rewrite, compare, outline, generate, critique. Avoid vague verbs like "help with."</p>
                        <PromptExample label="Example">Rewrite my resume summary so it highlights leadership and measurable results.</PromptExample>
                    </Step>
                    <Step n={3} title="Add context">
                        <p>Give the details the AI can't know: your audience, your goal, relevant facts, and any material to work from. Context is usually the difference between generic and useful.</p>
                        <PromptExample label="Example">Context: I'm a nurse with 6 years of experience applying for a charge-nurse role. Here is my current summary: [paste your own text].</PromptExample>
                    </Step>
                    <Step n={4} title="Choose the output format">
                        <p>Tell the AI how you want the answer: a bulleted list, a table, a short paragraph, JSON, an email, a step-by-step plan. Formatting up front saves rework.</p>
                        <PromptExample label="Example">Give me three versions as short paragraphs, each under 60 words.</PromptExample>
                    </Step>
                    <Step n={5} title="Add constraints">
                        <p>Set boundaries: length, tone, reading level, what to avoid, and what to include. Constraints keep the answer focused.</p>
                        <PromptExample label="Example">Keep it professional, avoid buzzwords, and don't invent job titles or dates I didn't provide.</PromptExample>
                    </Step>
                    <Step n={6} title="Ask for revisions">
                        <p>The first answer is a draft. Push it further with targeted follow-ups instead of starting over. Point at the specific part you want changed.</p>
                        <PromptExample label="Example">Version 2 is closest. Make it 20% shorter and lead with the strongest result.</PromptExample>
                    </Step>
                    <Step n={7} title="Save reusable prompts">
                        <p>When a prompt works well, save it as a template with placeholders. Next time, swap in the specifics and reuse the structure.</p>
                        <PromptExample label="Template">Act as [role]. [Task] for [audience]. Context: [details]. Format: [format]. Constraints: [limits].</PromptExample>
                    </Step>
                </div>

                <h2>Good prompt example</h2>
                <Callout tone="good" title="Clear, specific, and structured">
                    <PromptExample>Act as a copy editor. Rewrite the paragraph below for a general audience at an 8th-grade reading level. Keep it under 120 words, keep all facts unchanged, and return only the edited paragraph. Paragraph: [paste text].</PromptExample>
                </Callout>

                <h2>Bad prompt example</h2>
                <Callout tone="bad" title="Vague — the AI has to guess">
                    <PromptExample>make this better</PromptExample>
                    <p>No role, no audience, no format, no length, and no text attached. Expect a generic response.</p>
                </Callout>

                <h2>Before &amp; after</h2>
                <Callout tone="bad" title="Before">
                    <PromptExample>write about climate change</PromptExample>
                </Callout>
                <Callout tone="good" title="After">
                    <PromptExample>Act as a science communicator. Write a 150-word explainer on why cities feel hotter than nearby rural areas, for curious teenagers. Use one everyday analogy, avoid jargon, and end with one practical tip.</PromptExample>
                </Callout>

                <h2>Common beginner mistakes</h2>
                <ul className="ait-list">
                    <li>Being too vague — no role, audience, or format.</li>
                    <li>Asking for everything in one giant prompt instead of steps.</li>
                    <li>Not giving the source text or data the AI needs to work from.</li>
                    <li>Accepting the first answer without asking for a revision.</li>
                    <li>Trusting the output without checking facts.</li>
                </ul>

                <h2>Privacy &amp; safety</h2>
                <SafetyNote />

                <h2>FAQ</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            <BackToHubCta note="Next, learn how to use AI for research and coding — both build directly on strong prompting." />
        </div>
    );
}
