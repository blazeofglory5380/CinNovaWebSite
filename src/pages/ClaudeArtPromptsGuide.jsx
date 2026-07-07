// ClaudeArtPromptsGuide — /?page=claude-art-prompts-guide   CSS prefix: ait-
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import {
    TutorialHero, TutorialSEO, Step, Callout, PromptExample, FAQ, RelatedGuides, BackToHubCta, SafetyNote,
} from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "Does Claude generate the images?", a: "No. Claude helps you write and improve the art prompt — the words that describe what you want. You then use that prompt in a separate image or video tool to actually create the visual. CinNova is independent and not affiliated with any AI company." },
    { q: "Why use Claude to write prompts at all?", a: "Good visuals start with a clear description of style, subject, mood, lighting, and composition. Claude helps you turn a vague idea into a detailed, well-structured prompt, and to create variations quickly." },
    { q: "Can I copy a famous artist's style?", a: "Be careful. Imitating a specific living artist's style or protected characters can raise copyright and ethical issues. Describe the look you want in general terms and check the latest official terms of the tool you use." },
    { q: "Is it safe to describe private people or client work?", a: "Avoid including private individuals, confidential client material, or personal data in prompts. Keep descriptions general and check the latest official privacy settings." },
];

export default function ClaudeArtPromptsGuide() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="How to Use Claude for Art Prompts | Beginner Guide"
                description="Learn how to use Claude to write better art prompts: describe subject, style, mood, lighting, camera, color, and composition, add constraints, and create variations. Includes before/after examples and copyright safety tips."
                pageKey="claude-art-prompts-guide"
                siteUrl={siteUrl}
            />

            <TutorialHero
                eyebrow="CLAUDE WORKFLOW · ART DIRECTION"
                title="How to Use Claude to Create Better Art Prompts"
                intro="Great AI visuals start with a clear description. This guide shows how to use Claude to write and improve art prompts — subject, style, mood, lighting, camera, color, and composition — which you then use in your image or video tool. Claude writes the prompt; the image tool makes the picture."
                level="Workflow"
                minutes={10}
            />

            <section className="section ait-guide-body">
                <h2>How Claude can help create art direction</h2>
                <p>
                    Claude doesn't make images — it helps you describe them well. Think of it as an art
                    director you brainstorm with: you bring the idea, and Claude helps turn it into a precise,
                    well-structured prompt covering the details image tools respond to. You then paste that
                    prompt into a separate image or video generator to create the actual visual. CinNova is
                    independent and not affiliated with any AI company; this is a neutral how-to guide.
                </p>

                <h2>How to describe a great image prompt</h2>
                <p>Strong prompts usually cover these building blocks. Claude can help you fill in each one:</p>
                <ul className="ait-list">
                    <li><strong>Subject</strong> — the main thing in the image and what it's doing.</li>
                    <li><strong>Style</strong> — the visual approach (photographic, illustrated, 3D, flat, etc.).</li>
                    <li><strong>Mood</strong> — the feeling (calm, energetic, cozy, dramatic).</li>
                    <li><strong>Lighting</strong> — soft, harsh, golden hour, studio, backlit.</li>
                    <li><strong>Camera</strong> — angle, distance, and lens feel (close-up, wide, top-down).</li>
                    <li><strong>Color</strong> — palette and contrast direction.</li>
                    <li><strong>Composition</strong> — where the subject sits and how space is used.</li>
                </ul>

                <h2>Step-by-step</h2>
                <div className="ait-steps">
                    <Step n={1} title="Define the image goal">
                        <p>Tell Claude what the image is for and where it will be used. A hero banner and a product thumbnail need different prompts.</p>
                        <PromptExample label="Example">I need a hero image for a cozy tea brand's homepage. Help me build a detailed art prompt for an image tool.</PromptExample>
                    </Step>
                    <Step n={2} title="Choose a subject">
                        <p>Pin down the main subject and what it's doing, clearly and concretely.</p>
                        <PromptExample label="Example">Subject: a steaming ceramic cup of herbal tea on a wooden table by a window. Refine this into a clear subject description.</PromptExample>
                    </Step>
                    <Step n={3} title="Add style and mood">
                        <p>Describe the visual approach and the feeling you want, in general terms rather than copying a specific artist.</p>
                        <PromptExample label="Example">Style: warm lifestyle photography. Mood: calm and cozy. Add these to the prompt naturally.</PromptExample>
                    </Step>
                    <Step n={4} title="Add composition and camera details">
                        <p>Specify framing, angle, and how the subject sits in the frame, leaving room for text if needed.</p>
                        <PromptExample label="Example">Composition: subject slightly off-center on the right, soft empty space on the left for a headline. Camera: close-up, shallow depth of field.</PromptExample>
                    </Step>
                    <Step n={5} title="Add lighting and color">
                        <p>Set the light source and palette to lock in the mood.</p>
                        <PromptExample label="Example">Lighting: soft morning light from the window. Color: warm ambers and creams, gentle contrast.</PromptExample>
                    </Step>
                    <Step n={6} title="Add constraints and avoid unwanted details">
                        <p>Tell it what to leave out — clutter, text, logos, or anything off-brand — so the result stays clean.</p>
                        <PromptExample label="Example">Avoid: busy backgrounds, visible text or logos, cold colors, harsh shadows. Add this to the prompt.</PromptExample>
                    </Step>
                    <Step n={7} title="Create prompt variations">
                        <p>Ask for several versions so you can test different looks in your image tool.</p>
                        <PromptExample label="Example">Give me 3 variations of this prompt: one more minimal, one more editorial, one more playful. Keep each self-contained.</PromptExample>
                    </Step>
                    <Step n={8} title="Use the prompt in an image or video tool">
                        <p>Copy the finished prompt into your chosen image or video generator to create the visual. Review the tool's output and iterate on the wording as needed.</p>
                    </Step>
                </div>

                <h2>Example prompts for product art</h2>
                <PromptExample label="Product art">Help me write an art prompt for a clean product shot of [product]: subject, minimal studio style, soft even lighting, neutral background, space for a headline, and a short "avoid" list.</PromptExample>

                <h2>Example prompts for children's learning worlds</h2>
                <PromptExample label="Kids / learning">Write a friendly, colorful art prompt for a children's learning scene about [topic]: cheerful characters, soft shapes, bright but gentle colors, safe and wholesome mood, no text.</PromptExample>

                <h2>Example prompts for real estate visuals</h2>
                <PromptExample label="Real estate">Write an art prompt for a warm, inviting interior of a [room type]: realistic style, natural daylight, tidy staging, wide composition, and an "avoid" list for clutter and harsh light.</PromptExample>

                <h2>Example prompts for social media graphics</h2>
                <PromptExample label="Social graphic">Write a bold, scroll-stopping art prompt for a social post about [topic]: strong focal subject, high-contrast palette, space for a short headline, and a clear "avoid" list.</PromptExample>

                <h2>Before / after prompt improvements</h2>
                <Callout tone="bad" title="Before — vague">
                    <PromptExample>a nice picture of a coffee cup</PromptExample>
                </Callout>
                <Callout tone="good" title="After — detailed and directed">
                    <PromptExample>Warm lifestyle photo of a steaming ceramic cup of herbal tea on a wooden table by a window, subject off-center right with soft empty space on the left, close-up with shallow depth of field, soft morning light, warm amber and cream palette, calm cozy mood. Avoid: clutter, visible text or logos, cold colors.</PromptExample>
                </Callout>

                <h2>Good vs bad prompts</h2>
                <Callout tone="good" title="Good — specific building blocks">
                    <PromptExample>Flat vector illustration of a friendly robot reading a book, soft rounded shapes, bright cheerful palette, centered composition, playful mood, plain background, no text.</PromptExample>
                </Callout>
                <Callout tone="bad" title="Bad — no direction">
                    <PromptExample>make cool art</PromptExample>
                </Callout>

                <h2>Common mistakes</h2>
                <ul className="ait-list">
                    <li>Expecting Claude to produce the image instead of the prompt.</li>
                    <li>Leaving out style, lighting, or composition, then getting random results.</li>
                    <li>Forgetting an "avoid" list, so unwanted details creep in.</li>
                    <li>Trying to copy a specific living artist or protected character.</li>
                    <li>Including private people, client material, or personal data.</li>
                </ul>

                <h2>Copyright &amp; style safety</h2>
                <Callout tone="warn" title="Create original work responsibly">
                    <ul className="ait-list">
                        <li>Describe the look you want in general terms; avoid imitating a specific living artist's style.</li>
                        <li>Don't recreate trademarked characters, logos, or protected designs.</li>
                        <li>Check the latest official terms of the image or video tool for usage and ownership rights.</li>
                        <li>Review every generated image before using it commercially.</li>
                    </ul>
                </Callout>

                <h2>Privacy &amp; safety</h2>
                <SafetyNote />

                <h2>FAQ</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            <RelatedGuides />
            <BackToHubCta note="Prompt writing is the core skill here — the prompt writing guide and Claude beginner guide are great next steps." />
        </div>
    );
}
