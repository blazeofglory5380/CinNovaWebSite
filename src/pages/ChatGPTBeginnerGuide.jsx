// ChatGPTBeginnerGuide — /?page=chatgpt-beginner-guide   CSS prefix: ait-
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import {
    TutorialHero, TutorialSEO, Step, Callout, PromptExample, FAQ, RelatedGuides, BackToHubCta, SafetyNote,
} from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "Do I need to pay to use ChatGPT?", a: "There are free ways to get started as well as paid options with more features. Availability and features change over time — check the latest official details before deciding." },
    { q: "Is ChatGPT always correct?", a: "No. It can produce confident answers that are wrong, outdated, or made up, including fake sources. Verify anything important in a trusted place before you rely on it." },
    { q: "Can ChatGPT access the internet or my files?", a: "It depends on the version and features you're using. Don't assume it can see live data or your documents unless a feature clearly says so — and never paste anything confidential." },
    { q: "Will it remember my past chats?", a: "Memory and history behavior vary by product and settings. Check the latest official settings if you want to control what is saved." },
];

export default function ChatGPTBeginnerGuide() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="How to Use ChatGPT | Step-by-Step Beginner Guide"
                description="Learn how to use ChatGPT for writing, research, planning, brainstorming, coding help, and productivity with beginner-friendly steps, example prompts, safety tips, and common mistakes to avoid."
                pageKey="chatgpt-beginner-guide"
                siteUrl={siteUrl}
            />

            <TutorialHero
                eyebrow="CHATGPT · BEGINNER"
                title="How to Use ChatGPT: Step-by-Step Beginner Guide"
                intro="ChatGPT is a conversational AI assistant you can use for writing, studying, planning, and coding help. This guide shows how to get genuinely useful results — with example prompts, safety tips, and the mistakes beginners make most."
                level="Beginner"
                minutes={9}
            />

            <section className="section ait-guide-body">
                <h2>What is ChatGPT?</h2>
                <p>
                    ChatGPT is an AI chat assistant made by OpenAI. You type a message (a "prompt") and it
                    replies in natural language. It's a general-purpose tool: the same chat box can help you
                    draft an email, explain a concept, brainstorm ideas, or debug a small piece of code.
                    CinNova is independent and not affiliated with OpenAI; this is a neutral how-to guide.
                </p>

                <h2>What it's commonly used for</h2>
                <ul className="ait-list">
                    <li>Writing and editing — emails, posts, summaries, and drafts.</li>
                    <li>Studying — explaining topics and quizzing you.</li>
                    <li>Planning — outlines, checklists, and step-by-step plans.</li>
                    <li>Brainstorming — names, ideas, and angles.</li>
                    <li>Coding help — small functions, explanations, and error fixes.</li>
                </ul>

                <h2>What it's good at</h2>
                <p>Explaining things simply, rephrasing and structuring text, generating lots of options quickly, and adapting tone. It shines when you give it clear instructions and something to work from.</p>

                <h2>What it's not reliable for</h2>
                <Callout tone="warn" title="Always verify these">
                    <ul className="ait-list">
                        <li>Specific facts, statistics, dates, and quotes.</li>
                        <li>Sources, citations, and links — these can be invented.</li>
                        <li>Recent events, unless a connected feature clearly provides current data.</li>
                        <li>High-stakes advice: medical, legal, financial, or safety decisions.</li>
                    </ul>
                </Callout>

                <h2>Step-by-step</h2>
                <div className="ait-steps">
                    <Step n={1} title="Start with a clear goal">
                        <p>Know what you want before you type. "Help me write a 3-sentence thank-you email to a client" beats "write something nice."</p>
                    </Step>
                    <Step n={2} title="Give context">
                        <p>Tell it who it's for, your goal, and any details it can't know. Paste the material you want it to work from (never anything private).</p>
                        <PromptExample label="Example">I'm a freelance designer. Draft a friendly follow-up email to a client who hasn't replied in a week. Keep it under 80 words.</PromptExample>
                    </Step>
                    <Step n={3} title="Ask one task at a time">
                        <p>Small, focused requests get better answers than a giant list. Handle steps in sequence.</p>
                    </Step>
                    <Step n={4} title="Request a specific format">
                        <p>Ask for a bulleted list, a table, a short paragraph, or an email. Formatting up front saves rework.</p>
                        <PromptExample label="Example">Give me the answer as 5 bullet points, each under 12 words.</PromptExample>
                    </Step>
                    <Step n={5} title="Ask follow-up questions">
                        <p>Treat it like a conversation. Ask it to go deeper, simplify, or explain its reasoning.</p>
                        <PromptExample label="Example">Explain point 3 in simpler terms with an everyday example.</PromptExample>
                    </Step>
                    <Step n={6} title="Ask for revisions">
                        <p>The first reply is a draft. Point at the exact part you want changed instead of starting over.</p>
                        <PromptExample label="Example">Make it warmer and 20% shorter, and keep the last sentence.</PromptExample>
                    </Step>
                    <Step n={7} title="Verify important information">
                        <p>Before you use any fact, number, or citation, confirm it in a trusted source. Treat the output as a starting point, not the final word.</p>
                    </Step>
                    <Step n={8} title="Save useful prompt patterns">
                        <p>When a prompt works well, keep it as a reusable template with placeholders you can swap in next time.</p>
                        <PromptExample label="Template">Act as [role]. [Task] for [audience]. Context: [details]. Format: [format]. Keep it [length/tone].</PromptExample>
                    </Step>
                </div>

                <h2>Example prompts for writing</h2>
                <PromptExample label="Writing">Rewrite this paragraph to sound clear and professional, keep all facts, and return only the edited version: [paste].</PromptExample>

                <h2>Example prompts for studying / research</h2>
                <PromptExample label="Study">Explain [topic] like I'm new to it, then give me 3 quiz questions with answers hidden below.</PromptExample>

                <h2>Example prompts for coding help</h2>
                <PromptExample label="Coding">Write a small, well-commented function that does [task] in [language]. Then explain how it works and list edge cases it doesn't handle.</PromptExample>

                <h2>Good vs bad prompts</h2>
                <Callout tone="good" title="Good — specific and structured">
                    <PromptExample>Act as a study coach. Create a 5-day plan to learn the basics of budgeting, 20 minutes a day, as a simple checklist.</PromptExample>
                </Callout>
                <Callout tone="bad" title="Bad — vague">
                    <PromptExample>teach me money</PromptExample>
                </Callout>

                <h2>Common beginner mistakes</h2>
                <ul className="ait-list">
                    <li>Being too vague and expecting it to read your mind.</li>
                    <li>Cramming many tasks into one prompt.</li>
                    <li>Trusting facts and sources without checking them.</li>
                    <li>Accepting the first draft instead of asking for revisions.</li>
                    <li>Pasting private or confidential information.</li>
                </ul>

                <h2>Privacy &amp; safety</h2>
                <SafetyNote />

                <h2>FAQ</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            <RelatedGuides />
            <BackToHubCta note="Strong prompting makes ChatGPT far more useful — the prompt writing guide is the best next step." />
        </div>
    );
}
