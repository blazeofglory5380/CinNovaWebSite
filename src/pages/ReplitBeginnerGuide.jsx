// ReplitBeginnerGuide — /guides/replit   CSS prefix: ait-
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import {
    TutorialHero, TutorialSEO, Step, Callout, PromptExample, FAQ, RelatedGuides, BackToHubCta, SafetyNote,
} from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "Do I need to install anything to use Replit?", a: "Replit runs in the browser, so you can start building without setting up tools on your computer. Features and availability change over time — check the latest official details." },
    { q: "Is Replit free?", a: "There are free ways to get started as well as paid options with more features. Availability and features change over time — check the latest official details before deciding." },
    { q: "Can Replit AI build a whole app for me?", a: "It can help scaffold and edit projects, but treating it as a magic app-builder leads to trouble. Build in small pieces, run and test each one, and understand what the code does before you rely on it." },
    { q: "Will the generated code always work?", a: "No. AI can produce code with bugs, missing pieces, or wrong assumptions. Always run it, test it, and read the explanations before trusting it." },
    { q: "Is it safe to store secrets in a project?", a: "Never hard-code passwords, API keys, or private data into your files. Use the platform's secrets/environment features and check the latest official settings for keeping credentials safe." },
];

export default function ReplitBeginnerGuide() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="How to Use Replit AI | Step-by-Step Beginner Guide"
                description="Learn how to use Replit AI as a beginner: start a small project, ask for a plan, build one feature at a time, run and test, use errors as context, and keep secrets safe. Includes example prompts and common mistakes."
                pageKey="replit-beginner-guide"
                siteUrl={siteUrl}
            />

            <TutorialHero
                eyebrow="REPLIT AI · BEGINNER"
                title="How to Use Replit AI: Step-by-Step Beginner Guide"
                intro="Replit is a browser-based coding environment with an AI assistant that can help you build, edit, and debug projects without setting up tools on your computer. This guide shows how to use it step by step — with example prompts, testing habits, and the mistakes beginners make most."
                level="Beginner"
                minutes={10}
            />

            <section className="section ait-guide-body">
                <h2>What is Replit?</h2>
                <p>
                    Replit is a coding environment that runs in your web browser. You can write and run code
                    without installing anything, which makes it a friendly place to start learning. Its AI
                    assistant can help generate code, explain what existing code does, and suggest fixes when
                    something breaks. CinNova is independent and not affiliated with Replit; this is a neutral
                    how-to guide.
                </p>

                <h2>What Replit AI can help with</h2>
                <ul className="ait-list">
                    <li>Starting a small project from a plain-language description.</li>
                    <li>Generating or editing one feature at a time.</li>
                    <li>Explaining code so you understand what you're building.</li>
                    <li>Debugging — using error messages to suggest likely fixes.</li>
                    <li>Learning by asking why something works the way it does.</li>
                </ul>

                <h2>What it's good at</h2>
                <p>
                    Removing setup friction, drafting a first version fast, and explaining code in plain
                    language while you learn. It's strongest for small, well-scoped projects where you run and
                    test each piece as you go.
                </p>

                <h2>What it's not reliable for</h2>
                <Callout tone="warn" title="Always check these yourself">
                    <ul className="ait-list">
                        <li>Correctness — generated code can look right and still be wrong.</li>
                        <li>Large or complex apps built in one giant step.</li>
                        <li>Security and handling of sensitive data.</li>
                        <li>Edge cases and business rules it can't know about.</li>
                        <li>Anything you haven't run and tested yourself.</li>
                    </ul>
                </Callout>

                <h2>Step-by-step</h2>
                <div className="ait-steps">
                    <Step n={1} title="Start with a small project idea">
                        <p>Pick something small and concrete for your first project. A tiny, finished project teaches more than a huge one you never complete.</p>
                        <PromptExample label="Example">I want to build a simple to-do list web page where I can add and remove tasks. I'm a beginner. What's a good, minimal way to start?</PromptExample>
                    </Step>
                    <Step n={2} title="Ask for a simple project plan">
                        <p>Before generating code, ask for the steps and the files involved. A short plan is easier to follow and review than a wall of code.</p>
                        <PromptExample label="Example">Outline the steps to build this, the files I'll need, and what each file does. Keep it beginner-friendly.</PromptExample>
                    </Step>
                    <Step n={3} title="Generate or edit one feature at a time">
                        <p>Build in small pieces — one feature, then run it, then the next. This keeps changes easy to understand and easy to undo.</p>
                        <PromptExample label="Example">Let's just add the "add a task" feature first. Show me the code and explain each part.</PromptExample>
                    </Step>
                    <Step n={4} title="Run and test the project">
                        <p>Run your project often and try it out yourself. Click the buttons, enter odd inputs, and confirm it does what you expect before moving on.</p>
                    </Step>
                    <Step n={5} title="Use errors as debugging context">
                        <p>When something breaks, copy the exact error message (remove anything private) and share it along with the relevant code. Ask for the likely cause and the smallest fix.</p>
                        <PromptExample label="Example">I got this error when I ran it: [paste error]. Here's the code it points to: [paste]. What's the likely cause and simplest fix?</PromptExample>
                    </Step>
                    <Step n={6} title="Ask for explanations">
                        <p>Don't just accept code — ask why it works. Understanding what you build is what turns it into a real skill.</p>
                        <PromptExample label="Example">Explain this function line by line as if I'm new to programming.</PromptExample>
                    </Step>
                    <Step n={7} title="Improve the project safely">
                        <p>Once the basics work, add improvements one at a time and test after each. Keep a working version so you can always go back if a change breaks something.</p>
                    </Step>
                    <Step n={8} title="Protect private data and secrets">
                        <p>Never hard-code passwords, API keys, or personal data into your files. Use the platform's secrets/environment features and check the latest official settings.</p>
                    </Step>
                </div>

                <h2>Example prompts for beginner projects</h2>
                <PromptExample label="Project">Help me build a simple [project idea] step by step. Start with the smallest working version, explain each part, and wait for me before adding the next feature.</PromptExample>

                <h2>Example prompts for debugging</h2>
                <PromptExample label="Debugging">My project isn't working. Here's what I expected, what actually happened, and the error: [paste]. What's the likely cause and the smallest change to fix it?</PromptExample>

                <h2>Example prompts for explaining code</h2>
                <PromptExample label="Explain">Explain what this code does in plain language, then point out one thing a beginner might get wrong about it: [paste].</PromptExample>

                <h2>Good vs bad prompts</h2>
                <Callout tone="good" title="Good — small and specific">
                    <PromptExample>Add a button that clears all tasks from my to-do list. Show only the code that changes, and explain what it does.</PromptExample>
                </Callout>
                <Callout tone="bad" title="Bad — vague and oversized">
                    <PromptExample>build me a full social media app</PromptExample>
                </Callout>

                <h2>Common beginner mistakes</h2>
                <ul className="ait-list">
                    <li>Trying to build too much at once instead of small steps.</li>
                    <li>Accepting code without running or understanding it.</li>
                    <li>Not keeping a working version before making changes.</li>
                    <li>Ignoring error messages instead of using them as clues.</li>
                    <li>Hard-coding passwords, keys, or private data into files.</li>
                </ul>

                <h2>Privacy &amp; safety</h2>
                <SafetyNote />

                <h2>FAQ</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            <RelatedGuides />
            <BackToHubCta note="Replit is a great place to practice — the AI coding guide and prompt writing guide are the best next steps." />
        </div>
    );
}
