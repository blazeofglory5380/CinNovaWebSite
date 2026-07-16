// HiggsfieldWebsiteHeroVideoGuide — /guides/higgsfield-website-hero-video
// CSS prefix: ait-. Production-focused, screen-aware guide for making clean,
// loop-friendly website hero videos with Higgsfield. Evergreen, vendor-neutral;
// CinNova is independent of Higgsfield. No pricing/quality promises; "if you
// see this option" wording. Only use media CinNova has the rights to.
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
    { q: "What is a website hero video?", a: "A short visual background or featured video near the top of a page. It should support the headline, not compete with it — clean, loop-friendly, and readable behind text." },
    { q: "Should I use text-to-video or image-to-video?", a: "Image-to-video usually gives the most control for hero videos because you lock the look with an approved source image. Text-to-video works when you only have a concept." },
    { q: "How long should a hero video be?", a: "Short — a few seconds that can loop seamlessly. Long clips increase file size, slow the page, and distract from the headline." },
    { q: "Why should I avoid text inside the generated video?", a: "Baked-in words and logos are often distorted, hard to edit, and clash with your real headline. Keep the center clean and add real text in your website layout." },
    { q: "What if the video looks distorted?", a: "Distortion is common with fast motion, busy backgrounds, faces, and hands. Use a cleaner source image, slower camera motion, and a simpler prompt, then regenerate." },
    { q: "Can I use the video commercially?", a: "Sometimes, but rights depend on the current terms, your plan, and the assets you used. Check the latest official terms before commercial use, and only use media you own, created, licensed, or have permission to use." },
    { q: "What should I make after this guide?", a: "Save the winner in the CinNova Cinematic Asset Library and generate a Runway version to compare. The Higgsfield vs Runway vs Google Flow guide helps you choose." },
];

