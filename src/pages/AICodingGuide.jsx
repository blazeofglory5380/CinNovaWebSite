// AICodingGuide — /?page=ai-coding-guide   CSS prefix: ait-
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import {
    TutorialHero, TutorialSEO, Step, Callout, PromptExample, FAQ, BackToHubCta, SafetyNote,
} from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "Do I need to know how to code to use an AI coding assistant?", a: "It helps a lot. AI can write code you don't understand, but you still have to run it, test it, and judge whether it's correct and safe. Start small and ask the AI to explain every piece." },
    { q: "Will AI write my whole app for me?", a: "It can generate large chunks, but bigger requests are more likely to contain bugs or subtle mistakes. Working one function or file at a time keeps the output reviewable and easier to fix." },
    { q: "Is AI-generated code always secure?", a: "No. Assistants can produce code with security flaws or outdated practices. Review anything that touches authentication, payments, user data, or the network especially carefully." },
    { q: "Can I trust the AI's explanation of the code?", a: "Usually helpful, but not guaranteed. If an explanation and the code disagree, trust what actually happens when you run it, and verify against official documentation." },
];

export default function AICodingGuide() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="How to Use AI for Coding | Step-by-Step Beginner Guide"
                description="Learn how to use AI coding assistants to plan projects, write small functions, debug errors, explain code, and review safely before committing."
                pageKey="ai-coding-guide"
                siteUrl={siteUrl}
            />

            <TutorialHero
                eyebrow="AI CODING · BEGINNER"
                title="How to Use AI for Coding: Step-by-Step Beginner Guide"
                intro="AI coding assistants can plan projects, write functions, and explain errors — turning hours of searching into minutes. But they also make confident mistakes. This guide shows a safe, reviewable workflow."
                level="Beginner"
                minutes={9}
            />

            <section className="section ait-guide-body">
                <h2>What AI coding assistants can help with</h2>
                <ul className="ait-list">
                    <li>Explaining unfamiliar code, errors, and concepts.</li>
                    <li>Drafting small functions or single files from a description.</li>
                    <li>Suggesting fixes when you paste in an error message.</li>
                    <li>Refactoring code to be clearer or safer.</li>
                    <li>Writing tests and example usage.</li>
                </ul>

                <h2>What they cannot guarantee</h2>
                <Callout tone="warn" title="You are still the engineer">
                    <ul className="ait-list">
                        <li>That the code is correct — it may look right and still be wrong.</li>
                        <li>That it's secure or up to date with current best practices.</li>
                        <li>That it fits your exact versions, environment, or requirements.</li>
                        <li>That it won't quietly break something else in your project.</li>
                    </ul>
                </Callout>

                <h2>Step-by-step</h2>
                <div className="ait-steps">
                    <Step n={1} title="Describe your project">
                        <p>Give the assistant the big picture: what you're building, the language and tools, and the goal. Context up front prevents mismatched suggestions.</p>
                        <PromptExample label="Example">I'm building a small web page with plain HTML, CSS, and JavaScript that shows a to-do list saved in the browser. No frameworks.</PromptExample>
                    </Step>
                    <Step n={2} title="Ask for a simple plan first">
                        <p>Before any code, get a short plan. It's easier to correct a plan than to untangle bad code.</p>
                        <PromptExample label="Example">Give me a simple, numbered plan for building this. Don't write code yet.</PromptExample>
                    </Step>
                    <Step n={3} title="Ask for one file or one function at a time">
                        <p>Small, focused requests produce code you can actually read and test. Build up piece by piece.</p>
                        <PromptExample label="Example">Write just the function that saves a to-do item to local storage. Keep it small and add comments.</PromptExample>
                    </Step>
                    <Step n={4} title="Ask the AI to explain the code">
                        <p>Never paste in code you don't understand. Ask for a line-by-line explanation and what could go wrong.</p>
                        <PromptExample label="Example">Explain this function line by line, and list any edge cases it doesn't handle.</PromptExample>
                    </Step>
                    <Step n={5} title="Run the code locally">
                        <p>Actually run it in your own environment. The real test is behavior, not the AI's description. Try normal and unusual inputs.</p>
                    </Step>
                    <Step n={6} title="Copy errors back into the AI">
                        <p>When something breaks, paste the full error message and the relevant code. Specific errors get specific fixes.</p>
                        <PromptExample label="Example">I got this error when running the code: [paste full error]. Here is the function: [paste]. What's wrong and how do I fix it?</PromptExample>
                    </Step>
                    <Step n={7} title="Ask for safer / refactored code">
                        <p>Once it works, ask the assistant to improve it — clearer names, error handling, and safer patterns.</p>
                        <PromptExample label="Example">Refactor this for readability, add basic error handling, and point out any security concerns.</PromptExample>
                    </Step>
                    <Step n={8} title="Review before committing">
                        <p>You are responsible for what you ship. Read every change, run your tests, and make sure you understand it before committing.</p>
                        <Callout tone="info" title="Quick review checklist">
                            <ul className="ait-list">
                                <li>Do I understand what this code does?</li>
                                <li>Did I run it and test edge cases?</li>
                                <li>Does it touch secrets, user data, or the network safely?</li>
                                <li>Does it break anything else?</li>
                            </ul>
                        </Callout>
                    </Step>
                </div>

                <h2>Example coding prompts</h2>
                <PromptExample label="Build">Write a small, well-commented JavaScript function that validates an email address. Keep it simple and explain the approach.</PromptExample>
                <PromptExample label="Understand">What does this regular expression do, and where might it fail? [paste]</PromptExample>

                <h2>Debugging prompt examples</h2>
                <PromptExample label="Debug">This function should return sorted numbers but returns them as strings. Here's the code and a sample input/output: [paste]. Why, and how do I fix it?</PromptExample>
                <PromptExample label="Debug">My page loads but the button does nothing. Here is the HTML and JS: [paste]. Walk me through what to check first.</PromptExample>

                <h2>Beginner mistakes to avoid</h2>
                <ul className="ait-list">
                    <li>Pasting large amounts of AI code without reading or running it.</li>
                    <li>Asking for an entire app in one prompt instead of small pieces.</li>
                    <li>Assuming the code is secure or matches your library versions.</li>
                    <li>Skipping local testing because "it looks right."</li>
                    <li>Committing changes you don't understand.</li>
                </ul>

                <h2>Safety note</h2>
                <Callout tone="bad" title="Never paste secrets">
                    <p>Do not paste API keys, passwords, tokens, private keys, customer data, or proprietary code into an AI tool. Replace secrets with placeholders like <code>YOUR_API_KEY</code> before sharing code, and rotate any secret you may have exposed.</p>
                </Callout>
                <SafetyNote />

                <h2>FAQ</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            <BackToHubCta note="Prompting and research skills make AI coding easier — revisit those guides anytime on the hub." />
        </div>
    );
}
