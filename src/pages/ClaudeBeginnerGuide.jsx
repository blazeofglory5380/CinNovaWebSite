// ClaudeBeginnerGuide — /guides/claude   CSS prefix: ait-
// Beginner-first, screen-aware tutorial matching the AI Workspace Setup master
// template. Vendor-neutral; CinNova is independent of Anthropic. Interfaces
// change, so steps describe common places rather than exact, version-specific UI.
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import {
    TutorialHero,
    TutorialSEO,
    Step,
    Callout,
    PromptExample,
    StepDetail,
    ScreenshotPlaceholder,
    FAQ,
    RelatedGuides,
    BackToHubCta,
    SafetyNote,
} from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "What makes Claude different from other AI assistants?", a: "People often reach for Claude for longer documents, careful summarizing, and writing and editing tasks. In practice, the same clear-prompting habits work across all assistants — pick whichever tool fits your task and access." },
    { q: "Do I need to pay to use Claude?", a: "There are free ways to get started as well as paid options with more features. Availability changes over time — check the latest official details before deciding. You can learn all the basics here without paying." },
    { q: "Can I trust Claude's summaries?", a: "Summaries of text you provide are usually solid, but still skim the original for anything important. For facts, numbers, or claims, verify against the source before you rely on them." },
    { q: "Can I paste long documents into Claude?", a: "Often yes — Claude is popular for longer text. Only paste documents that contain nothing private or confidential, remove names and sensitive details first, and check the latest official settings on data handling." },
    { q: "Does Claude know current events?", a: "Don't assume it has live, up-to-date information unless a feature clearly says so. Verify anything time-sensitive yourself." },
    { q: "What should I never paste into Claude?", a: "Passwords, API keys, secret tokens, and private client, medical, legal, or financial records. When in doubt, leave it out or replace real details with placeholders." },
    { q: "What should I learn after this guide?", a: "Prompt writing. Clear prompts make every answer better. The CinNova prompt writing and AI workspace guides are the recommended next steps." },
];

