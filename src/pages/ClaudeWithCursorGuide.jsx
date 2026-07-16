// ClaudeWithCursorGuide — /guides/claude-with-cursor   CSS prefix: ait-
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import {
    TutorialHero, TutorialSEO, Step, Callout, PromptExample, FAQ, RelatedGuides, BackToHubCta, SafetyNote,
} from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "Does Claude integrate with Cursor?", a: "This guide is about using Claude alongside Cursor, not an official integration. You plan and reason through the work with Claude, then make code changes in Cursor. CinNova is independent and not affiliated with Anthropic or Cursor." },
    { q: "Why use both Claude and Cursor?", a: "They play different roles: Claude is a strong planning and reasoning partner for breaking down features and reviewing risk, while Cursor is an editor with a built-in assistant for making changes inside your project. Using them alongside each other keeps planning and editing clear." },
    { q: "Will the code always be correct?", a: "No. Neither tool can guarantee correct, secure code. Always run it, test it, and review every change before committing — see the AI coding guide for safe habits." },
    { q: "Do I still need to understand the code?", a: "Yes. You're responsible for what ships. Read the changes, run the project, and don't accept anything you can't follow or verify." },
];

export default function ClaudeWithCursorGuide() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="How to Use Claude with Cursor | Coding Workflow Guide"
                description="Learn how to use Claude alongside Cursor to plan features, break work into small tasks, write prompts for the editor, run and debug code, review risk, and check changes before committing. Includes example prompts and safety tips."
                pageKey="claude-with-cursor-guide"
                siteUrl={siteUrl}
            />

            <TutorialHero
                eyebrow="CLAUDE WORKFLOW · CODING"
                title="How to Use Claude with Cursor: Coding Workflow Guide"
                intro="This guide shows how to use Claude alongside Cursor — Claude to plan features, break down tasks, and review risk, and Cursor to make the actual code changes. You stay in control, running and reviewing everything before it ships."
                level="Workflow"
                minutes={11}
            />

            <section className="section ait-guide-body">
                <h2>What this workflow is for</h2>
                <p>
                    Claude and Cursor do different jobs well. Use Claude alongside Cursor — not as an
                    integration — to think through a feature, break it into safe steps, and review risk, while
                    Cursor helps you make the changes inside your project. The combination keeps planning and
                    editing separate and clear. CinNova is independent and not affiliated with Anthropic or
                    Cursor; this is a neutral how-to guide.
                </p>

                <h2>How Claude can help before coding</h2>
                <ul className="ait-list">
                    <li>Turning a feature idea into a clear plan and small tasks.</li>
                    <li>Writing precise prompts you can give to Cursor.</li>
                    <li>Explaining unfamiliar concepts before you touch the code.</li>
                    <li>Reviewing risk, edge cases, and potential security issues.</li>
                </ul>

                <h2>How Cursor can help while editing code</h2>
                <ul className="ait-list">
                    <li>Making focused code changes inside your project files.</li>
                    <li>Explaining existing code as you read it.</li>
                    <li>Suggesting fixes when you paste an error.</li>
                    <li>Speeding up repetitive edits one file at a time.</li>
                </ul>

                <h2>What Claude and Cursor cannot guarantee</h2>
                <Callout tone="warn" title="You verify; the tools assist">
                    <ul className="ait-list">
                        <li>Correctness — code can look right and still be wrong or insecure.</li>
                        <li>Awareness of your full codebase, business rules, and edge cases.</li>
                        <li>Safe handling of secrets — that's on you to manage.</li>
                        <li>Anything you haven't run, tested, and reviewed yourself.</li>
                    </ul>
                </Callout>

                <h2>Step-by-step</h2>
                <div className="ait-steps">
                    <Step n={1} title="Ask Claude to plan the feature">
                        <p>Describe what you want to build and ask for an approach before any code. Reviewing a short plan beats untangling a big change later.</p>
                        <PromptExample label="Example">I want to add email validation to a signup form in a React app. Outline the approach and the files likely involved before we write any code.</PromptExample>
                    </Step>
                    <Step n={2} title="Break the work into small tasks">
                        <p>Have Claude split the feature into small, reviewable steps you can do one at a time.</p>
                        <PromptExample label="Example">Break this into small tasks I can do and test one at a time, in a sensible order.</PromptExample>
                    </Step>
                    <Step n={3} title="Use Claude to create prompts for Cursor">
                        <p>Ask Claude to write a precise, scoped prompt for a single task that you'll give to Cursor.</p>
                        <PromptExample label="Example">Write a clear, scoped instruction I can give my code editor to implement just task 1, including what not to change.</PromptExample>
                    </Step>
                    <Step n={4} title="Work one file or function at a time">
                        <p>In Cursor, apply the change to a single file or function. Small changes are easy to review and safe to accept.</p>
                    </Step>
                    <Step n={5} title="Run the code locally">
                        <p>Never assume it works. Run and test each change on your machine before moving on.</p>
                    </Step>
                    <Step n={6} title="Bring errors back for debugging help">
                        <p>When something breaks, paste the exact error and the relevant code (strip anything private) and ask for the likely cause and smallest fix.</p>
                        <PromptExample label="Example">I got this error after the change: [paste error]. Here's the function: [paste]. What's the likely cause and the smallest fix?</PromptExample>
                    </Step>
                    <Step n={7} title="Ask Claude to review risk and edge cases">
                        <p>Before committing, have Claude review the change for edge cases, security concerns, and anything it would test.</p>
                        <PromptExample label="Example">Review this change for edge cases and security risks. What would you test before shipping it?</PromptExample>
                    </Step>
                    <Step n={8} title="Review before committing">
                        <p>Read the diff line by line, run your tests, and use version control so you can undo. You are responsible for what goes into the project.</p>
                    </Step>
                </div>

                <h2>Example prompts for feature planning</h2>
                <PromptExample label="Feature planning">Help me plan [feature] in [stack]. Give me the approach, the files involved, small ordered tasks, and what to test after each.</PromptExample>

                <h2>Example prompts for debugging</h2>
                <PromptExample label="Debugging">Here's an error and the code that caused it: [paste]. Explain the likely cause in plain language and the smallest change to fix it.</PromptExample>

                <h2>Example prompts for refactoring</h2>
                <PromptExample label="Refactoring">Suggest how to refactor this function for readability without changing its behavior. Keep inputs and outputs the same and explain each change.</PromptExample>

                <h2>Example prompts for code review</h2>
                <PromptExample label="Code review">Review this change like a careful senior engineer: correctness, edge cases, security, and tests I should add. Be specific.</PromptExample>

                <h2>Good vs bad prompts</h2>
                <Callout tone="good" title="Good — scoped and reviewable">
                    <PromptExample>Plan just the email-validation task: which file, what to add, edge cases (empty, invalid, very long), and the tests to write. Don't touch anything else.</PromptExample>
                </Callout>
                <Callout tone="bad" title="Bad — broad and risky">
                    <PromptExample>rewrite my whole app and make it better</PromptExample>
                </Callout>

                <h2>Common mistakes</h2>
                <ul className="ait-list">
                    <li>Skipping the plan and asking for large, multi-file changes at once.</li>
                    <li>Accepting changes without running or reading them.</li>
                    <li>Not using version control, so mistakes are hard to undo.</li>
                    <li>Trusting generated code for security-sensitive features.</li>
                    <li>Ignoring edge cases and tests before committing.</li>
                </ul>

                <h2>Safety note</h2>
                <Callout tone="warn" title="Never share secrets">
                    <ul className="ait-list">
                        <li>Do not paste passwords, API keys, tokens, or private repo credentials into prompts.</li>
                        <li>Use environment variables and keep secrets out of committed code.</li>
                        <li>Strip private data from errors and snippets before sharing them.</li>
                        <li>Check the latest official privacy settings for the tools you use.</li>
                    </ul>
                </Callout>

                <h2>Privacy &amp; safety</h2>
                <SafetyNote />

                <h2>FAQ</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            <RelatedGuides />
            <BackToHubCta note="Safe, reviewable coding is the core skill here — the AI coding guide and prompt writing guide are great next steps." />
        </div>
    );
}
