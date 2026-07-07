// CanvaAIBeginnerGuide — /?page=canva-ai-beginner-guide   CSS prefix: ait-
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import {
    TutorialHero, TutorialSEO, Step, Callout, PromptExample, FAQ, RelatedGuides, BackToHubCta, SafetyNote,
} from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "Is Canva AI free?", a: "There are free ways to get started as well as paid options with more features. Availability and features change over time — check the latest official details before deciding." },
    { q: "Can I use AI-generated designs commercially?", a: "Usage rights for AI-generated images and content vary and change over time. Check the latest official terms before using anything for business, ads, or client work — and confirm you have rights to any images or fonts you add." },
    { q: "Will the AI design look professional?", a: "It can produce a strong starting point quickly, but generated designs often need editing for spacing, readability, and brand fit. Treat the output as a first draft you refine, not a finished product." },
    { q: "Can it get text and details wrong?", a: "Yes. AI can misspell words, render odd text inside images, or misplace elements. Always proofread and check every detail before you publish or share." },
    { q: "Is it safe to upload client or private material?", a: "Be careful with anything confidential. Don't upload private, sensitive, or client-owned material unless you're sure you have permission, and check the latest official privacy settings." },
];

export default function CanvaAIBeginnerGuide() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="How to Use Canva AI | Step-by-Step Beginner Guide"
                description="Learn how to use Canva AI as a beginner: choose a design type, write a clear prompt, add audience and style details, edit the result, keep brand consistency, and export safely. Includes example prompts and common mistakes."
                pageKey="canva-ai-beginner-guide"
                siteUrl={siteUrl}
            />

            <TutorialHero
                eyebrow="CANVA AI · BEGINNER"
                title="How to Use Canva AI: Step-by-Step Beginner Guide"
                intro="Canva AI refers to the AI features inside Canva's design tool that help you generate images, layouts, and quick edits from a description. This guide shows how to get useful, polished results — with example prompts, editing habits, and the mistakes beginners make most."
                level="Beginner"
                minutes={9}
            />

            <section className="section ait-guide-body">
                <h2>What is Canva AI?</h2>
                <p>
                    Canva AI is a set of AI features built into Canva, a popular design tool. Instead of
                    starting from a blank page, you can describe what you want and let the AI generate images,
                    suggest layouts, write draft text, or make quick edits — which you then refine by hand.
                    It's designed to speed up design work for people who aren't professional designers. CinNova
                    is independent and not affiliated with Canva; this is a neutral how-to guide.
                </p>

                <h2>What it's commonly used for</h2>
                <ul className="ait-list">
                    <li>Social media posts and story graphics.</li>
                    <li>Presentations and slide layouts.</li>
                    <li>Marketing graphics like flyers, banners, and ads.</li>
                    <li>Generating or editing images to fit a design.</li>
                    <li>Drafting headlines and short copy to refine.</li>
                </ul>

                <h2>What it's good at</h2>
                <p>
                    Getting you from blank page to a usable draft fast, offering layout and style options, and
                    handling quick edits that would take longer by hand. It works best when you give clear
                    direction and treat the result as a starting point you polish.
                </p>

                <h2>What it's not reliable for</h2>
                <Callout tone="warn" title="Always check these yourself">
                    <ul className="ait-list">
                        <li>Text accuracy — proofread spelling and any words rendered inside images.</li>
                        <li>Brand consistency — colors, fonts, and spacing usually need adjusting.</li>
                        <li>Usage rights — confirm you're allowed to use generated or added assets.</li>
                        <li>Fine detail and precise layout, which often need manual editing.</li>
                        <li>Anything sensitive or client-owned you haven't cleared to use.</li>
                    </ul>
                </Callout>

                <h2>Step-by-step</h2>
                <div className="ait-steps">
                    <Step n={1} title="Choose the type of design you need">
                        <p>Decide the format first — a social post, a slide, a flyer — since size and layout shape everything else. Starting with the right format saves rework later.</p>
                    </Step>
                    <Step n={2} title="Write a clear design prompt">
                        <p>Describe what you want in plain language: the subject, the mood, and the purpose. Specific prompts produce more usable drafts than vague ones.</p>
                        <PromptExample label="Example">A clean, friendly Instagram post announcing a weekend sale for a local bakery. Warm colors, cozy feel, space at the top for a headline.</PromptExample>
                    </Step>
                    <Step n={3} title="Add audience, style, and format details">
                        <p>Tell it who it's for, the visual style, and where it will be used. These details steer the result toward something you can actually publish.</p>
                        <PromptExample label="Example">Audience: young families. Style: modern and minimal, lots of white space. Format: vertical story. Keep room for a logo in the corner.</PromptExample>
                    </Step>
                    <Step n={4} title="Review and edit the generated design">
                        <p>Treat the output as a first draft. Adjust spacing, swap elements, fix text, and refine until it looks intentional rather than auto-generated.</p>
                    </Step>
                    <Step n={5} title="Keep brand consistency">
                        <p>Apply your consistent colors, fonts, and logo so the design matches everything else you publish. Consistency is what makes work look professional.</p>
                        <PromptExample label="Example">Use these brand colors and this font throughout, and keep the layout consistent with my other posts.</PromptExample>
                    </Step>
                    <Step n={6} title="Export carefully for the right platform">
                        <p>Export in the size and format the destination needs — a print flyer and a social post have different requirements. Check dimensions and quality before you download.</p>
                    </Step>
                    <Step n={7} title="Check text, images, and permissions">
                        <p>Proofread every word, look closely at any AI-generated imagery, and confirm you have the rights to use the images and fonts included. Small errors are easy to miss and hard to undo once published.</p>
                    </Step>
                    <Step n={8} title="Protect private or client information">
                        <p>Don't upload confidential, sensitive, or client-owned material unless you're sure you have permission. Keep private data out of prompts and check the latest official privacy settings.</p>
                    </Step>
                </div>

                <h2>Example prompts for social posts</h2>
                <PromptExample label="Social">A bright, eye-catching square post for [event/offer]. Include space for a short headline and a call-to-action. Style: [modern / playful / minimal].</PromptExample>

                <h2>Example prompts for presentations</h2>
                <PromptExample label="Presentation">A clean title slide for a talk about [topic] for [audience]. Simple layout, room for a title and subtitle, professional and uncluttered.</PromptExample>

                <h2>Example prompts for marketing graphics</h2>
                <PromptExample label="Marketing">A promotional banner for [product/service] aimed at [audience]. Clear focal point, space for a headline and logo, colors that feel [trustworthy / energetic / premium].</PromptExample>

                <h2>Good vs bad prompts</h2>
                <Callout tone="good" title="Good — specific and purposeful">
                    <PromptExample>A minimal LinkedIn banner for a freelance copywriter. Calm blue tones, lots of white space, room for a short tagline on the left.</PromptExample>
                </Callout>
                <Callout tone="bad" title="Bad — vague">
                    <PromptExample>make me a nice design</PromptExample>
                </Callout>

                <h2>Common beginner mistakes</h2>
                <ul className="ait-list">
                    <li>Publishing the first draft without editing or proofreading.</li>
                    <li>Writing prompts too vague to produce anything usable.</li>
                    <li>Ignoring brand colors, fonts, and consistent spacing.</li>
                    <li>Exporting in the wrong size or format for the platform.</li>
                    <li>Using images or fonts without checking usage rights.</li>
                </ul>

                <h2>Privacy &amp; safety</h2>
                <SafetyNote />

                <h2>FAQ</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            <RelatedGuides />
            <BackToHubCta note="Clear prompts make Canva AI far more useful — the prompt writing guide is a great next step." />
        </div>
    );
}
