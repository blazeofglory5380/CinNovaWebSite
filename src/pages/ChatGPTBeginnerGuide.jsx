// ChatGPTBeginnerGuide — /?page=chatgpt-beginner-guide   CSS prefix: ait-
// Beginner-first, screen-aware tutorial matching the AI Workspace Setup master
// template. Vendor-neutral; CinNova is independent of OpenAI. Interfaces change,
// so steps describe common places rather than exact, version-specific UI.
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
    { q: "Do I need to pay to use ChatGPT?", a: "There are free ways to get started as well as paid options with more features. Availability and features change over time — check the latest official details before deciding. You can learn all the basics here without paying." },
    { q: "Is ChatGPT always correct?", a: "No. It can produce confident answers that are wrong, outdated, or made up, including fake sources. Verify anything important in a trusted place before you rely on it." },
    { q: "Can ChatGPT access the internet?", a: "It depends on the version and features you're using. Don't assume it can see live or recent data unless a browsing/search feature clearly says so." },
    { q: "Can I upload files?", a: "Sometimes, depending on the version. Even when you can, never upload passwords, private client files, or medical, legal, or financial records. Remove personal details first." },
    { q: "What should I never paste into ChatGPT?", a: "Passwords, API keys, secret tokens, and private client, medical, legal, or financial records. When in doubt, leave it out or replace real details with placeholders." },
    { q: "What should beginners use ChatGPT for first?", a: "Low-stakes writing, planning, brainstorming, and studying. Start by rewriting an email or making a simple plan — tasks where you can easily judge the result." },
    { q: "What should I learn after this?", a: "Prompt writing. Clear prompts make every answer better. The CinNova prompt writing guide is the recommended next step, then research and a tool that matches your goal." },
];

