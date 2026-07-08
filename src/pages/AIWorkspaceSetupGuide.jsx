// AIWorkspaceSetupGuide — /?page=ai-workspace-setup-guide   CSS prefix: ait-
// Master template for beginner tutorials: click-by-click and screen-aware.
// Every major setup step uses StepDetail rows (Where to look / What to click /
// What you should see / If you don't see it / Common mistake) + a screenshot
// placeholder. Vendor-neutral; CinNova is independent of the tools named here.
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
    { q: "Do I need paid AI tools to start?", a: "No. Every tool named here has a free way to begin. Start on a free plan, learn the basics, and only upgrade later if you hit a limit you actually care about." },
    { q: "Which AI tool should beginners start with?", a: "Pick one general chat assistant and stay with it for a few weeks. ChatGPT, Claude, Gemini, and Microsoft Copilot are all good beginner choices. Learning one tool well beats sampling five." },
    { q: "Should I use ChatGPT, Claude, Gemini, or Copilot?", a: "Any of them works for a first workspace. Choose based on what you already use — Copilot if you live in Microsoft apps, Gemini if you use Google, or ChatGPT/Claude for general writing, planning, and analysis. You can switch later." },
    { q: "Can I upload files to AI tools?", a: "Often yes, but be careful. Never upload passwords, API keys, or private client, medical, legal, or financial files. Remove names and personal details first, and check the tool's data settings." },
    { q: "How do I keep my AI work organized?", a: "Use one folder on your computer with subfolders for prompts, research notes, images, videos, drafts, exports, and screenshots — plus one 'AI Workspace Notes' document. This guide walks through it step by step." },
    { q: "What should I never paste into an AI tool?", a: "Passwords, API keys, secret tokens, and private client, medical, legal, or financial records. When in doubt, leave it out or replace real details with placeholders." },
    { q: "What should I learn after setting up my workspace?", a: "Prompt writing, then research, then a tool that matches your goal — coding, design, or video. The CinNova AI Tutorials hub has a beginner roadmap you can follow in order." },
];

