// GeminiBeginnerGuide — /guides/gemini   CSS prefix: ait-
// Beginner-first, screen-aware tutorial matching the AI Workspace Setup master
// template. Vendor-neutral; CinNova is independent of Google. Interfaces change,
// so steps describe common places rather than exact, version-specific UI. We use
// cautious wording about connected Google data — never assume account access.
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
    { q: "Is Google Gemini free to use?", a: "There are free ways to get started and paid options with more capabilities. Availability and features change over time — check the latest official details before deciding. You can learn all the basics here without paying." },
    { q: "Does Gemini always give correct answers?", a: "No. Like all assistants, it can be confidently wrong or produce fabricated sources. Verify anything important in a trusted place before you rely on it." },
    { q: "Can Gemini see my Google account data?", a: "Don't assume it can. Access to any connected data (like Gmail, Drive, or Docs) depends on the product, your account settings, and features you have clearly turned on. Only rely on a connection when the interface plainly shows it and you chose it." },
    { q: "Can I upload files or images to Gemini?", a: "Sometimes, depending on the version and whether an upload, image, or attachment tool is shown. Even when you can, never upload private, sensitive, or personal files and images." },
    { q: "How is Gemini different from other AI assistants?", a: "It's another general-purpose AI assistant, made by Google. The clear-prompting habits in this guide transfer to any tool — use whichever fits your task and access." },
    { q: "What should I never paste into Gemini?", a: "Passwords, API keys, secret tokens, and private client, medical, legal, or financial records. When in doubt, leave it out or replace real details with placeholders." },
    { q: "What should I learn after this guide?", a: "Prompt writing and research. Clear prompts make every answer better, and research skills help you verify. The CinNova prompt writing and AI research guides are the recommended next steps." },
];

