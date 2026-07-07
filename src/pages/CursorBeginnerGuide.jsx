// CursorBeginnerGuide — /?page=cursor-beginner-guide   CSS prefix: ait-
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import {
    TutorialHero, TutorialSEO, Step, Callout, PromptExample, FAQ, RelatedGuides, BackToHubCta, SafetyNote,
} from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "Do I need to know how to code to use Cursor?", a: "It helps a lot. Cursor can write and change code for you, but you still need enough understanding to read the changes, run the project, and judge whether the result is correct. Beginners get the most value pairing it with a coding basics guide." },
    { q: "Is Cursor free?", a: "There are free ways to get started as well as paid options with more features. Availability and features change over time — check the latest official details before deciding." },
    { q: "Will the AI's code always work?", a: "No. It can produce code that looks right but has bugs, security issues, or wrong assumptions. Always run it, test it, and review it before you trust or ship it." },
    { q: "Can it break my project?", a: "It can make changes you didn't intend, especially across many files at once. Work in small steps, use version control, and review every change before committing." },
    { q: "Is it safe to paste my code into it?", a: "Treat any code you share as if it could be seen by the tool. Never paste secrets, API keys, passwords, or confidential data — use environment variables and check the latest official privacy settings." },
];

export default function CursorBeginnerGuide() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="How to Use Cursor | Step-by-Step Beginner Guide"
                description="Learn how to use Cursor, the AI code editor, as a beginner: describe your project, ask for a plan, work file by file, run and review changes, and keep secrets safe. Includes example prompts and common mistakes."
                pageKey="cursor-beginner-guide"
                siteUrl={siteUrl}
            />

            <TutorialHero
                eyebrow="CURSOR · BEGINNER"
                title="How to Use Cursor: Step-by-Step Beginner Guide"
                intro="Cursor is a code editor with a built-in AI assistant that can write, explain, and change code as you work. This guide shows how to use it safely and get useful results — with example prompts, review habits, and the mistakes beginners make most."
                level="Beginner"
                minutes={10}
            />

            <section className="section ait-guide-body">
                <h2>What is Cursor?</h2>
                <p>
                    Cursor is a code editor built around an AI assistant. On top of the normal editing you'd
                    expect, you can describe what you want in plain language and it will suggest or make code
                    changes, explain existing code, and help you track down errors. Think of it as a coding
                    assistant that sits inside your project — helpful, but only as good as the direction you
                    give it and the review you do afterward. CinNova is independent and not affiliated with
                    Cursor; this is a neutral how-to guide.
                </p>

                <h2>What it's commonly used for</h2>
                <ul className="ait-list">
                    <li>Writing small features or functions from a description.</li>
                    <li>Explaining unfamiliar code in a project you're reading.</li>
                    <li>Debugging — pasting an error and asking what's likely wrong.</li>
                    <li>Refactoring — cleaning up or restructuring existing code.</li>
                    <li>Learning — asking why a piece of code works the way it does.</li>
                </ul>

                <h2>What it's good at</h2>
                <p>
                    Speeding up repetitive coding, drafting a first version quickly, explaining code in plain
                    language, and suggesting fixes for common errors. It works best when you give it clear
                    context, work in small pieces, and stay in the driver's seat.
                </p>

                <h2>What it's not reliable for</h2>
                <Callout tone="warn" title="Always check these yourself">
                    <ul className="ait-list">
                        <li>Correctness — code can look right and still be wrong or insecure.</li>
                        <li>Big, cross-file changes made all at once without review.</li>
                        <li>Business logic and edge cases it can't know about.</li>
                        <li>Security-sensitive code — validate carefully before trusting it.</li>
                        <li>Anything you can't run and test to confirm it works.</li>
                    </ul>
                </Callout>

                <h2>Step-by-step</h2>
                <div className="ait-steps">
                    <Step n={1} title="Describe the project before asking for code">
                        <p>Give the assistant context: what you're building, the language or framework, and what already exists. Context up front leads to code that fits your project instead of generic snippets.</p>
                        <PromptExample label="Example">This is a small Node.js CLI that reads a CSV and prints a summary. I want to add a flag that filters rows by a column value. Here's the current main file: [paste].</PromptExample>
                    </Step>
                    <Step n={2} title="Ask for a plan first">
                        <p>Before it writes code, ask for the approach. Reviewing a short plan is faster than untangling a large change you didn't expect.</p>
                        <PromptExample label="Example">Before writing any code, outline the steps and which files you'd change. Wait for me to confirm.</PromptExample>
                    </Step>
                    <Step n={3} title="Work on one file or function at a time">
                        <p>Small, focused changes are easier to review and safer to accept. Avoid asking it to rewrite many files in a single step.</p>
                    </Step>
                    <Step n={4} title="Ask Cursor to explain changes">
                        <p>Have it explain what it changed and why. If the explanation doesn't make sense, don't accept the change yet.</p>
                        <PromptExample label="Example">Explain what you changed, why, and any risks or edge cases this might introduce.</PromptExample>
                    </Step>
                    <Step n={5} title="Run the code locally">
                        <p>Never assume it works. Run and test the change on your machine before moving on. Working code you've verified beats clever code you haven't.</p>
                    </Step>
                    <Step n={6} title="Copy errors back into the AI carefully">
                        <p>When something breaks, paste the exact error message and the relevant code — but strip out anything private first. Ask for the likely cause and the smallest fix.</p>
                        <PromptExample label="Example">I got this error when running the tests: [paste error]. Here's the function it points to: [paste]. What's the most likely cause and the smallest fix?</PromptExample>
                    </Step>
                    <Step n={7} title="Review changes before committing">
                        <p>Read the diff line by line before you commit. Use version control so you can always undo. You are responsible for what goes into the project, not the AI.</p>
                    </Step>
                    <Step n={8} title="Do not paste secrets or API keys">
                        <p>Keep passwords, API keys, tokens, and confidential data out of prompts and out of committed code. Use environment variables and check the latest official privacy settings.</p>
                    </Step>
                </div>

                <h2>Example prompts for coding</h2>
                <PromptExample label="Coding">Write a small, well-commented function in [language] that does [task]. Keep it simple, handle empty input, and explain how it works.</PromptExample>

                <h2>Example prompts for debugging</h2>
                <PromptExample label="Debugging">Here's an error and the code that caused it: [paste]. Explain the likely cause in plain language and suggest the smallest change that fixes it.</PromptExample>

                <h2>Example prompts for refactoring</h2>
                <PromptExample label="Refactoring">Refactor this function to be easier to read without changing its behavior. Keep the same inputs and outputs, and explain each change.</PromptExample>

                <h2>Good vs bad prompts</h2>
                <Callout tone="good" title="Good — scoped and reviewable">
                    <PromptExample>In this file only, add input validation to the createUser function so it rejects empty names and invalid emails. Don't change anything else. Explain what you changed.</PromptExample>
                </Callout>
                <Callout tone="bad" title="Bad — broad and risky">
                    <PromptExample>fix my whole app and make it better</PromptExample>
                </Callout>

                <h2>Common beginner mistakes</h2>
                <ul className="ait-list">
                    <li>Accepting changes without reading or running them.</li>
                    <li>Asking for huge, multi-file rewrites in one step.</li>
                    <li>Not using version control, so mistakes are hard to undo.</li>
                    <li>Trusting generated code for security-sensitive features.</li>
                    <li>Pasting secrets, keys, or confidential data into prompts.</li>
                </ul>

                <h2>Privacy &amp; safety</h2>
                <SafetyNote />

                <h2>FAQ</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            <RelatedGuides />
            <BackToHubCta note="Cursor is most useful once you can plan and review code — the AI coding guide and prompt writing guide are the best next steps." />
        </div>
    );
}