export default function AIWorkspaceSetupGuide() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="How to Set Up Your First AI Workspace: Beginner Guide"
                description="Set up your first AI workspace with beginner-friendly steps for choosing tools, creating folders, saving prompts, organizing files, protecting privacy, and preparing for writing, research, design, coding, video, and automation workflows."
                pageKey="ai-workspace-setup-guide"
                siteUrl={siteUrl}
            />

            <TutorialHero
                eyebrow="AI SETUP · BEGINNER"
                title="How to Set Up Your First AI Workspace"
                intro="An AI workspace is not one app — it is a simple system for keeping your tools, prompts, files, and results organized. This click-by-click guide sets one up from scratch, even if you have never used AI before."
                level="Beginner"
                minutes={14}
            />

            <section className="section ait-guide-body">
                {/* Before you start */}
                <h2>Before you start</h2>
                <Callout tone="info" title="A few quick choices (5 minutes)">
                    <ul className="ait-list">
                        <li><strong>Pick 1 main chat assistant:</strong> ChatGPT, Claude, Gemini, or Microsoft Copilot.</li>
                        <li><strong>Pick 1 research tool:</strong> Perplexity, NotebookLM, or your preferred search workflow.</li>
                        <li><strong>Pick 1 creative tool (only if you need it):</strong> Canva, Higgsfield, Runway, Adobe Firefly, or similar.</li>
                        <li><strong>Pick 1 coding tool (only if you need it):</strong> Cursor, Replit, GitHub Copilot, or similar.</li>
                        <li><strong>Create one folder on your computer</strong> for all of your AI work.</li>
                        <li><strong>Do not upload private, confidential, password, financial, medical, legal, or client-sensitive information.</strong></li>
                    </ul>
                </Callout>
                <p className="ait-note-line">
                    CinNova is independent and not affiliated with any of the AI companies or tools named in this
                    guide. Tool names are examples only — the steps work the same way whichever one you choose.
                </p>

                {/* 1. What is an AI workspace */}
                <h2>What is an AI workspace?</h2>
                <p>
                    An AI workspace is <strong>not one app</strong>. It is a simple system for keeping your tools,
                    prompts, files, outputs, screenshots, drafts, and project notes organized in one place. When
                    those things live in one spot, you can find your best prompts again, reuse good results, and
                    build on your work instead of starting over every time.
                </p>

                {/* 2. What you will set up */}
                <h2>What you will set up</h2>
                <ul className="ait-list">
                    <li>A main AI assistant you actually know how to use.</li>
                    <li>A project folder on your computer.</li>
                    <li>A prompt library of reusable prompts.</li>
                    <li>An output folder for saved results.</li>
                    <li>A research notes document.</li>
                    <li>A privacy checklist.</li>
                    <li>A simple weekly learning routine.</li>
                </ul>

                {/* 3. Step-by-step setup */}
                <h2>Step-by-step setup</h2>
                <div className="ait-steps">
                    <Step n={1} title="Choose your main AI assistant">
                        <StepDetail label="Where to look">Open the AI tool you want to start with, such as ChatGPT, Claude, Gemini, or Copilot.</StepDetail>
                        <StepDetail label="What to click">Look for a button like "New chat", "Start chat", "New conversation", or a plus (+) icon. It is commonly near the left sidebar or the top of the screen.</StepDetail>
                        <StepDetail label="What you should see">A blank chat box where you can type a message.</StepDetail>
                        <StepDetail label="If you don't see it">Look for a menu icon (often three lines), a sidebar toggle, or the account/profile menu in the top-right. Some tools hide the new chat button on smaller screens.</StepDetail>
                        <StepDetail label="Common mistake">Trying to learn five tools at once. Start with one main assistant and get comfortable before adding more.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: New chat button / blank chat screen]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={2} title="Create your AI project folder on your computer">
                        <StepDetail label="Where to look">Open your file manager — Finder on Mac, or File Explorer on Windows.</StepDetail>
                        <StepDetail label="What to create">Make one new folder called <strong>AI Workspace</strong>, then create the subfolders below inside it.</StepDetail>
                        <PromptExample label="Suggested folder structure">{`AI Workspace/
  01 Prompts/
  02 Research Notes/
  03 Images/
  04 Videos/
  05 Drafts/
  06 Exports/
  07 Screenshots/
  08 Projects/`}</PromptExample>
                        <StepDetail label="What you should see">One AI Workspace folder containing eight clearly numbered subfolders.</StepDetail>
                        <StepDetail label="If you don't see it">Make sure you created the subfolders <em>inside</em> AI Workspace, not next to it. Numbering them (01, 02…) keeps them in order.</StepDetail>
                        <StepDetail label="Common mistake">Saving AI files randomly across your desktop and downloads. One home folder is the whole point.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: AI Workspace folder with numbered subfolders]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={3} title="Create your first project note">
                        <StepDetail label="What to create">Make a simple text document, Google Doc, Notion page, or Word document titled <strong>AI Workspace Notes</strong>. Save it in your AI Workspace folder (or pin it somewhere easy to reach).</StepDetail>
                        <StepDetail label="What to write">Add these headings so you always know where things go:</StepDetail>
                        <ul className="ait-list">
                            <li>Tools I use</li>
                            <li>Best prompts</li>
                            <li>Projects</li>
                            <li>Ideas</li>
                            <li>Things to verify</li>
                            <li>Things I should not upload</li>
                        </ul>
                        <StepDetail label="What you should see">One document with six headings and space under each.</StepDetail>
                        <StepDetail label="If you don't see it">Any editor works — the format matters more than the app. Keep it somewhere you will actually reopen.</StepDetail>
                        <StepDetail label="Common mistake">Keeping notes only in your head. Writing them down is what makes the workspace useful next week.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: AI Workspace Notes document with headings]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={4} title="Create a prompt library">
                        <StepDetail label="Where to look">Open the <strong>01 Prompts</strong> folder or the "Best prompts" section of your notes.</StepDetail>
                        <StepDetail label="What to save">Save reusable prompts you can paste anytime. Start with these beginner templates:</StepDetail>
                        <ul className="ait-list">
                            <li>Explain this simply</li>
                            <li>Create a checklist</li>
                            <li>Turn this into a plan</li>
                            <li>Rewrite this clearly</li>
                            <li>Summarize this</li>
                            <li>Help me brainstorm</li>
                            <li>Ask me questions before answering</li>
                        </ul>
                        <StepDetail label="What you should see">A short list of prompts you can copy and reuse instead of retyping.</StepDetail>
                        <StepDetail label="Common mistake">Writing a great prompt, getting a great answer, and never saving the prompt. Save the ones that work.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Saved prompt library list]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={5} title="Set up a research workflow">
                        <StepDetail label="Why">AI is a fast starting point, not a final source. This workflow lets you move quickly without blindly trusting it.</StepDetail>
                        <StepDetail label="What to do">Follow these five moves for any research task:</StepDetail>
                        <ul className="ait-list">
                            <li>Ask AI for a plain-language overview.</li>
                            <li>Collect source leads (names, sites, terms to search).</li>
                            <li>Verify important facts against a reliable source.</li>
                            <li>Save notes in <strong>02 Research Notes</strong>.</li>
                            <li>Mark anything uncertain so you remember to double-check it.</li>
                        </ul>
                        <StepDetail label="Common mistake">Copying an AI answer straight into your work. Always verify claims that matter before you rely on them.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Research notes with a "to verify" mark]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={6} title="Set up a creative workflow (optional)">
                        <StepDetail label="When you need it">Only if you plan to make images, video, or brand content. Otherwise skip to Step 7.</StepDetail>
                        <StepDetail label="What to create">Inside your workspace, use folders such as Images, Videos, Brand assets, Social posts, and Website heroes.</StepDetail>
                        <StepDetail label="Tools you might use">Canva AI, Higgsfield, Runway, Adobe Firefly, Midjourney, and ElevenLabs are common creator tools. Pick one to start.</StepDetail>
                        <StepDetail label="Common mistake">Generating dozens of assets with no naming or folders. Name files clearly and save them as you go.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Creative folders for images and videos]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={7} title="Set up a coding or app-building workflow (optional)">
                        <StepDetail label="When you need it">Only if you plan to build websites, tools, or apps. Otherwise skip to Step 8.</StepDetail>
                        <StepDetail label="What to create">Use folders for Code ideas, Bug notes, Screenshots, Prompts, and Test results.</StepDetail>
                        <StepDetail label="Tools you might use">Cursor, Replit, GitHub Copilot, v0, Bolt, and Lovable are common AI coding tools. Start with one.</StepDetail>
                        <StepDetail label="Common mistake">Pasting large amounts of AI code without reading, testing, or saving what worked. Keep notes and screenshots of good results.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Coding workspace folders]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={8} title="Set up privacy rules">
                        <StepDetail label="Why">Anything you paste can be processed by the tool. A short rule set keeps you safe by default.</StepDetail>
                        <Callout tone="bad" title="Privacy checklist">
                            <ul className="ait-list">
                                <li>Never upload passwords.</li>
                                <li>Never upload API keys.</li>
                                <li>Never upload private client files.</li>
                                <li>Never upload medical, legal, or financial records.</li>
                                <li>Remove names and personal details when possible.</li>
                                <li>Review the platform's data and privacy settings.</li>
                                <li>Check output before publishing.</li>
                            </ul>
                        </Callout>
                        <StepDetail label="Where to look">Open the tool's settings — usually behind the account/profile menu in the top-right, or a gear icon — and review its data controls.</StepDetail>
                        <StepDetail label="Common mistake">Assuming a chat is private. Treat anything you paste as if it could be stored. When in doubt, leave it out.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Settings / data controls panel]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={9} title="Create your first useful AI prompt">
                        <StepDetail label="What to do">Open a new chat in your main assistant and paste this prompt exactly.</StepDetail>
                        <PromptExample label="Paste this">I am setting up my first AI workspace. Ask me 5 questions about what I want to use AI for, then recommend a simple folder structure, 3 starter prompts, and one beginner project I can complete this week.</PromptExample>
                        <StepDetail label="What you should see">The assistant asking you questions first, then giving tailored suggestions after you answer.</StepDetail>
                        <StepDetail label="If you don't see it">If it answers without asking, reply: "Ask me the 5 questions first, one at a time."</StepDetail>
                        <StepDetail label="Common mistake">Accepting the first generic answer. Answer the questions honestly so the advice fits you.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Assistant asking setup questions]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={10} title="Save your first result">
                        <StepDetail label="What to do">Keep the useful part of the answer so it is not lost when you close the tab.</StepDetail>
                        <ul className="ait-list">
                            <li>Copy the useful answer.</li>
                            <li>Paste it into your <strong>AI Workspace Notes</strong>.</li>
                            <li>Save any good prompts in <strong>01 Prompts</strong>.</li>
                            <li>Save screenshots in <strong>07 Screenshots</strong>.</li>
                        </ul>
                        <StepDetail label="What to look for">Export, download, or share buttons are usually at the top-right of the answer or in a "…" menu on the message.</StepDetail>
                        <StepDetail label="Common mistake">Relying on chat history to remember things. Chats get long and hard to search — save what matters into your own files.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Copying an answer into notes]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={11} title="Create a weekly routine">
                        <StepDetail label="Why">Small, steady practice beats one long session. A simple weekly rhythm builds real skill.</StepDetail>
                        <ul className="ait-list">
                            <li><strong>Monday:</strong> choose one AI task.</li>
                            <li><strong>Tuesday:</strong> test one prompt.</li>
                            <li><strong>Wednesday:</strong> improve one result.</li>
                            <li><strong>Thursday:</strong> save what worked.</li>
                            <li><strong>Friday:</strong> review and organize.</li>
                        </ul>
                        <StepDetail label="Common mistake">Trying to master everything in one weekend, then quitting. Fifteen minutes a day is plenty to start.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Weekly routine checklist]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={12} title="Final workspace check">
                        <StepDetail label="What to confirm">Run through this quick check before you call the setup done.</StepDetail>
                        <Callout tone="good" title="You're set up when…">
                            <ul className="ait-list">
                                <li>You have one main AI assistant open and working.</li>
                                <li>Your AI Workspace folder and subfolders exist.</li>
                                <li>Your AI Workspace Notes document has its headings.</li>
                                <li>You saved at least three reusable prompts.</li>
                                <li>You know your privacy rules.</li>
                                <li>You have one first project idea to try this week.</li>
                            </ul>
                        </Callout>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Completed workspace overview]</ScreenshotPlaceholder>
                    </Step>
                </div>

                {/* 4. Lost? Check here */}
                <h2>Lost? Check here.</h2>
                <div className="ait-faq">
                    <details className="ait-faq-item"><summary>I cannot find the New Chat button</summary><p>Look for a plus (+) icon, a sidebar toggle (often three lines), or the account/profile menu in the top-right. On phones, the sidebar is usually hidden behind a menu icon.</p></details>
                    <details className="ait-faq-item"><summary>My screen looks different</summary><p>Interfaces change and vary by device. Match by purpose, not exact pixels: a place to type, a way to start a new chat, a settings/profile menu, and an upload or attach button.</p></details>
                    <details className="ait-faq-item"><summary>I do not know which AI tool to choose</summary><p>Pick the one closest to what you already use — Copilot for Microsoft apps, Gemini for Google, ChatGPT or Claude for general work. You can switch later; the workspace stays the same.</p></details>
                    <details className="ait-faq-item"><summary>The AI gave me a bad answer</summary><p>That is normal. Ask it to try again with more detail, give an example of what you want, or break the task into smaller steps. Always verify facts that matter.</p></details>
                    <details className="ait-faq-item"><summary>I do not know where to save things</summary><p>Prompts go in 01 Prompts, research in 02 Research Notes, images in 03 Images, and screenshots in 07 Screenshots. When unsure, drop it in your AI Workspace Notes.</p></details>
                    <details className="ait-faq-item"><summary>I am worried about privacy</summary><p>Good instinct. Never paste passwords, keys, or private records, remove personal details, and review the tool's data settings. When in doubt, leave it out.</p></details>
                    <details className="ait-faq-item"><summary>The tool is asking me to upgrade</summary><p>You can learn everything here on a free plan. Skip the upgrade for now and revisit it only if you hit a limit that actually blocks your work.</p></details>
                    <details className="ait-faq-item"><summary>I have too many files already</summary><p>Spend five minutes moving AI-related files into your AI Workspace folder and its subfolders. Clear naming and one home folder fix most of the mess.</p></details>
                </div>

                {/* 5. Beginner mistakes to avoid */}
                <h2>Beginner mistakes to avoid</h2>
                <ul className="ait-list">
                    <li>Using too many tools at once instead of learning one well.</li>
                    <li>Not saving good prompts you will want again.</li>
                    <li>Trusting AI facts without checking them.</li>
                    <li>Uploading private or sensitive information.</li>
                    <li>Not naming files clearly.</li>
                    <li>Trying advanced automation before the basics are steady.</li>
                    <li>Not keeping screenshots of good results.</li>
                </ul>

                {/* 6. Starter prompt library */}
                <h2>Starter prompt library</h2>
                <PromptExample label="Planning">Turn this goal into a simple, numbered plan I can finish this week: [describe your goal]. Keep it beginner-friendly.</PromptExample>
                <PromptExample label="Research">Give me a plain-language overview of [topic], then list 5 source leads I should verify myself. Mark anything you are unsure about.</PromptExample>
                <PromptExample label="Writing">Rewrite this clearly for a general audience, keeping my meaning and tone: [paste text].</PromptExample>
                <PromptExample label="Design">Suggest 3 simple layout ideas for a [type of design], describing the sections and where text and images go. No jargon.</PromptExample>
                <PromptExample label="Coding">Explain what this code does line by line, then point out anything that could break: [paste code].</PromptExample>
                <PromptExample label="Video">Write a 20-second script and a shot list for a short video about [topic], aimed at beginners.</PromptExample>
                <PromptExample label="Automation">List the repetitive steps in this task and suggest which ones a beginner could safely automate first: [describe the task].</PromptExample>

                {/* 7. Final checklist */}
                <h2>Final checklist</h2>
                <Callout tone="good" title="Your first AI workspace">
                    <ul className="ait-list">
                        <li>I picked one main AI assistant.</li>
                        <li>I created my AI Workspace folder.</li>
                        <li>I created folders for prompts, research, drafts, exports, and screenshots.</li>
                        <li>I created my AI Workspace Notes document.</li>
                        <li>I saved at least three reusable prompts.</li>
                        <li>I know what not to upload.</li>
                        <li>I created one first project idea.</li>
                        <li>I know what tutorial to follow next.</li>
                    </ul>
                </Callout>

                <h2>Safety note</h2>
                <SafetyNote />

                {/* 8. FAQ */}
                <h2>FAQ</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            {/* 9. Related guides */}
            <RelatedGuides />

            <BackToHubCta note="Next, learn prompt writing and research — the two skills that make every other AI tool easier. Find them on the AI Tutorials hub." />
        </div>
    );
}