export default function HiggsfieldWebsiteHeroVideoGuide() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="How to Create Website Hero Videos with Higgsfield | AI Creator Guide"
                description="Learn how to create clean, loop-friendly website hero videos with Higgsfield for product pages, blog pages, app websites, and cinematic brand assets."
                pageKey="higgsfield-website-hero-video-guide"
                siteUrl={siteUrl}
            />

            <TutorialHero
                eyebrow="HIGGSFIELD · HERO VIDEO · CREATOR"
                title="How to Create Website Hero Videos with Higgsfield"
                intro="A hero video sits near the top of a page and supports your headline — it should be short, clean, and loop-friendly, not a distraction. This click-by-click guide produces a website-ready hero video with Higgsfield and files it into your asset library."
                level="Beginner"
                minutes={14}
            />

            <section className="section ait-guide-body">
                {/* 1. What is a website hero video */}
                <h2>What is a website hero video?</h2>
                <p>
                    A hero video is a short visual background or featured video near the top of a website page.
                    It should support the headline, not distract from it.
                </p>
                <ul className="ait-list">
                    <li>Short.</li>
                    <li>Clean.</li>
                    <li>Loop-friendly.</li>
                    <li>Readable behind text.</li>
                    <li>No baked-in text or logos.</li>
                    <li>Simple motion.</li>
                    <li>Mobile-friendly crop.</li>
                </ul>

                {/* 2. When to use Higgsfield for hero videos */}
                <h2>When to use Higgsfield for hero videos</h2>
                <ul className="ait-list">
                    <li>Product launch visuals.</li>
                    <li>Cinematic product pages.</li>
                    <li>App landing pages.</li>
                    <li>Blog hero backgrounds.</li>
                    <li>Social teaser clips.</li>
                    <li>Fast concept testing.</li>
                    <li>Cinematic mood tests.</li>
                </ul>

                {/* 3. What makes a good hero video */}
                <h2>What makes a good hero video</h2>
                <Callout tone="good" title="Hero video checklist">
                    <ul className="ait-list">
                        <li>Slow camera motion.</li>
                        <li>Clean center area.</li>
                        <li>Readable background.</li>
                        <li>No random words.</li>
                        <li>No logos unless intentionally added later.</li>
                        <li>Subtle atmosphere.</li>
                        <li>Clear product mood.</li>
                        <li>Short loop.</li>
                        <li>Works on mobile.</li>
                        <li>Does not slow the website too much.</li>
                    </ul>
                </Callout>

                {/* 4. What to avoid */}
                <h2>What to avoid</h2>
                <Callout tone="warn" title="Avoid these">
                    <ul className="ait-list">
                        <li>Too much motion.</li>
                        <li>Hard-to-read background.</li>
                        <li>Baked-in text.</li>
                        <li>Fake UI text.</li>
                        <li>Distorted people, hands, or faces.</li>
                        <li>Copyrighted images.</li>
                        <li>Private or client images.</li>
                        <li>Cluttered scenes.</li>
                        <li>Dark, unreadable visuals.</li>
                        <li>Huge video files.</li>
                        <li>Publishing without a rights check.</li>
                    </ul>
                </Callout>

                {/* 5. Folder setup */}
                <h2>Folder setup</h2>
                <p>
                    Keep this work inside the <strong>CinNova Cinematic Asset Library</strong> so every hero
                    video, source image, and prompt has a home.
                </p>
                <PromptExample label="Recommended folders">{`CinNova Cinematic Asset Library/
  03 Hero Videos/
  04 Product Pages/
    PoisonGuard/
      03 Higgsfield Tests/
      05 Final Hero Images/
      06 Final Hero Videos/
      10 Notes/
    Kiddo/
    Real Estate AI/
    TechMate AI/
    Nightmare Forest/`}</PromptExample>

                {/* 6. Step-by-step */}
                <h2>Step-by-step Higgsfield hero video workflow</h2>
                <div className="ait-steps">
                    <Step n={1} title="Choose the product page">
                        <StepDetail label="What to do">Pick one page to make a hero for: PoisonGuard, Kiddo, Real Estate AI, TechMate AI, Nightmare Forest, AI Tutorials, or CinNova Core.</StepDetail>
                        <StepDetail label="Why">One page per pass keeps the mood focused and the files organized.</StepDetail>
                        <StepDetail label="Common mistake">Trying to make heroes for every product in one session.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Chosen product page]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={2} title="Define the hero goal">
                        <StepDetail label="What to write">Note the product name, target audience, emotion, mood, camera motion, and what must stay clear for headline text.</StepDetail>
                        <StepDetail label="What you should see">A one-paragraph brief you can turn into a prompt.</StepDetail>
                        <StepDetail label="Common mistake">Generating before deciding what area of the frame must stay clean for text.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Hero goal brief]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={3} title="Choose or create a source image">
                        <StepDetail label="What to do">Select or make a source image and save it in the product's Source Images folder.</StepDetail>
                        <StepDetail label="Rights">Use only images CinNova owns, created, licensed, or has permission to use.</StepDetail>
                        <StepDetail label="Common mistake">Using a copyrighted, private, or client image you don't have rights to.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Approved source image]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={4} title="Open Higgsfield">
                        <StepDetail label="Where to look">Open the Higgsfield dashboard in your browser or app.</StepDetail>
                        <StepDetail label="What to click">Look for Create, Video, Image to Video, Cinema, Canvas, Presets, or the equivalent.</StepDetail>
                        <StepDetail label="What you should see">A prompt area, upload area, project screen, or generation workspace.</StepDetail>
                        <StepDetail label="If you don't see it">Look in the sidebar/menu or use the simplest available video creation option.</StepDetail>
                        <StepDetail label="Common mistake">Opening an advanced studio workflow before testing one basic hero prompt.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Higgsfield dashboard or creation screen]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={5} title="Upload the source image (for image-to-video)">
                        <StepDetail label="Where to look">Look for an upload box, plus icon, image area, attachment button, or a drag-and-drop area.</StepDetail>
                        <StepDetail label="What to click">Add your approved source image.</StepDetail>
                        <StepDetail label="What you should see">A preview of the image inside the creation panel.</StepDetail>
                        <StepDetail label="If you don't see it">Try dragging the image in, or choose a different supported file type.</StepDetail>
                        <StepDetail label="Common mistake">Uploading a final website screenshot that already has text on it.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Source image uploaded]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={6} title="Write the first hero prompt">
                        <StepDetail label="What to type">Describe slow motion and a clean center, and say what to avoid.</StepDetail>
                        <PromptExample label="First hero prompt">Create a cinematic website hero video from this image. Slow camera push-in, subtle atmospheric motion, clean center area for headline text, no words, no logos, professional product launch mood, smooth movement, loop-friendly.</PromptExample>
                        <StepDetail label="Common mistake">Writing a long, contradictory prompt. Keep it short and name the motion.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Hero prompt typed in]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={7} title="Choose simple settings (if available)">
                        <StepDetail label="Where to look">Around the prompt box or a side panel for duration, motion, aspect ratio, style, or quality.</StepDetail>
                        <StepDetail label="What to click">Short duration, slow/moderate motion, a horizontal aspect ratio for the website (vertical/square only for social variations), a clean style, and avoid heavy camera shake.</StepDetail>
                        <StepDetail label="If you don't see it">Skip settings and generate with the defaults.</StepDetail>
                        <StepDetail label="Common mistake">Changing many settings at once so you can't tell what helped.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Simple generation settings]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={8} title="Generate version 1">
                        <StepDetail label="What to click">Click Generate, Create, Render, or Start.</StepDetail>
                        <StepDetail label="What you should see">A loading state, queue, preview card, or finished video.</StepDetail>
                        <StepDetail label="If you don't see it">Check whether you still need to select the image, fill the prompt, or wait for a previous render.</StepDetail>
                        <StepDetail label="Common mistake">Clicking generate over and over before the first result finishes.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Generation in progress]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={9} title="Review the hero video">
                        <StepDetail label="What to check">Judge it as a background for a headline:</StepDetail>
                        <ul className="ait-list">
                            <li>Can headline text sit on top?</li>
                            <li>Is the center clean?</li>
                            <li>Is the motion too fast?</li>
                            <li>Any unwanted words or logos?</li>
                            <li>Any distortion?</li>
                            <li>Does it match the product?</li>
                            <li>Could it loop?</li>
                        </ul>
                        <StepDetail label="Common mistake">Judging the clip on its own instead of imagining text over it.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Reviewing the hero clip]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={10} title="Create 3 better variations">
                        <StepDetail label="What to change">Adjust one direction at a time so you learn what works:</StepDetail>
                        <ul className="ait-list">
                            <li>Slower camera.</li>
                            <li>Cleaner background.</li>
                            <li>Less motion.</li>
                            <li>Brighter lighting.</li>
                            <li>Darker cinematic mood.</li>
                            <li>More product-focused.</li>
                            <li>More friendly.</li>
                            <li>More premium.</li>
                            <li>More atmospheric.</li>
                        </ul>
                        <StepDetail label="Common mistake">Only generating one version, so you can't tell if it's actually good.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Variations compared]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={11} title="Export and name the best version">
                        <StepDetail label="What to do">Download the best clip and give it a clear, consistent name.</StepDetail>
                        <PromptExample label="Filename examples">{`poisonguard-hero-video-higgsfield-v01.mp4
kiddo-hero-video-higgsfield-v01.mp4
real-estate-ai-hero-video-higgsfield-v01.mp4
techmate-ai-hero-video-higgsfield-v01.mp4
nightmare-forest-hero-video-higgsfield-v01.mp4`}</PromptExample>
                        <StepDetail label="Common mistake">Leaving the page before exporting, or saving as final-final-new.mp4.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Exported and named hero video]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={12} title="Save the prompt, screenshot, and notes">
                        <StepDetail label="What to save">Keep everything needed to reproduce or improve the result:</StepDetail>
                        <ul className="ait-list">
                            <li>Source image.</li>
                            <li>Prompt.</li>
                            <li>Settings.</li>
                            <li>Exported video.</li>
                            <li>Screenshot.</li>
                            <li>Notes.</li>
                            <li>Next action.</li>
                        </ul>
                        <StepDetail label="Common mistake">Saving the video but not the prompt, so a good result can't be repeated.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Prompt, screenshot, and notes saved]</ScreenshotPlaceholder>
                    </Step>
                </div>

                {/* 7. Product-specific hero prompts */}
                <h2>Product-specific hero prompts</h2>
                <PromptExample label="PoisonGuard">Cinematic website hero video from this image. Slow push-in, clean, trustworthy, modern safety mood, subtle motion, clean center for headline text, no words, no logos, no scary poison visuals, no gore.</PromptExample>
                <PromptExample label="Kiddo">Cinematic website hero video from this image. Bright, friendly, playful learning mood, soft gentle motion, safe child-friendly style, clean center for text, no words, no logos, no chaos or scary imagery.</PromptExample>
                <PromptExample label="Real Estate AI">Cinematic website hero video from this image. Polished property/business mood, clean lighting, slow trustworthy motion, clean center for text, no words, no logos, no fake addresses or financial promises.</PromptExample>
                <PromptExample label="TechMate AI">Cinematic website hero video from this image. Modern, helpful tech-support mood, calm smooth motion, clean workspace, clean center for text, no words, no logos, no confusing UI clutter.</PromptExample>
                <PromptExample label="Nightmare Forest">Cinematic website/game hero video from this image. Dark fantasy forest, fog, moonlight, atmospheric motion, clean center for text, no words, no distortion, no excessive gore, not too dark to read.</PromptExample>
                <PromptExample label="AI Tutorials">Cinematic website hero video from this image. Clean learning interface, friendly tech visuals, organized workspace, soft motion, clean center for text, no words, no fake logos, no unreadable text.</PromptExample>
                <PromptExample label="CinNova Core">Cinematic website hero video from this image. Connected AI ecosystem, polished city/technology atmosphere, smooth motion, clean center for text, no words, no logos. (Do not replace the current homepage hero unless explicitly approved.)</PromptExample>

                {/* 8. Website hero QA checklist */}
                <h2>Website hero QA checklist</h2>
                <Callout tone="good" title="Before it ships">
                    <ul className="ait-list">
                        <li>Text readable.</li>
                        <li>Works with a dark overlay.</li>
                        <li>Works on mobile crop.</li>
                        <li>Motion is not distracting.</li>
                        <li>No unwanted text or logos.</li>
                        <li>No distorted subjects.</li>
                        <li>Correct product mood.</li>
                        <li>Saved prompt.</li>
                        <li>Saved source image.</li>
                        <li>Exported final.</li>
                        <li>File named correctly.</li>
                        <li>Rights/safety checked.</li>
                    </ul>
                </Callout>

                {/* 9. How to test hero video on website */}
                <h2>How to test the hero video on the website</h2>
                <ul className="ait-list">
                    <li>Test it behind headline text.</li>
                    <li>Test on desktop and mobile.</li>
                    <li>Check the crop at different sizes.</li>
                    <li>Check loading and file size.</li>
                    <li>Compare it against a still-image fallback.</li>
                    <li>Keep the original homepage hero untouched unless approved.</li>
                </ul>

                {/* 10. How many versions to create */}
                <h2>How many versions to create</h2>
                <ul className="ait-list">
                    <li>3 rough tests.</li>
                    <li>2 refined versions.</li>
                    <li>1 final export.</li>
                    <li>1 still-image fallback.</li>
                </ul>

                {/* 11. Prompt library */}
                <h2>Prompt library</h2>
                <PromptExample label="Universal hero video">Cinematic website hero video from this image. Slow push-in, subtle atmospheric motion, clean center for headline text, no words, no logos, loop-friendly.</PromptExample>
                <PromptExample label="Slow camera">Regenerate with a slower, smoother camera push-in and subtle movement. Keep the subject centered and stable.</PromptExample>
                <PromptExample label="Clean center">Regenerate keeping the center area clean and simple so website headline text stays readable on top.</PromptExample>
                <PromptExample label="Loop-friendly">Regenerate as a smooth, loop-friendly clip with gentle continuous motion and no hard cuts.</PromptExample>
                <PromptExample label="Remove text/logos">Regenerate with no words, no letters, and no logos anywhere in the frame.</PromptExample>
                <PromptExample label="Reduce motion">Regenerate with less overall motion and a calmer, steadier camera.</PromptExample>
                <PromptExample label="Product launch">Cinematic product launch hero from this image. Premium mood, soft light sweep, slow motion, clean center for text, no words, no logos.</PromptExample>
                <PromptExample label="Blog hero">Calm blog hero background from this image. Gentle motion, soft light, clean space for a title, no words, no logos, loop-friendly.</PromptExample>
                <PromptExample label="Social teaser variation">Vertical social teaser from this image. Slightly stronger motion, bold mood, room for captions added later, no baked-in text.</PromptExample>
                <PromptExample label="Website fallback still">Create a clean still hero image from this concept. Clear center for headline text, no words, no logos, professional product mood.</PromptExample>

                {/* 12. Common mistakes */}
                <h2>Common mistakes</h2>
                <ul className="ait-list">
                    <li>Using too much text in the prompt.</li>
                    <li>Using a cluttered source image.</li>
                    <li>Making the video too fast.</li>
                    <li>Ignoring the mobile crop.</li>
                    <li>Forgetting to save prompt versions.</li>
                    <li>Exporting only one version.</li>
                    <li>Using copyrighted or private images.</li>
                    <li>Replacing a working hero without testing.</li>
                </ul>

                {/* 13. Final checklist */}
                <h2>Final checklist</h2>
                <Callout tone="good" title="Hero video ready when…">
                    <ul className="ait-list">
                        <li>Product selected.</li>
                        <li>Source image saved.</li>
                        <li>Higgsfield test created.</li>
                        <li>3 variations generated.</li>
                        <li>Best version exported.</li>
                        <li>Still fallback saved.</li>
                        <li>Prompt saved.</li>
                        <li>Screenshot saved.</li>
                        <li>QA completed.</li>
                        <li>Rights/safety checked.</li>
                        <li>Ready to test on the product page.</li>
                    </ul>
                </Callout>

                {/* Safety */}
                <h2>Safety note</h2>
                <Callout tone="bad" title="Only use media you have the rights to">
                    <p>Don't upload private photos, client files, IDs, identity-sensitive material, or copyrighted images you don't have permission to use. Check the platform's current terms before using generated video commercially.</p>
                </Callout>
                <SafetyNote />

                {/* 14. FAQ */}
                <h2>FAQ</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            {/* 15. Related guides */}
            <RelatedGuides />
            <BackToHubCta note="After creating your first Higgsfield hero video, save it inside the CinNova Cinematic Asset Library and compare it with a Runway version." />
        </div>
    );
}