export default function GeminiBeginnerGuide() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="How to Use Google Gemini | Step-by-Step Beginner Guide"
                description="Learn how to use Google Gemini for writing, planning, research support, studying, productivity, visual workflows, brainstorming, and safe everyday AI help with beginner-friendly screen-aware steps, prompt examples, safety tips, and common mistakes to avoid."
                pageKey="gemini-beginner-guide"
                siteUrl={siteUrl}
            />

            <TutorialHero
                eyebrow="GOOGLE GEMINI · BEGINNER"
                title="How to Use Google Gemini: Step-by-Step Beginner Guide"
                intro="Google Gemini is an AI assistant you can use for writing, planning, studying, research support, and everyday tasks. This click-by-click guide takes you from your first message to real plans, drafts, and research — with example prompts, safety tips, and the mistakes beginners make most."
                level="Beginner"
                minutes={12}
            />

            <section className="section ait-guide-body">
                {/* 1. What is Google Gemini */}
                <h2>What is Google Gemini?</h2>
                <p>
                    Google Gemini is an AI assistant made by Google. You type a message, called a{" "}
                    <strong>prompt</strong>, and Gemini replies in natural language. People use it for writing,
                    planning, explaining topics, brainstorming, research support, productivity, and visual or
                    multimodal workflows when the interface makes them available.
                </p>
                <p className="ait-note-line">
                    Interfaces change often, so this guide describes common places to look rather than exact
                    buttons — always check the current official screens and settings. CinNova is independent and
                    not affiliated with Google; this is a neutral how-to guide.
                </p>

                {/* 2. What you need before starting */}
                <h2>What you need before starting</h2>
                <Callout tone="info" title="Before you start (2 minutes)">
                    <ul className="ait-list">
                        <li>A device with an internet connection.</li>
                        <li>A Google / Gemini account, if the current interface asks you to sign in.</li>
                        <li>One simple task to practice with (like planning your week).</li>
                        <li>A place to save good prompts (a notes app or document).</li>
                        <li>No private or confidential information.</li>
                        <li>A reminder that connected Google features depend on your account settings, product access, and what the current interface clearly allows — don't assume they're on.</li>
                    </ul>
                </Callout>

                {/* 3. What Gemini is good for */}
                <h2>What Gemini is good for</h2>
                <ul className="ait-list">
                    <li>Writing and editing — emails, posts, and drafts.</li>
                    <li>Planning — outlines, schedules, and step-by-step plans.</li>
                    <li>Brainstorming — names, ideas, and angles.</li>
                    <li>Study help — explaining topics and quizzing you.</li>
                    <li>Research starting points — overviews and leads to verify.</li>
                    <li>Organizing ideas — turning messy notes into structure.</li>
                    <li>Summaries — shortening text you provide.</li>
                    <li>Visual or image-related questions, when the interface supports it.</li>
                    <li>Productivity workflows.</li>
                </ul>

                {/* 4. What Gemini is not reliable for */}
                <h2>What Gemini is not reliable for</h2>
                <Callout tone="warn" title="Always verify these">
                    <ul className="ait-list">
                        <li>Unverified facts, statistics, dates, and quotes.</li>
                        <li>Citations and links — these can be invented, so check them.</li>
                        <li>Current events, unless live/current features are clearly available.</li>
                        <li>Medical, legal, or financial decisions.</li>
                        <li>Private data handling — treat anything you paste as if it could be stored.</li>
                        <li>Assuming it can see your Google account data (Gmail, Drive, Docs) automatically.</li>
                        <li>Replacing human judgment — you make the final call.</li>
                    </ul>
                </Callout>

                {/* 5. Step-by-step beginner setup */}
                <h2>Step-by-step beginner setup</h2>
                <div className="ait-steps">
                    <Step n={1} title="Open Gemini">
                        <StepDetail label="Where to look">Open your browser and go to Gemini, or open the Gemini app if you use it.</StepDetail>
                        <StepDetail label="What to click">Look for "Log in", "Sign in", "Continue", or the main chat entry screen. These are usually near the center or the top-right area.</StepDetail>
                        <StepDetail label="What you should see">A chat screen with a message box where you can type.</StepDetail>
                        <StepDetail label="If you don't see it">Look for an account/profile menu, a sidebar menu, or a button that starts a new chat.</StepDetail>
                        <StepDetail label="Common mistake">Assuming Gemini can see your Google files or account data automatically. Only use connected features when the interface clearly shows them and you understand the setting.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Gemini login or main chat screen]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={2} title="Start a new chat">
                        <StepDetail label="Where to look">Look near the left sidebar, the top-left area, or the top of the chat area.</StepDetail>
                        <StepDetail label="What to click">Click "New chat", "New conversation", a plus (+) icon, or the button that starts a blank chat.</StepDetail>
                        <StepDetail label="What you should see">A blank conversation with an empty text box.</StepDetail>
                        <StepDetail label="If you don't see it">Open the menu/sidebar first (often a three-line icon), especially on smaller screens.</StepDetail>
                        <StepDetail label="Common mistake">Using an old chat for a new topic and mixing unrelated tasks together.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: New chat button and blank conversation]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={3} title="Send your first simple prompt">
                        <StepDetail label="Where to look">The message box at the bottom or center of the chat.</StepDetail>
                        <StepDetail label="What to type">Paste the prompt below, then press Enter or the Send button (often a paper-plane or arrow icon).</StepDetail>
                        <PromptExample label="Try this">Explain what Google Gemini can help me do in 5 beginner-friendly bullet points.</PromptExample>
                        <StepDetail label="What you should see">After you send it, a reply appears in the conversation within a few seconds, usually written out as you watch.</StepDetail>
                        <StepDetail label="If you don't see it">Check your internet connection, and make sure you pressed Enter or clicked Send rather than just typing.</StepDetail>
                        <StepDetail label="Common mistake">Expecting a perfect answer from one line. The first reply is a starting point you can improve.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: First prompt and reply]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={4} title="Give Gemini a clear task">
                        <StepDetail label="Why">Framing the task ("act as… help me with…") focuses the answer and sets the right tone.</StepDetail>
                        <StepDetail label="What to type">Start your prompt with a role and a clear task.</StepDetail>
                        <PromptExample label="Try this">Act as a beginner-friendly planning assistant. Help me organize one small project.</PromptExample>
                        <StepDetail label="What you should see">A reply that fits the task — organized, simple, and aimed at a beginner.</StepDetail>
                        <StepDetail label="Common mistake">Leaving the request vague and getting a generic answer. A one-line task changes the whole reply.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Task-framed prompt]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={5} title="Add context and constraints">
                        <StepDetail label="Why">Details and limits — how much time, how many items, what format — make the answer fit your situation.</StepDetail>
                        <StepDetail label="What to type">Add your constraints and, if helpful, ask Gemini to question you first.</StepDetail>
                        <PromptExample label="Try this">I want to organize my week. I have 5 tasks, 30 minutes per day, and I want a simple checklist. Ask me questions before making the plan.</PromptExample>
                        <StepDetail label="What you should see">Gemini asking clarifying questions first, then a plan that respects your limits.</StepDetail>
                        <StepDetail label="Common mistake">Giving no constraints and getting a plan that doesn't fit your real time or tasks.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Prompt with context and constraints]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={6} title="Ask for a specific format">
                        <StepDetail label="Why">Telling Gemini the shape of the answer up front saves rework.</StepDetail>
                        <StepDetail label="What to type">Add one of these format requests to your prompt.</StepDetail>
                        <PromptExample label="Checklist">Return this as a checklist.</PromptExample>
                        <PromptExample label="Table">Return this as a table with two columns.</PromptExample>
                        <PromptExample label="Paragraph">Return this as a short paragraph under 100 words.</PromptExample>
                        <PromptExample label="Headings">Return this as headings and bullet points.</PromptExample>
                        <StepDetail label="What you should see">The same content reshaped into the exact format you asked for.</StepDetail>
                        <StepDetail label="Common mistake">Accepting a long block of text when a table or checklist would be easier to use.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Same answer in different formats]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={7} title="Use Gemini for writing and rewriting">
                        <StepDetail label="What to type">Paste a draft and ask for a clear, faithful rewrite.</StepDetail>
                        <PromptExample label="Try this">Rewrite this message to sound clear, friendly, and professional. Keep the meaning the same and do not add new facts: [paste].</PromptExample>
                        <StepDetail label="What you should see">A cleaner version that keeps your meaning and adds nothing new.</StepDetail>
                        <StepDetail label="Common mistake">Letting it change your meaning while "improving" the text. Ask it to keep the facts intact.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Rewritten message]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={8} title="Use Gemini for research support">
                        <StepDetail label="Why">Use Gemini to start research faster — an overview and leads — but verify the facts yourself.</StepDetail>
                        <StepDetail label="What to type">Ask for an overview plus terms and source types to check.</StepDetail>
                        <PromptExample label="Try this">Give me a beginner overview of [topic], then list 8 search terms and 5 types of trusted sources I should check. Mark anything that needs verification.</PromptExample>
                        <StepDetail label="What you should see">An overview, a list of search terms, source types, and clear "verify this" flags.</StepDetail>
                        <StepDetail label="Common mistake">Treating the overview as final truth. It's a starting point — confirm important claims in trusted sources.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Research overview with terms to verify]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={9} title="Use Gemini for studying">
                        <StepDetail label="What to type">Ask for a simple explanation, then a quiz.</StepDetail>
                        <PromptExample label="Try this">Explain [topic] like I am new to it, then quiz me with 5 questions. Hide the answers until after the questions.</PromptExample>
                        <StepDetail label="What you should see">A beginner explanation followed by 5 questions, with answers kept separate.</StepDetail>
                        <StepDetail label="If you don't see it">If it shows answers immediately, reply: "Ask the 5 questions first, then give the answers below."</StepDetail>
                        <StepDetail label="Common mistake">Reading the explanation but skipping the quiz. Testing yourself is what makes it stick.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Explanation and quiz]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={10} title="Use Gemini for visual or image-related workflows (when available)">
                        <StepDetail label="When you can">If your Gemini screen includes an upload, image, camera, or attachment button, you may be able to ask questions about an image you provide. If you don't see one, skip this step.</StepDetail>
                        <StepDetail label="What to click">Look for an attach/upload/image icon near the message box, add an image, then type your question.</StepDetail>
                        <PromptExample label="Try this">Look at this image and describe what is visible. Do not guess private details. Then give me 5 improvement ideas.</PromptExample>
                        <Callout tone="bad" title="Privacy first">
                            <p>Do not upload private, sensitive, or personal images — no IDs, documents, faces of others without consent, screens with personal data, or anything confidential.</p>
                        </Callout>
                        <StepDetail label="Common mistake">Assuming an image tool exists on every version. Only use it when the interface clearly shows it.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Image upload and description]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={11} title="Review, compare, and verify">
                        <StepDetail label="Why">The first reply is a draft. Refine it in the same chat, and check anything important.</StepDetail>
                        <StepDetail label="What to type">Reply with a short follow-up.</StepDetail>
                        <PromptExample label="Shorter">Make it shorter.</PromptExample>
                        <PromptExample label="Options">Give me 3 versions.</PromptExample>
                        <PromptExample label="Compare">Compare the options in a table.</PromptExample>
                        <PromptExample label="Verify">List what I should verify before using this.</PromptExample>
                        <PromptExample label="Uncertainty">Tell me what information is uncertain.</PromptExample>
                        <StepDetail label="What you should see">An improved answer, plus a clear list of what to double-check.</StepDetail>
                        <StepDetail label="Common mistake">Publishing the first draft without one round of revision or verifying key facts.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Follow-up comparing and verifying]</ScreenshotPlaceholder>
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
                <Callout tone="good" title="Good — clear role, task, and what to verify">
                    <PromptExample>Act as a beginner-friendly research assistant. Give me an overview of [topic], 8 search terms, 5 source types to check, and a list of claims I should verify.</PromptExample>
                </Callout>
                <Callout tone="bad" title="Bad — too vague to help">
                    <PromptExample>research this</PromptExample>
                </Callout>
                <p className="ait-note-line">
                    The difference is not length — it's clarity. Say who Gemini should act as, what you want, the
                    format you want back, and what to verify.
                </p>

                {/* 7. Starter prompt library */}
                <h2>Starter prompt library</h2>
                <PromptExample label="Writing">Rewrite this so it sounds clear and friendly, keep all the facts, and return only the edited version: [paste].</PromptExample>
                <PromptExample label="Planning">Turn this goal into a simple, numbered plan I can finish this week: [goal]. Keep it beginner-friendly.</PromptExample>
                <PromptExample label="Research support">Give me a beginner overview of [topic], 8 search terms, and 5 trusted source types to check. Mark anything I must verify.</PromptExample>
                <PromptExample label="Study">Explain [topic] like I'm new to it, then quiz me with 5 questions and hide the answers until the end.</PromptExample>
                <PromptExample label="Productivity">Help me plan my week: I have [tasks] and [time per day]. Return a simple daily checklist.</PromptExample>
                <PromptExample label="Brainstorming">Give me 10 beginner-friendly ideas for [goal], each with a one-line reason it could work.</PromptExample>
                <PromptExample label="Visual workflow">If I upload an image, describe what's visible without guessing private details, then suggest 5 improvements. [attach a non-sensitive image]</PromptExample>
                <PromptExample label="Compare options">Compare [option A] and [option B] in a two-column table: pros, cons, and who each is best for.</PromptExample>
                <PromptExample label="Verify this">List the facts, numbers, or claims in this answer that I should verify myself: [paste answer].</PromptExample>

                {/* 8. Lost? Check here */}
                <h2>Lost? Check here.</h2>
                <div className="ait-faq">
                    <details className="ait-faq-item"><summary>I cannot find the New Chat button</summary><p>Look for a plus (+) icon, a sidebar toggle (often three lines), or the account/profile menu in the top-right. On phones, the sidebar is usually hidden behind a menu icon.</p></details>
                    <details className="ait-faq-item"><summary>My screen looks different</summary><p>Interfaces change often and vary by device. Match by purpose, not exact pixels: a place to type, a way to start a new chat, a settings/profile menu, and a send button.</p></details>
                    <details className="ait-faq-item"><summary>Gemini is asking me to upgrade</summary><p>You can learn every step here on a free plan. Skip the upgrade for now and revisit it only if you hit a limit that actually blocks your work.</p></details>
                    <details className="ait-faq-item"><summary>I do not know what to type</summary><p>Start with the first prompt in Step 3, or use anything from the Starter prompt library above. A simple "Explain [topic] simply" is a fine first message.</p></details>
                    <details className="ait-faq-item"><summary>Gemini gave me a long answer</summary><p>Reply with "Make it shorter" or "Give me the 5 key points as bullets." You can always ask for a specific length or format.</p></details>
                    <details className="ait-faq-item"><summary>Gemini gave me facts I need to check</summary><p>Ask "List the claims I should verify," then confirm them in trusted sources. Don't publish facts, numbers, or citations without checking.</p></details>
                    <details className="ait-faq-item"><summary>I cannot find upload/image tools</summary><p>Not every version has them. Look for an attach, image, or camera icon near the message box. If it isn't there, this feature may not be available to you — that's fine, skip it.</p></details>
                    <details className="ait-faq-item"><summary>I accidentally used the wrong chat</summary><p>Start a new chat for a new task, or scroll up to find the earlier conversation in the sidebar. Each chat keeps its own context.</p></details>
                    <details className="ait-faq-item"><summary>I do not know how to save the answer</summary><p>Copy the useful part and paste it into your notes. Look for a copy, export, or share button near the answer or in a "…" menu on the message.</p></details>
                    <details className="ait-faq-item"><summary>I am worried about connected Google data</summary><p>Good instinct. Gemini does not automatically use your Gmail, Drive, or Docs unless a feature clearly shows it and you turned it on. Review the current official settings, and don't paste anything private.</p></details>
                </div>

                {/* 9. Beginner mistakes to avoid */}
                <h2>Beginner mistakes to avoid</h2>
                <ul className="ait-list">
                    <li>Asking broad questions instead of specific ones.</li>
                    <li>Trusting facts without checking them.</li>
                    <li>Assuming Gemini can see your Google files automatically.</li>
                    <li>Pasting private or confidential information.</li>
                    <li>Not giving any context.</li>
                    <li>Not asking for a format.</li>
                    <li>Using the first draft without revisions.</li>
                    <li>Uploading sensitive images or documents.</li>
                </ul>

                {/* 10. Final checklist */}
                <h2>Final checklist</h2>
                <Callout tone="good" title="You've got the Gemini basics when…">
                    <ul className="ait-list">
                        <li>I opened Gemini.</li>
                        <li>I know how to start a new chat.</li>
                        <li>I sent a simple prompt.</li>
                        <li>I gave Gemini a clear task.</li>
                        <li>I added context safely.</li>
                        <li>I asked for a specific format.</li>
                        <li>I used Gemini for writing, planning, studying, or research support.</li>
                        <li>I asked at least one follow-up question.</li>
                        <li>I saved one useful prompt.</li>
                        <li>I know not to assume it can see my Google data.</li>
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
            <BackToHubCta note="Now that you know the Gemini basics, the prompt writing and AI research guides are the best next steps." />
        </div>
    );
}