export default function ChatGPTBeginnerGuide() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="How to Use ChatGPT: Step-by-Step Beginner Guide"
                description="Learn how to use ChatGPT for writing, research, planning, brainstorming, coding help, and productivity with beginner-friendly steps, example prompts, safety tips, and common mistakes to avoid."
                pageKey="chatgpt-beginner-guide"
                siteUrl={siteUrl}
            />

            <TutorialHero
                eyebrow="CHATGPT · BEGINNER"
                title="How to Use ChatGPT: Step-by-Step Beginner Guide"
                intro="ChatGPT is an AI chat assistant you can use for writing, planning, studying, and coding help. This click-by-click guide gets you from your very first message to a useful mini project — with example prompts, safety tips, and the mistakes beginners make most."
                level="Beginner"
                minutes={12}
            />

            <section className="section ait-guide-body">
                {/* 1. What is ChatGPT */}
                <h2>What is ChatGPT?</h2>
                <p>
                    ChatGPT is an AI chat assistant. You type a message, called a <strong>prompt</strong>, and it
                    replies in natural language. It can help with writing, planning, brainstorming, studying,
                    coding help, and organizing ideas — all from the same chat box.
                </p>
                <p className="ait-note-line">
                    Interfaces change often, so this guide describes common places to look rather than exact
                    buttons — always check the current official screens and settings. CinNova is independent and
                    not affiliated with OpenAI; this is a neutral how-to guide.
                </p>

                {/* 2. What you need before starting */}
                <h2>What you need before starting</h2>
                <Callout tone="info" title="Before you start (2 minutes)">
                    <ul className="ait-list">
                        <li>A device with an internet connection.</li>
                        <li>A ChatGPT / OpenAI account, if the current interface asks you to sign in.</li>
                        <li>One simple task to practice with (like a short email or a study plan).</li>
                        <li>No private or confidential information.</li>
                        <li>A place to save good prompts (a notes app or document).</li>
                    </ul>
                </Callout>

                {/* 3. What ChatGPT is good for */}
                <h2>What ChatGPT is good for</h2>
                <ul className="ait-list">
                    <li>Writing and editing — emails, posts, summaries, and drafts.</li>
                    <li>Planning — outlines, schedules, and step-by-step plans.</li>
                    <li>Brainstorming — names, ideas, and angles.</li>
                    <li>Studying — explaining topics and quizzing you.</li>
                    <li>Research starting points — overviews and leads to verify.</li>
                    <li>Coding explanations — what code does and why.</li>
                    <li>Summaries — turning long text into short takeaways.</li>
                    <li>Checklists — turning a task into clear steps.</li>
                </ul>

                {/* 4. What ChatGPT is not reliable for */}
                <h2>What ChatGPT is not reliable for</h2>
                <Callout tone="warn" title="Always verify these">
                    <ul className="ait-list">
                        <li>Unverified facts, statistics, dates, and quotes.</li>
                        <li>Medical, legal, or financial decisions.</li>
                        <li>Recent information, unless browsing/search is clearly available.</li>
                        <li>Private data handling — treat anything you paste as if it could be stored.</li>
                        <li>Citations and links — these can be invented, so check them.</li>
                        <li>Replacing human judgment — you make the final call.</li>
                    </ul>
                </Callout>

                {/* 5. Step-by-step beginner setup */}
                <h2>Step-by-step beginner setup</h2>
                <div className="ait-steps">
                    <Step n={1} title="Open ChatGPT">
                        <StepDetail label="Where to look">Open your browser and go to ChatGPT, or open the ChatGPT app if you have it.</StepDetail>
                        <StepDetail label="What to click">Look for "Log in", "Sign up", or "Continue". These are usually near the center of the screen or the top-right area.</StepDetail>
                        <StepDetail label="What you should see">A chat screen with a message box near the bottom or center.</StepDetail>
                        <StepDetail label="If you don't see it">Look for an account/profile menu, a sidebar menu, or a button that says "New chat".</StepDetail>
                        <StepDetail label="Common mistake">Trying to use advanced features before sending a simple first message.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: ChatGPT home/login/chat screen]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={2} title="Start a new chat">
                        <StepDetail label="Where to look">Look near the left sidebar, the top-left area, or the top of the chat area.</StepDetail>
                        <StepDetail label="What to click">Click "New chat", "New conversation", or the plus (+) icon.</StepDetail>
                        <StepDetail label="What you should see">A blank conversation with an empty text box.</StepDetail>
                        <StepDetail label="If you don't see it">On small screens, open the menu/sidebar first (often a three-line icon), then look for New chat.</StepDetail>
                        <StepDetail label="Common mistake">Typing into an old conversation when you meant to start a new task.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: New chat button and blank conversation]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={3} title="Type your first simple prompt">
                        <StepDetail label="Where to look">The message box at the bottom or center of the chat.</StepDetail>
                        <StepDetail label="What to type">Paste the prompt below, then press Enter or the Send button (often a paper-plane or arrow icon).</StepDetail>
                        <PromptExample label="Try this">Explain what ChatGPT can help me do in 5 beginner-friendly bullet points.</PromptExample>
                        <StepDetail label="What you should see">After you send it, a reply appears in the conversation within a few seconds, usually written out as you watch.</StepDetail>
                        <StepDetail label="If you don't see it">Check your internet connection, and make sure you pressed Enter or clicked Send rather than just typing.</StepDetail>
                        <StepDetail label="Common mistake">Expecting a perfect answer from one line. The first reply is a starting point you can improve.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: First prompt and reply]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={4} title="Give ChatGPT a clear role">
                        <StepDetail label="Why">Telling ChatGPT who to act as ("role prompting") focuses the answer and sets the right tone.</StepDetail>
                        <StepDetail label="What to type">Start your prompt with a role, then the task.</StepDetail>
                        <PromptExample label="Try this">Act as a beginner-friendly writing coach. Help me write a short thank-you email.</PromptExample>
                        <StepDetail label="What you should see">A reply that fits the role — encouraging, simple, and aimed at a beginner.</StepDetail>
                        <StepDetail label="Common mistake">Leaving out the role and getting a generic answer. A one-line role changes the whole reply.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Role prompt example]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={5} title="Add context">
                        <StepDetail label="Why">ChatGPT can't read your mind. A sentence of context — who it's for, the goal, and limits — makes the answer fit.</StepDetail>
                        <StepDetail label="What to type">Add the details it can't know (never anything private).</StepDetail>
                        <PromptExample label="Try this">I am writing to a client who helped me with a project. Keep it warm, simple, and under 80 words.</PromptExample>
                        <StepDetail label="What you should see">A tailored reply that matches your audience, tone, and length.</StepDetail>
                        <StepDetail label="Common mistake">Giving no context and then being disappointed the answer feels generic.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Prompt with context added]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={6} title="Ask for a specific format">
                        <StepDetail label="Why">Telling ChatGPT the shape of the answer up front saves rework.</StepDetail>
                        <StepDetail label="What to type">Add one of these format requests to your prompt.</StepDetail>
                        <PromptExample label="Bullets">Give me the answer as 5 bullet points.</PromptExample>
                        <PromptExample label="Checklist">Give me the answer as a checklist.</PromptExample>
                        <PromptExample label="Email">Give me the answer as a short email.</PromptExample>
                        <StepDetail label="What you should see">The same idea reshaped into the exact format you asked for.</StepDetail>
                        <StepDetail label="Common mistake">Accepting a long paragraph when a checklist or list would be easier to use.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Same answer in different formats]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={7} title="Ask follow-up questions">
                        <StepDetail label="Why">ChatGPT remembers the current conversation, so you can refine instead of starting over.</StepDetail>
                        <StepDetail label="What to type">Reply in the same chat with a short follow-up.</StepDetail>
                        <PromptExample label="Simplify">Make this simpler.</PromptExample>
                        <PromptExample label="Options">Give me 3 better versions.</PromptExample>
                        <PromptExample label="Explain">Explain why you made those changes.</PromptExample>
                        <StepDetail label="What you should see">An updated answer that builds on the previous one.</StepDetail>
                        <StepDetail label="Common mistake">Opening a brand-new chat for every tweak, which loses the context.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Follow-up refining an answer]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={8} title="Ask ChatGPT to improve its answer">
                        <StepDetail label="What to type">When an answer is close but not perfect, ask for a targeted improvement.</StepDetail>
                        <PromptExample label="Try this">Make it shorter, clearer, and more friendly. Keep the main idea.</PromptExample>
                        <StepDetail label="What you should see">A tighter, friendlier version that still says the same thing.</StepDetail>
                        <StepDetail label="If you don't see it">Point to the exact part: "Keep everything but rewrite the second sentence."</StepDetail>
                        <StepDetail label="Common mistake">Using the very first draft without asking for one round of improvement.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Improved answer]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={9} title="Save useful prompts">
                        <StepDetail label="Why">A prompt that worked once will work again. Save it so you don't have to rewrite it.</StepDetail>
                        <StepDetail label="Where to save">Keep your best prompts somewhere you'll reopen:</StepDetail>
                        <ul className="ait-list">
                            <li>Your <strong>AI Workspace Notes</strong> document.</li>
                            <li>A <strong>01 Prompts</strong> folder.</li>
                            <li>A notes app.</li>
                            <li>Any document you already use.</li>
                        </ul>
                        <StepDetail label="Common mistake">Getting a great answer and never saving the prompt that produced it.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Prompt saved in notes]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={10} title="Check important information">
                        <StepDetail label="Why">ChatGPT can sound sure and still be wrong. Verify anything that matters before you use it.</StepDetail>
                        <StepDetail label="How to verify">Run important claims through a quick check:</StepDetail>
                        <ul className="ait-list">
                            <li>Check official sources for the topic.</li>
                            <li>Search trusted websites.</li>
                            <li>Compare multiple sources.</li>
                            <li>Do not publish facts blindly.</li>
                        </ul>
                        <StepDetail label="Common mistake">Copying a fact, number, or citation straight into your work without checking it.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Verifying a claim against a source]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={11} title="Use ChatGPT safely">
                        <StepDetail label="Why">Treat anything you paste as if it could be stored. A few rules keep you safe by default.</StepDetail>
                        <Callout tone="bad" title="Never paste these">
                            <ul className="ait-list">
                                <li>Passwords.</li>
                                <li>API keys.</li>
                                <li>Private documents.</li>
                                <li>Client files.</li>
                                <li>Medical, legal, or financial records.</li>
                            </ul>
                        </Callout>
                        <SafetyNote />
                        <StepDetail label="Common mistake">Assuming a chat is private. When in doubt, leave it out or replace real details with placeholders.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Data / privacy settings]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={12} title="Create your first mini project">
                        <StepDetail label="What to do">Put it all together: use ChatGPT to create a simple 5-day learning plan for a topic you care about.</StepDetail>
                        <PromptExample label="Try this">I want to learn [topic]. Create a 5-day beginner plan, 20 minutes per day, with one task per day and a simple checklist.</PromptExample>
                        <StepDetail label="What you should see">A 5-day plan with one small task per day and a checklist you can actually follow.</StepDetail>
                        <StepDetail label="If you don't see it">Ask: "Make each day one 20-minute task, and add a checkbox for each."</StepDetail>
                        <StepDetail label="Common mistake">Making the plan too big. Small daily tasks are what you'll actually finish.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: 5-day learning plan]</ScreenshotPlaceholder>
                    </Step>
                </div>

                {/* 6. Good vs bad prompts */}
                <h2>Good vs bad prompts</h2>
                <Callout tone="good" title="Good — clear role, task, and format">
                    <PromptExample>Act as a friendly study coach. Create a 5-day plan to learn the basics of budgeting, 20 minutes a day, as a simple checklist.</PromptExample>
                </Callout>
                <Callout tone="bad" title="Bad — too vague to help">
                    <PromptExample>teach me money</PromptExample>
                </Callout>
                <p className="ait-note-line">
                    The difference is not length — it's clarity. Say who ChatGPT should act as, what you want, and
                    the format you want it in.
                </p>

                {/* 7. Starter prompt library */}
                <h2>Starter prompt library</h2>
                <PromptExample label="Writing">Rewrite this so it sounds clear and friendly, keep all the facts, and return only the edited version: [paste text].</PromptExample>
                <PromptExample label="Planning">Turn this goal into a simple, numbered plan I can finish this week: [goal]. Keep it beginner-friendly.</PromptExample>
                <PromptExample label="Research">Give me a plain-language overview of [topic], then list 5 source leads I should verify myself. Mark anything you're unsure about.</PromptExample>
                <PromptExample label="Studying">Explain [topic] like I'm new to it, then give me 3 quiz questions with the answers hidden below.</PromptExample>
                <PromptExample label="Coding help">Explain what this code does line by line, then point out anything that could break: [paste code].</PromptExample>
                <PromptExample label="Brainstorming">Give me 10 beginner-friendly ideas for [goal], each with a one-line reason it could work.</PromptExample>
                <PromptExample label="Simplify">Rewrite this so a 12-year-old could understand it, without losing the meaning: [paste text].</PromptExample>
                <PromptExample label="Checklist">Turn this task into a simple checklist I can follow step by step: [describe the task].</PromptExample>

                {/* 8. Lost? Check here */}
                <h2>Lost? Check here.</h2>
                <div className="ait-faq">
                    <details className="ait-faq-item"><summary>I cannot find the New Chat button</summary><p>Look for a plus (+) icon, a sidebar toggle (often three lines), or the account/profile menu in the top-right. On phones, the sidebar is usually hidden behind a menu icon.</p></details>
                    <details className="ait-faq-item"><summary>My screen looks different</summary><p>Interfaces change often and vary by device. Match by purpose, not exact pixels: a place to type, a way to start a new chat, a settings/profile menu, and a send button.</p></details>
                    <details className="ait-faq-item"><summary>ChatGPT is asking me to upgrade</summary><p>You can learn every step here on a free plan. Skip the upgrade for now and revisit it only if you hit a limit that actually blocks your work.</p></details>
                    <details className="ait-faq-item"><summary>I do not know what to type</summary><p>Start with the first prompt in Step 3, or use anything from the Starter prompt library above. A simple "Explain [topic] simply" is a fine first message.</p></details>
                    <details className="ait-faq-item"><summary>The answer is too long</summary><p>Reply with "Make it shorter" or "Give me the 5 key points as bullets." You can always ask for a specific length.</p></details>
                    <details className="ait-faq-item"><summary>The answer is wrong</summary><p>That happens. Ask it to try again with more detail, give an example of what you want, and verify important facts in a trusted source.</p></details>
                    <details className="ait-faq-item"><summary>I accidentally used the wrong chat</summary><p>Start a new chat for a new task, or scroll up to find the earlier conversation in the sidebar. Each chat keeps its own context.</p></details>
                    <details className="ait-faq-item"><summary>I do not know how to save the answer</summary><p>Copy the useful part and paste it into your notes. Look for a copy, export, or share button near the answer or in a "…" menu on the message.</p></details>
                </div>

                {/* 9. Beginner mistakes to avoid */}
                <h2>Beginner mistakes to avoid</h2>
                <ul className="ait-list">
                    <li>Being too vague and expecting it to read your mind.</li>
                    <li>Trusting facts and sources without checking them.</li>
                    <li>Pasting private or confidential information.</li>
                    <li>Asking too many things at once instead of one task at a time.</li>
                    <li>Not giving any context.</li>
                    <li>Not asking follow-up questions to refine the answer.</li>
                    <li>Using the first draft without revising it.</li>
                </ul>

                {/* 10. Final checklist */}
                <h2>Final checklist</h2>
                <Callout tone="good" title="You've got the ChatGPT basics when…">
                    <ul className="ait-list">
                        <li>I opened ChatGPT.</li>
                        <li>I know how to start a new chat.</li>
                        <li>I sent a simple prompt.</li>
                        <li>I gave ChatGPT a role.</li>
                        <li>I added context.</li>
                        <li>I asked for a specific format.</li>
                        <li>I asked a follow-up question.</li>
                        <li>I saved at least one useful prompt.</li>
                        <li>I know what not to paste.</li>
                        <li>I know to verify important information.</li>
                    </ul>
                </Callout>

                {/* 11. FAQ */}
                <h2>FAQ</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            {/* 12. Related guides */}
            <RelatedGuides />
            <BackToHubCta note="Now that you know the ChatGPT basics, the prompt writing guide is the best next step." />
        </div>
    );
}
