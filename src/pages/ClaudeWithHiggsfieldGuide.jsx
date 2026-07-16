// ClaudeWithHiggsfieldGuide — /guides/claude-with-higgsfield   CSS prefix: ait-
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import {
    TutorialHero, TutorialSEO, Step, Callout, PromptExample, FAQ, RelatedGuides, BackToHubCta, SafetyNote,
} from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "Does Claude generate the video?", a: "No. Claude helps you plan the concept and write the prompts — the words that describe each scene. You then use those prompts in a separate AI video tool to actually create the video. CinNova is independent and not affiliated with Anthropic or Higgsfield." },
    { q: "Why plan video prompts with Claude first?", a: "Good AI video starts with a clear concept and detailed, scene-by-scene descriptions of style, camera, lighting, and mood. Claude helps you turn an idea into structured prompts and create variations quickly." },
    { q: "Can I copy a movie or brand's exact style?", a: "Be careful. Imitating a specific film, brand, or protected character can raise copyright and trademark issues. Describe the look you want in general terms and check the latest official terms of the video tool." },
    { q: "Is it safe to describe real people or private locations?", a: "Avoid including private individuals, confidential client material, or personal data in prompts. Keep descriptions general and check the latest official privacy settings." },
];

export default function ClaudeWithHiggsfieldGuide() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="How to Use Claude with Higgsfield | AI Video Prompt Guide"
                description="Learn how to use Claude alongside Higgsfield to plan AI video: define the goal, write a concept, build scene-by-scene prompts with style, camera, lighting, and mood, and create platform variations. Includes example prompts and copyright tips."
                pageKey="claude-with-higgsfield-guide"
                siteUrl={siteUrl}
            />

            <TutorialHero
                eyebrow="CLAUDE WORKFLOW · AI VIDEO"
                title="How to Use Claude with Higgsfield: AI Video Prompt Workflow Guide"
                intro="Great AI video starts with a clear concept and detailed prompts. This guide shows how to use Claude alongside Higgsfield — Claude to plan the concept and write scene-by-scene prompts, which you then use in the video tool. Claude writes the prompts; the tool makes the video."
                level="Workflow"
                minutes={11}
            />

            <section className="section ait-guide-body">
                <h2>What this workflow is for</h2>
                <p>
                    AI video tools turn descriptions into moving footage — but the quality depends on the
                    concept and the prompt. In this workflow you use Claude alongside Higgsfield — not as an
                    integration — to shape the concept, break it into scenes, and write detailed prompts for
                    style, camera, lighting, and mood. You then paste those prompts into the video tool to
                    generate the footage. CinNova is independent and not affiliated with Anthropic or
                    Higgsfield; this is a neutral how-to guide.
                </p>

                <h2>How Claude can help plan video concepts</h2>
                <ul className="ait-list">
                    <li>Turning a goal into a short, focused video concept.</li>
                    <li>Breaking the concept into a scene-by-scene structure.</li>
                    <li>Writing detailed prompts covering style, camera, lighting, and mood.</li>
                    <li>Creating platform-specific variations (vertical, square, wide).</li>
                    <li>Drafting captions, titles, and posting notes.</li>
                </ul>

                <h2>What Claude cannot replace</h2>
                <Callout tone="warn" title="Claude plans and prompts; the video tool renders">
                    <ul className="ait-list">
                        <li>It can't generate or edit the actual video footage.</li>
                        <li>It can't guarantee how the video tool interprets a prompt.</li>
                        <li>It can't judge the final footage — review every output yourself.</li>
                        <li>It doesn't know your brand or assets unless you describe them (safely).</li>
                    </ul>
                </Callout>

                <h2>Step-by-step</h2>
                <div className="ait-steps">
                    <Step n={1} title="Define the video goal">
                        <p>Tell Claude what the video is for, where it will run, and how long it should be. A 6-second social clip and a product trailer need different plans.</p>
                        <PromptExample label="Example">I need a 15-second vertical social clip introducing a cozy tea brand. Goal: build interest and get profile visits. Help me shape the concept.</PromptExample>
                    </Step>
                    <Step n={2} title="Ask Claude for a short video concept">
                        <p>Get a tight concept — the idea, the feeling, and the arc from first frame to last.</p>
                        <PromptExample label="Example">Give me a short concept for this clip: the core idea, the mood, and a simple beginning-middle-end arc.</PromptExample>
                    </Step>
                    <Step n={3} title="Generate scene-by-scene prompts">
                        <p>Break the concept into scenes and write a self-contained prompt for each shot.</p>
                        <PromptExample label="Example">Break this into 3 scenes. For each, write a self-contained prompt describing what happens on screen.</PromptExample>
                    </Step>
                    <Step n={4} title="Add visual style, camera, lighting, and mood">
                        <p>Enrich each scene prompt with the details video tools respond to — style, camera movement, lighting, and mood.</p>
                        <PromptExample label="Example">For each scene, add style (warm lifestyle), camera (slow push-in), lighting (soft morning light), and mood (calm, cozy).</PromptExample>
                    </Step>
                    <Step n={5} title="Create alternate versions for social platforms">
                        <p>Ask for format variations — vertical, square, and wide — with pacing suited to each platform.</p>
                        <PromptExample label="Example">Give me a vertical version for short-form social and a wide version for a website hero, adjusting pacing for each.</PromptExample>
                    </Step>
                    <Step n={6} title="Move the prompt into Higgsfield manually">
                        <p>Paste each scene prompt into the video tool and generate the footage. Work scene by scene so you can iterate on wording.</p>
                    </Step>
                    <Step n={7} title="Review the output and ask Claude for revisions">
                        <p>Watch what the tool produced, describe what's off, and ask Claude to revise the prompt wording accordingly.</p>
                        <PromptExample label="Example">The output felt too fast and cluttered. Rewrite the scene 2 prompt to be slower and simpler, keeping the cozy mood.</PromptExample>
                    </Step>
                    <Step n={8} title="Create captions, titles, and posting notes">
                        <p>Ask for captions, a title, and posting notes tailored to where the video will run.</p>
                        <PromptExample label="Example">Write a caption, 3 title options, and posting notes for this clip on short-form social. Keep it on-brand and clear.</PromptExample>
                    </Step>
                </div>

                <h2>Example prompts for product trailers</h2>
                <PromptExample label="Product trailer">Plan a 20-second product trailer for [product]. Give me a 3-scene arc, a self-contained prompt per scene with style/camera/lighting/mood, and a closing title idea.</PromptExample>

                <h2>Example prompts for social media videos</h2>
                <PromptExample label="Social video">Plan a 10-second vertical social clip about [topic]. Strong opening frame, one clear message, upbeat mood, and a scene-by-scene prompt set.</PromptExample>

                <h2>Example prompts for AI tutorial intro videos</h2>
                <PromptExample label="Tutorial intro">Plan a short intro clip for an AI tutorial about [topic]. Friendly, clear, and modern. Give me a scene-by-scene prompt set and on-screen text for each beat.</PromptExample>

                <h2>Example prompts for Real Estate AI and PoisonGuard promo clips</h2>
                <PromptExample label="Promo clip">Plan a short promo clip for a tool like CinNova Real Estate AI (or PoisonGuard). Focus on the outcome for the user, keep it trustworthy and clear, and give me a scene-by-scene prompt set with style, camera, lighting, and mood.</PromptExample>

                <h2>Good vs bad prompts</h2>
                <Callout tone="good" title="Good — detailed and scene-based">
                    <PromptExample>Scene 1: a steaming cup of tea on a windowsill, slow push-in, soft morning light, warm amber palette, calm mood. No visible text or logos.</PromptExample>
                </Callout>
                <Callout tone="bad" title="Bad — no direction">
                    <PromptExample>make a cool video</PromptExample>
                </Callout>

                <h2>Common mistakes</h2>
                <ul className="ait-list">
                    <li>Writing one vague prompt instead of scene-by-scene direction.</li>
                    <li>Leaving out camera, lighting, or mood, then getting random results.</li>
                    <li>Expecting Claude to produce the video instead of the prompts.</li>
                    <li>Trying to copy a specific film, brand, or protected character.</li>
                    <li>Including private people, client material, or personal data.</li>
                </ul>

                <h2>Copyright &amp; style safety</h2>
                <Callout tone="warn" title="Create original video responsibly">
                    <ul className="ait-list">
                        <li>Describe the look you want in general terms; avoid imitating a specific film or brand style.</li>
                        <li>Don't recreate trademarked characters, logos, or protected designs.</li>
                        <li>Check the latest official terms of the video tool for usage and ownership rights.</li>
                        <li>Review every generated clip before using it commercially.</li>
                    </ul>
                </Callout>

                <h2>Privacy &amp; safety</h2>
                <SafetyNote />

                <h2>FAQ</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            <RelatedGuides />
            <BackToHubCta note="Prompt writing drives AI video quality — the Claude art prompts guide and prompt writing guide are great next steps." />
        </div>
    );
}
