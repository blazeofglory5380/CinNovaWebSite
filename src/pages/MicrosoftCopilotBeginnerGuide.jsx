// MicrosoftCopilotBeginnerGuide — /guides/microsoft-copilot   CSS prefix: ait-
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import {
    TutorialHero, TutorialSEO, Step, Callout, PromptExample, FAQ, RelatedGuides, BackToHubCta, SafetyNote,
} from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "Is Microsoft Copilot free?", a: "Some Copilot features are free and others are part of paid plans, and this varies by product and organization. Check the latest official details for what applies to you." },
    { q: "Can Copilot see my company files and email?", a: "In some work setups it can work with content you have access to, governed by your organization's settings. Follow your company's policies, and never assume access — check the latest official settings." },
    { q: "Is Copilot's output always accurate?", a: "No. It can be wrong or make things up, including numbers in a summary. Always review and verify facts and figures before sharing or acting on them." },
    { q: "Should I use Copilot for confidential work?", a: "Follow your organization's data policies. Don't paste secrets, credentials, or regulated data into any tool unless your company explicitly approves it." },
];

export default function MicrosoftCopilotBeginnerGuide() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="How to Use Microsoft Copilot | Step-by-Step Beginner Guide"
                description="Learn how to use Microsoft Copilot for writing, summarizing, email, documents, spreadsheets, meetings, productivity, and everyday work with beginner-friendly steps, examples, privacy tips, and mistakes to avoid."
                pageKey="microsoft-copilot-beginner-guide"
                siteUrl={siteUrl}
            />

            <TutorialHero
                eyebrow="MICROSOFT COPILOT · BEGINNER"
                title="How to Use Microsoft Copilot: Step-by-Step Beginner Guide"
                intro="Microsoft Copilot is an AI assistant that helps with everyday work — drafting email, summarizing documents, and organizing information. This guide covers a safe, practical workflow with examples and workplace privacy tips."
                level="Beginner"
                minutes={9}
            />

            <section className="section ait-guide-body">
                <h2>What is Microsoft Copilot?</h2>
                <p>
                    Microsoft Copilot is an AI assistant from Microsoft that helps you draft, summarize, and
                    organize work. Depending on the product and your organization's setup, it can appear in
                    everyday apps to speed up writing and productivity tasks. CinNova is independent and not
                    affiliated with Microsoft; this is a neutral how-to guide.
                </p>

                <h2>What it's commonly used for</h2>
                <ul className="ait-list">
                    <li>Email — drafting, replying, and adjusting tone.</li>
                    <li>Documents — first drafts, rewrites, and summaries.</li>
                    <li>Spreadsheets and planning — organizing and explaining data you provide.</li>
                    <li>Meetings — summarizing notes and pulling out action items.</li>
                    <li>Productivity — turning goals into steps and checklists.</li>
                </ul>

                <h2>What it's good at</h2>
                <p>Speeding up routine writing, summarizing content you supply, restructuring information, and drafting so you can edit rather than start from scratch.</p>

                <h2>What it's not reliable for</h2>
                <Callout tone="warn" title="Review and verify these">
                    <ul className="ait-list">
                        <li>Facts, figures, and numbers — including totals in a summary.</li>
                        <li>Sources and references — confirm each one.</li>
                        <li>Anything time-sensitive, unless a feature clearly provides current data.</li>
                        <li>High-stakes work: legal, financial, HR, or compliance decisions.</li>
                    </ul>
                </Callout>

                <h2>Step-by-step</h2>
                <div className="ait-steps">
                    <Step n={1} title="Start with the work outcome you want">
                        <p>Name the deliverable: a reply, a one-page summary, a meeting recap, or a checklist.</p>
                        <PromptExample label="Example">Draft a short, polite reply agreeing to the meeting time and asking for the agenda.</PromptExample>
                    </Step>
                    <Step n={2} title="Provide context">
                        <p>Give the relevant details or paste the content it should work from (following your company's rules on what's shareable).</p>
                    </Step>
                    <Step n={3} title="Ask for structured output">
                        <p>Request a clear format — bullets, a table, sections, or a short email.</p>
                        <PromptExample label="Example">Summarize this document as 5 bullets, then a one-line recommendation.</PromptExample>
                    </Step>
                    <Step n={4} title="Use it for drafts and summaries">
                        <p>Let it produce a first version you can quickly edit, rather than writing from a blank page.</p>
                        <PromptExample label="Example">Turn these rough notes into a clear project update email for my team: [paste].</PromptExample>
                    </Step>
                    <Step n={5} title="Use it for productivity planning">
                        <p>Convert goals and notes into prioritized steps and checklists.</p>
                        <PromptExample label="Example">Organize these tasks into today, this week, and later, and flag any that seem urgent: [paste].</PromptExample>
                    </Step>
                    <Step n={6} title="Review workplace-sensitive information carefully">
                        <p>Before sharing any output, make sure it doesn't expose confidential details or mix up who should see what.</p>
                    </Step>
                    <Step n={7} title="Verify important facts and numbers">
                        <p>Double-check every figure, date, and claim — especially numbers in a summary — against the source before you send or act on it.</p>
                    </Step>
                    <Step n={8} title="Protect private and company data">
                        <p>Follow your organization's policies. Don't paste passwords, keys, customer data, or regulated information unless it's explicitly approved. Check the latest official settings.</p>
                    </Step>
                </div>

                <h2>Example prompts for email</h2>
                <PromptExample label="Email">Write a friendly, concise reply declining this meeting and proposing two alternative times next week: [paste].</PromptExample>

                <h2>Example prompts for documents</h2>
                <PromptExample label="Documents">Summarize this document into an executive summary of 5 bullets plus one recommendation. Document: [paste].</PromptExample>

                <h2>Example prompts for spreadsheets / planning</h2>
                <PromptExample label="Planning">Here is a list of tasks with due dates. Group them by week and highlight anything overdue: [paste].</PromptExample>

                <h2>Good vs bad prompts</h2>
                <Callout tone="good" title="Good — clear outcome, format, and material">
                    <PromptExample>Draft a 4-bullet status update for leadership from these notes, plain and factual, no jargon: [paste].</PromptExample>
                </Callout>
                <Callout tone="bad" title="Bad — vague, no material">
                    <PromptExample>write my update</PromptExample>
                </Callout>

                <h2>Common beginner mistakes</h2>
                <ul className="ait-list">
                    <li>Not stating the deliverable or format you want.</li>
                    <li>Trusting summarized numbers without checking the source.</li>
                    <li>Sharing output before reviewing it for sensitive details.</li>
                    <li>Pasting confidential or regulated data against company policy.</li>
                </ul>

                <h2>Workplace privacy &amp; safety</h2>
                <SafetyNote />
                <Callout tone="info" title="Follow your organization's policies">
                    <p>At work, your company's rules on AI, data handling, and confidentiality come first. When in doubt, ask before pasting anything sensitive, and keep private data out of AI tools.</p>
                </Callout>

                <h2>FAQ</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            <RelatedGuides />
            <BackToHubCta note="Prompt writing and research skills carry straight over to Copilot at work." />
        </div>
    );
}