export default function ClaudeBeginnerGuide() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="How to Use Claude | Step-by-Step Beginner Guide"
                description="Learn how to use Claude for writing, summarizing, planning, studying, coding help, long documents, project work, and careful revisions with beginner-friendly screen-aware steps, prompt examples, safety tips, and common mistakes to avoid."
                pageKey="claude-beginner-guide"
                siteUrl={siteUrl}
            />

            <TutorialHero
                eyebrow="CLAUDE · BEGINNER"
                title="How to Use Claude: Step-by-Step Beginner Guide"
                intro="Claude is an AI chat assistant you can use for writing, summarizing, planning, studying, and working with longer documents. This click-by-click guide takes you from your first message to real summaries, drafts, and plans — with example prompts, safety tips, and the mistakes beginners make most."
                level="Beginner"
                minutes={12}
            />

            <section className="section ait-guide-body">
                {/* 1. What is Claude */}
                <h2>What is Claude?</h2>
                <p>
                    Claude is an AI chat assistant made by Anthropic. You type a message, called a{" "}
                    <strong>prompt</strong>, and Claude replies in natural language. People often use Claude for
                    writing, summarizing, planning, studying, long documents, careful revisions, and coding
                    explanations — all from the same chat box.
                </p>
                <p className="ait-note-line">
                    Interfaces change often, so this guide describes common places to look rather than exact
                    buttons — always check the current official screens and settings. CinNova is independent and
                    not affiliated with Anthropic; this is a neutral how-to guide.
                </p>

                {/* 2. What you need before starting */}
                <h2>What you need before starting</h2>
                <Callout tone="info" title="Before you start (2 minutes)">
                    <ul className="ait-list">
                        <li>A device with an internet connection.</li>
                        <li>A Claude / Anthropic account, if the current interface asks you to sign in.</li>
                        <li>One simple task to practice with (like summarizing or rewriting).</li>
                        <li>A short piece of text you are allowed to use.</li>
                        <li>A place to save good prompts (a notes app or document).</li>
                        <li>No private or confidential information.</li>
                    </ul>
                </Callout>

                {/* 3. What Claude is good for */}
                <h2>What Claude is good for</h2>
                <ul className="ait-list">
                    <li>Writing and editing — emails, posts, and drafts.</li>
                    <li>Summarizing text you provide.</li>
                    <li>Long project planning.</li>
                    <li>Explaining difficult topics simply.</li>
                    <li>Comparing options side by side.</li>
                    <li>Creating outlines.</li>
                    <li>Reviewing drafts.</li>
                    <li>Coding explanations — what code does and why.</li>
                    <li>Turning messy notes into organized output.</li>
                </ul>

                {/* 4. What Claude is not reliable for */}
                <h2>What Claude is not reliable for</h2>
                <Callout tone="warn" title="Always verify these">
                    <ul className="ait-list">
                        <li>Unverified facts, statistics, dates, and quotes.</li>
                        <li>Citations and links — these can be invented, so check them.</li>
                        <li>Current events, unless a live/current feature is clearly available.</li>
                        <li>Medical, legal, or financial decisions.</li>
                        <li>Private data handling — treat anything you paste as if it could be stored.</li>
                        <li>Replacing human judgment — you make the final call.</li>
                        <li>Assuming it knows what you meant without context.</li>
                    </ul>
                </Callout>

                {/* 5. Step-by-step beginner setup */}
                <h2>Step-by-step beginner setup</h2>
                <div className="ait-steps">
                    <Step n={1} title="Open Claude">
                        <StepDetail label="Where to look">Open your browser and go to Claude, or open the Claude app if you use it.</StepDetail>
                        <StepDetail label="What to click">Look for "Log in", "Sign up", "Continue", or the main chat entry screen. These are usually near the center or the top-right area.</StepDetail>
                        <StepDetail label="What you should see">A chat screen with a message box where you can type.</StepDetail>
                        <StepDetail label="If you don't see it">Look for an account/profile menu, a sidebar menu, or a button that starts a new chat.</StepDetail>
                        <StepDetail label="Common mistake">Trying to use advanced project/document features before sending one simple first message.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Claude login or main chat screen]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={2} title="Start a new chat">
                        <StepDetail label="Where to look">Look near the left sidebar, the top-left area, or the top of the chat area.</StepDetail>
                        <StepDetail label="What to click">Click "New chat", "New conversation", a plus (+) icon, or the button that starts a blank chat.</StepDetail>
                        <StepDetail label="What you should see">A blank conversation with an empty text box.</StepDetail>
                        <StepDetail label="If you don't see it">Open the menu/sidebar first (often a three-line icon), especially on smaller screens.</StepDetail>
                        <StepDetail label="Common mistake">Using an old chat for a new task and mixing unrelated topics together.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: New chat button and blank conversation]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={3} title="Send your first simple prompt">
                        <StepDetail label="Where to look">The message box at the bottom or center of the chat.</StepDetail>
                        <StepDetail label="What to type">Paste the prompt below, then press Enter or the Send button (often a paper-plane or arrow icon).</StepDetail>
                        <PromptExample label="Try this">Explain what Claude can help me do in 5 beginner-friendly bullet points.</PromptExample>
                        <StepDetail label="What you should see">After you send it, a reply appears in the conversation within a few seconds, usually written out as you watch.</StepDetail>
                        <StepDetail label="If you don't see it">Check your internet connection, and make sure you pressed Enter or clicked Send rather than just typing.</StepDetail>
                        <StepDetail label="Common mistake">Expecting a perfect answer from one line. The first reply is a starting point you can improve.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: First prompt and reply]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={4} title="Give Claude a clear goal">
                        <StepDetail label="Why">Claude performs better when it knows the goal, not just the task. Say what you're trying to achieve.</StepDetail>
                        <StepDetail label="What to type">Tell Claude the outcome you want.</StepDetail>
                        <PromptExample label="Try this">I want help turning messy notes into a clear summary for a beginner audience.</PromptExample>
                        <StepDetail label="What you should see">A reply aimed at your goal — simple, organized, and beginner-friendly.</StepDetail>
                        <StepDetail label="Common mistake">Describing the task but not the goal, then getting an answer that misses the point.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Goal-focused prompt]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={5} title="Add the text or context Claude should use">
                        <StepDetail label="Why">Give Claude the material to work from and tell it not to invent anything.</StepDetail>
                        <StepDetail label="What to type">Paste your text and set clear rules (never paste private text).</StepDetail>
                        <PromptExample label="Try this">Use only the notes I provide. Do not add facts. Turn them into 5 clear bullet points: [paste notes].</PromptExample>
                        <StepDetail label="What you should see">Bullet points built only from your notes, without extra claims.</StepDetail>
                        <StepDetail label="Common mistake">Pasting private or confidential text. Remove names and sensitive details first, or use sample text.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Prompt with pasted notes]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={6} title="Ask for a specific format">
                        <StepDetail label="Why">Telling Claude the shape of the answer up front saves rework.</StepDetail>
                        <StepDetail label="What to type">Add one of these format requests to your prompt.</StepDetail>
                        <PromptExample label="Checklist">Return this as a checklist.</PromptExample>
                        <PromptExample label="Table">Return this as a table with two columns.</PromptExample>
                        <PromptExample label="Paragraph">Return this as a short paragraph under 100 words.</PromptExample>
                        <PromptExample label="Headings">Return this as headings and bullet points.</PromptExample>
                        <StepDetail label="What you should see">The same content reshaped into the exact format you asked for.</StepDetail>
                        <StepDetail label="Common mistake">Accepting a long block of text when a table or checklist would be easier to use.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Same answer in different formats]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={7} title="Use Claude for summarizing">
                        <StepDetail label="What to type">Paste text you're allowed to use and ask for a structured summary.</StepDetail>
                        <PromptExample label="Try this">Summarize the text below into 3 main ideas, 3 action items, and 1 sentence explaining why it matters. Text: [paste].</PromptExample>
                        <StepDetail label="What you should see">A tidy summary split into the three parts you asked for.</StepDetail>
                        <StepDetail label="If you don't see it">If it drifts, add: "Use only the text I pasted and keep each item to one line."</StepDetail>
                        <StepDetail label="Common mistake">Asking for a summary without pasting any text, so Claude has nothing to summarize.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Structured summary]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={8} title="Use Claude for writing and editing">
                        <StepDetail label="What to type">Paste a draft and ask for a clear, faithful rewrite.</StepDetail>
                        <PromptExample label="Try this">Rewrite this to sound clear, warm, and professional. Keep the meaning the same and do not add new facts: [paste].</PromptExample>
                        <StepDetail label="What you should see">A cleaner version that keeps your meaning and adds nothing new.</StepDetail>
                        <StepDetail label="Common mistake">Letting it "improve" the text so much that it changes your meaning. Ask it to keep facts intact.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Rewritten draft]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={9} title="Use Claude for planning a project">
                        <StepDetail label="What to type">Turn a goal into a small, day-by-day plan.</StepDetail>
                        <PromptExample label="Try this">Turn this goal into a simple 7-day plan with one small task per day, beginner-friendly instructions, and a final checklist. Goal: [goal].</PromptExample>
                        <StepDetail label="What you should see">A 7-day plan with one task per day and a checklist at the end.</StepDetail>
                        <StepDetail label="If you don't see it">Ask: "Make each day one 20-minute task and add a checkbox for each."</StepDetail>
                        <StepDetail label="Common mistake">Making the plan too ambitious. Small daily tasks are what you'll actually finish.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: 7-day project plan]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={10} title="Use Claude for coding explanations">
                        <StepDetail label="What to type">Paste code and ask for a plain-language explanation and any risks.</StepDetail>
                        <PromptExample label="Try this">Explain what this code does line by line, then list any risks or parts a beginner should double-check: [paste code].</PromptExample>
                        <StepDetail label="What you should see">A line-by-line explanation plus a short list of things to verify.</StepDetail>
                        <StepDetail label="Common mistake">Pasting real secrets in the code. Replace API keys and passwords with placeholders like <code>YOUR_API_KEY</code> first.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Code explanation]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={11} title="Review, revise, and verify">
                        <StepDetail label="Why">The first reply is a draft. Refine it in the same chat, and check anything important.</StepDetail>
                        <StepDetail label="What to type">Reply with a short follow-up.</StepDetail>
                        <PromptExample label="Shorter">Make it shorter.</PromptExample>
                        <PromptExample label="Clearer">Make it clearer.</PromptExample>
                        <PromptExample label="Options">Give me 3 versions.</PromptExample>
                        <PromptExample label="Explain">Explain what you changed.</PromptExample>
                        <PromptExample label="Verify">List anything I should verify.</PromptExample>
                        <StepDetail label="What you should see">An improved answer, plus a list of claims worth checking yourself.</StepDetail>
                        <StepDetail label="Common mistake">Publishing the first draft without one round of revision or verifying key facts.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Follow-up refining an answer]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={12} title="Save useful results and prompts">
                        <StepDetail label="Why">A prompt or result that worked once will help again. Save it so you don't start over.</StepDetail>
                        <StepDetail label="Where to save">Keep your best work somewhere you'll reopen:</StepDetail>
                        <ul className="ait-list">
                            <li>Your <strong>AI Workspace Notes</strong> document.</li>
                            <li>A <strong>01 Prompts</strong> folder.</li>
                            <li>A project notes document.</li>
                            <li>A screenshots folder.</li>
                        </ul>
                        <StepDetail label="Common mistake">Relying on chat history to remember things. Chats get long and hard to search — save what matters into your own files.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Saving a prompt into notes]</ScreenshotPlaceholder>
                    </Step>
                </div>

                {/* 6. Good vs bad prompts */}
                <h2>Good vs bad prompts</h2>
                <Callout tone="good" title="Good — clear task, structure, and source">
                    <PromptExample>Summarize the pasted meeting notes into 3 decisions, 3 action items, and 3 questions we still need to answer. Use only the notes I pasted.</PromptExample>
                </Callout>
                <Callout tone="bad" title="Bad — too vague to help">
                    <PromptExample>summarize this</PromptExample>
                </Callout>
                <p className="ait-note-line">
                    The difference is not length — it's clarity. Give Claude the goal, the text to use, and the
                    format you want back.
                </p>

                {/* 7. Starter prompt library */}
                <h2>Starter prompt library</h2>
                <PromptExample label="Summary">Summarize the text below into 3 main ideas and 3 action items. Use only what I pasted, and don't add facts: [paste].</PromptExample>
                <PromptExample label="Writing">Rewrite this so it sounds clear and friendly, keep all the facts, and return only the edited version: [paste].</PromptExample>
                <PromptExample label="Planning">Turn this goal into a simple 7-day plan, one small task per day, with a final checklist: [goal].</PromptExample>
                <PromptExample label="Studying">Explain [topic] like I'm new to it, then give me 3 quiz questions with the answers hidden below.</PromptExample>
                <PromptExample label="Coding explanation">Explain what this code does line by line, then list anything a beginner should double-check: [paste code].</PromptExample>
                <PromptExample label="Compare options">Compare [option A] and [option B] in a two-column table: pros, cons, and who each is best for.</PromptExample>
                <PromptExample label="Rewrite">Rewrite this so a beginner could understand it, without losing the meaning: [paste].</PromptExample>
                <PromptExample label="Verify this">List the facts, numbers, or claims in this answer that I should verify myself: [paste answer].</PromptExample>
                <PromptExample label="Long project">I'm working on [project] over several sessions. Keep a running outline, and each time I add notes, update the outline and list what's left to do.</PromptExample>

                {/* 8. Lost? Check here */}
                <h2>Lost? Check here.</h2>
                <div className="ait-faq">
                    <details className="ait-faq-item"><summary>I cannot find the New Chat button</summary><p>Look for a plus (+) icon, a sidebar toggle (often three lines), or the account/profile menu in the top-right. On phones, the sidebar is usually hidden behind a menu icon.</p></details>
                    <details className="ait-faq-item"><summary>My screen looks different</summary><p>Interfaces change often and vary by device. Match by purpose, not exact pixels: a place to type, a way to start a new chat, a settings/profile menu, and a send button.</p></details>
                    <details className="ait-faq-item"><summary>Claude is asking me to upgrade</summary><p>You can learn every step here on a free plan. Skip the upgrade for now and revisit it only if you hit a limit that actually blocks your work.</p></details>
                    <details className="ait-faq-item"><summary>I do not know what to type</summary><p>Start with the first prompt in Step 3, or use anything from the Starter prompt library above. A simple "Explain [topic] simply" is a fine first message.</p></details>
                    <details className="ait-faq-item"><summary>Claude gave me a wall of text</summary><p>Reply with "Make it shorter" or "Give me the 5 key points as bullets." You can always ask for a specific length or format.</p></details>
                    <details className="ait-faq-item"><summary>Claude added facts I did not provide</summary><p>Tell it: "Use only the text I pasted and do not add anything." Then re-check the answer against your original text.</p></details>
                    <details className="ait-faq-item"><summary>I pasted too much text</summary><p>Break it into smaller sections and summarize each, or paste the most important part first. Shorter, focused inputs usually get clearer answers.</p></details>
                    <details className="ait-faq-item"><summary>I accidentally used the wrong chat</summary><p>Start a new chat for a new task, or scroll up to find the earlier conversation in the sidebar. Each chat keeps its own context.</p></details>
                    <details className="ait-faq-item"><summary>I do not know how to save the answer</summary><p>Copy the useful part and paste it into your notes. Look for a copy, export, or share button near the answer or in a "…" menu on the message.</p></details>
                </div>

                {/* 9. Beginner mistakes to avoid */}
                <h2>Beginner mistakes to avoid</h2>
                <ul className="ait-list">
                    <li>Asking for summaries without providing the text.</li>
                    <li>Pasting private or confidential information.</li>
                    <li>Not giving Claude the goal.</li>
                    <li>Not asking for a format.</li>
                    <li>Trusting facts without checking them.</li>
                    <li>Mixing too many tasks in one chat.</li>
                    <li>Accepting the first draft without revising.</li>
                    <li>Using Claude for high-stakes advice without a qualified expert.</li>
                </ul>

                {/* 10. Final checklist */}
                <h2>Final checklist</h2>
                <Callout tone="good" title="You've got the Claude basics when…">
                    <ul className="ait-list">
                        <li>I opened Claude.</li>
                        <li>I know how to start a new chat.</li>
                        <li>I sent a simple prompt.</li>
                        <li>I gave Claude a clear goal.</li>
                        <li>I added context safely.</li>
                        <li>I asked for a specific format.</li>
                        <li>I used Claude to summarize or rewrite something.</li>
                        <li>I asked at least one follow-up question.</li>
                        <li>I saved one useful prompt.</li>
                        <li>I know what not to paste.</li>
                        <li>I know to verify important information.</li>
                    </ul>
                </Callout>

                <h2>Safety note</h2>
                <SafetyNote />

                {/* 11. FAQ */}
                <h2>FAQ</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            {/* 12. Related guides */}
            <RelatedGuides />
            <BackToHubCta note="Now that you know the Claude basics, the prompt writing and AI workspace guides are the best next steps." />
        </div>
    );
}
