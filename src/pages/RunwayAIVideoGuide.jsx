// RunwayAIVideoGuide — /guides/runway-ai-video   CSS prefix: ait-
// Beginner-first, screen-aware creator tutorial matching the master template.
// Vendor-neutral; CinNova is independent of Runway. Interfaces and model names
// change, so steps describe common places and use "if you see this option"
// wording. No pricing claims, no exact feature or quality promises.
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
    { q: "Do I need video editing experience to start?", a: "No. You can generate short clips from a prompt or an image without any editing skills. If you later want to trim or add captions, you can do that in a separate editor — but it isn't required to begin." },
    { q: "Should I use text-to-video or image-to-video first?", a: "If you already have an image you're allowed to use, image-to-video gives you the most control over the look. If you only have an idea, start with text-to-video and describe the motion and style clearly." },
    { q: "Why does my video look distorted?", a: "Distortion, warping, and flicker are common in AI video, especially with fast motion, busy backgrounds, faces, or hands. Try a slower camera, a cleaner source image, and a simpler prompt, then regenerate." },
    { q: "Can I use Runway videos on my website?", a: "Sometimes, but rights depend on the current terms, your plan, and the assets you used. Check the platform's latest terms before using anything commercially, and never rely on content you don't have rights to." },
    { q: "What should I never upload to Runway?", a: "Private photos, client files, copyrighted images you don't have rights to, IDs, or identity-sensitive material. Only use images and concepts you're allowed to use." },
    { q: "How do I make a Runway video work as a website hero?", a: "Keep motion slow, leave the center area clean for headline text, avoid baked-in words or logos, export a short loop-friendly clip, and test it behind your real website text before publishing." },
    { q: "What should I learn after this guide?", a: "Compare your Runway results with Higgsfield, then build a small library of a few reliable hero and social clips for your product pages before moving into advanced cinematic workflows. The CinNova AI Tutorials hub has a creator roadmap." },
];

export default function RunwayAIVideoGuide() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="How to Use Runway for AI Video | Beginner Guide"
                description="Learn how to use Runway for AI video creation with beginner-friendly steps for setting up a video workspace, choosing a simple workflow, writing video prompts, generating clips, reviewing results, exporting videos, and avoiding common mistakes."
                pageKey="runway-ai-video-guide"
                siteUrl={siteUrl}
            />

            <TutorialHero
                eyebrow="RUNWAY · AI VIDEO · BEGINNER"
                title="How to Use Runway for AI Video"
                intro="Runway is an AI creative platform for generating and editing video. This click-by-click guide sets up a simple, organized video workflow — from your first text-to-video or image-to-video test to a website hero clip — with example prompts, safety tips, and the mistakes beginners make most."
                level="Beginner"
                minutes={14}
            />

            <section className="section ait-guide-body">
                {/* 1. What is Runway */}
                <h2>What is Runway?</h2>
                <p>
                    Runway is an AI creative platform used for video generation, image generation, editing,
                    motion tests, and creative media workflows. Depending on the current interface, creators may
                    see options for text-to-video, image-to-video, video editing, reference images, cinematic
                    motion, character/performance tools, or project workspaces.
                </p>
                <p className="ait-note-line">
                    Interfaces and model names change often, so this guide describes common places to look and
                    uses "if you see this option" wording — always check the current official screens and settings.
                    CinNova is independent and not affiliated with Runway; this is a neutral how-to guide.
                </p>

                {/* 2. What you need before starting */}
                <h2>What you need before starting</h2>
                <Callout tone="info" title="Before you start (5 minutes)">
                    <ul className="ait-list">
                        <li>A device with an internet connection.</li>
                        <li>A Runway account, if the current interface asks you to sign in.</li>
                        <li>One simple video goal (like a website hero background).</li>
                        <li>One source image or concept you are allowed to use.</li>
                        <li>A folder for prompts, source images, generated clips, exports, and screenshots.</li>
                        <li>No private, copyrighted, or sensitive material unless you have the rights.</li>
                        <li>A reminder that feature names and layouts may change.</li>
                    </ul>
                </Callout>

                {/* 3. What Runway is good for */}
                <h2>What Runway is good for</h2>
                <ul className="ait-list">
                    <li>AI video experiments.</li>
                    <li>Website hero video concepts.</li>
                    <li>Social media clips.</li>
                    <li>Product video drafts.</li>
                    <li>Mood videos.</li>
                    <li>Short cinematic scenes.</li>
                    <li>Image-to-video tests.</li>
                    <li>Visual storytelling concepts.</li>
                    <li>Creative editing experiments.</li>
                </ul>

                {/* 4. What Runway is not reliable for */}
                <h2>What Runway is not reliable for</h2>
                <Callout tone="warn" title="Set your expectations">
                    <ul className="ait-list">
                        <li>Perfect consistency every time.</li>
                        <li>Exact text or logo reproduction.</li>
                        <li>Guaranteed character consistency.</li>
                        <li>Replacing final editing.</li>
                        <li>Commercial rights without checking the terms.</li>
                        <li>Sensitive or private content handling.</li>
                        <li>High-stakes or misleading content.</li>
                        <li>Exact UI steps staying the same forever.</li>
                    </ul>
                </Callout>

                {/* 5. Create a Runway video folder */}
                <h2>Before you generate: create a Runway video folder</h2>
                <p>Set up one home folder so every prompt, source image, and export is easy to find and reuse.</p>
                <PromptExample label="Suggested folder structure">{`Runway Video Workspace/
  01 Source Images/
  02 Prompts/
  03 Generated Clips/
  04 Exports/
  05 Screenshots/
  06 Hero Videos/
  07 Social Clips/
  08 Notes/`}</PromptExample>

                {/* 6. Step-by-step beginner setup */}
                <h2>Step-by-step beginner setup</h2>
                <div className="ait-steps">
                    <Step n={1} title="Open Runway">
                        <StepDetail label="Where to look">Open your browser and go to Runway, or open the app if you use it.</StepDetail>
                        <StepDetail label="What to click">Look for "Log in", "Sign up", "Continue", "Get started", or the main workspace screen. These are commonly near the center or top-right area.</StepDetail>
                        <StepDetail label="What you should see">A dashboard, workspace, or creation screen with options to create or edit media.</StepDetail>
                        <StepDetail label="If you don't see it">Look for a sidebar, account/profile menu, or a button that says "Create", "New", "Start", or "Generate".</StepDetail>
                        <StepDetail label="Common mistake">Trying an advanced video workflow before learning one simple generation.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Runway login or main dashboard]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={2} title="Create your Runway workspace folder">
                        <StepDetail label="Where to look">On your computer, open your desktop, documents folder, or creative asset folder.</StepDetail>
                        <StepDetail label="What to create">Create a folder named "Runway Video Workspace" and add the subfolders listed above.</StepDetail>
                        <StepDetail label="What you should see">A clean folder system for prompts, source images, generated clips, exports, and screenshots.</StepDetail>
                        <StepDetail label="If you don't see it">Use any folder location you can find easily, then rename it later.</StepDetail>
                        <StepDetail label="Common mistake">Generating clips without saving the prompt, source image, or settings.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Runway Video Workspace folders]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={3} title="Pick one simple video goal">
                        <StepDetail label="Why">A clear goal keeps your first test focused. Pick one small outcome, not a whole campaign.</StepDetail>
                        <StepDetail label="Examples">Website hero background · Social media teaser · Product mood clip · Cinematic scene test · Character motion test.</StepDetail>
                        <StepDetail label="What to write">Describe the goal in one sentence so you can turn it into a prompt.</StepDetail>
                        <PromptExample label="Goal">I want to create a short AI video for [product/project]. The mood is [mood], the camera motion is [motion], and the final clip should feel [style].</PromptExample>
                        <StepDetail label="Common mistake">Trying to do everything in one clip. One goal per test is far easier to judge and improve.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Written video goal]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={4} title="Start a new creation">
                        <StepDetail label="Where to look">Look for buttons such as "Create", "New", "Generate", "Video", "Text to Video", "Image to Video", "Project", or a plus (+) icon.</StepDetail>
                        <StepDetail label="What to click">Choose the simplest video creation option available. If you see multiple tools, start with image-to-video if you already have an image, or text-to-video if you only have an idea.</StepDetail>
                        <StepDetail label="What you should see">A prompt box, upload area, project canvas, timeline, or creation panel.</StepDetail>
                        <StepDetail label="If you don't see it">Open the sidebar/menu or look for tabs such as Video, Generate, Projects, or Assets.</StepDetail>
                        <StepDetail label="Common mistake">Choosing the most advanced editor before testing one basic prompt.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: New creation / video tool panel]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={5} title="Add a source image (for image-to-video)">
                        <StepDetail label="Where to look">Look for an upload box, image area, attachment icon, plus icon, or "Upload image" button.</StepDetail>
                        <StepDetail label="What to click">Upload an image you own or are allowed to use.</StepDetail>
                        <StepDetail label="What you should see">A preview of the image inside the creation panel.</StepDetail>
                        <StepDetail label="If you don't see it">Try dragging the image into the upload area, or choose a different supported file type.</StepDetail>
                        <StepDetail label="Common mistake">Uploading copyrighted images, private photos, client files, or images you don't have permission to use.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Source image uploaded and previewed]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={6} title="Write your first Runway video prompt">
                        <StepDetail label="What to type">Describe the motion, lighting, and style — and say what to avoid (text, logos, distortion).</StepDetail>
                        <PromptExample label="Starter">Create a short cinematic video. Slow camera push-in, smooth motion, realistic lighting, clean background, professional website hero style, no text, no logos, no distorted faces, loop-friendly.</PromptExample>
                        <PromptExample label="Website hero">Cinematic hero video. Slow push-in, soft atmospheric motion, clean center for headline text, no words, no logos, loop-friendly.</PromptExample>
                        <PromptExample label="Product teaser">Short product teaser. Gentle rotation and light sweep, premium mood, clean background, no text, no logos.</PromptExample>
                        <PromptExample label="Social clip">Punchy vertical social clip. Subtle zoom and light motion, bold mood, leave room for captions added later, no baked-in text.</PromptExample>
                        <PromptExample label="Real estate visual">Calm cinematic real estate visual. Slow drifting camera, warm natural light, steady horizon, no text, no logos.</PromptExample>
                        <PromptExample label="Character motion">Character motion test. Natural, subtle movement, keep the face and proportions stable, soft lighting, plain background.</PromptExample>
                        <PromptExample label="Dark cinematic scene">Dark cinematic scene. Slow eerie motion, moody low light, atmospheric depth, no text, no distortion.</PromptExample>
                        <StepDetail label="Common mistake">Writing a long, contradictory prompt. Keep it short, name the motion, and list what to avoid.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Prompt typed into the video tool]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={7} title="Choose basic settings (if available)">
                        <StepDetail label="Where to look">Look around the prompt box or right-side panel for settings such as duration, aspect ratio, style, motion, camera, references, quality, or output size.</StepDetail>
                        <StepDetail label="What to click">Choose simple beginner settings first: short duration, a website/social-friendly aspect ratio, moderate motion, a clean visual style, and one reference image if available and appropriate.</StepDetail>
                        <StepDetail label="What you should see">Settings displayed before generation or inside the creation panel.</StepDetail>
                        <StepDetail label="If you don't see it">Skip settings and generate with the default options.</StepDetail>
                        <StepDetail label="Common mistake">Changing too many settings at once and not knowing what improved or ruined the result.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Basic generation settings]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={8} title="Generate the first draft">
                        <StepDetail label="Where to look">Find the main action button near the prompt area.</StepDetail>
                        <StepDetail label="What to click">Click "Generate", "Create", "Render", "Start", or the current equivalent.</StepDetail>
                        <StepDetail label="What you should see">A loading state, queue, progress bar, or generation card.</StepDetail>
                        <StepDetail label="If you don't see it">Check whether you need to select an image, fill the prompt box, choose a required option, or wait for the previous generation to finish.</StepDetail>
                        <StepDetail label="Common mistake">Clicking generate repeatedly before the first render finishes.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Generation in progress]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={9} title="Review the result">
                        <StepDetail label="What to check">Judge the draft against your goal before changing anything:</StepDetail>
                        <ul className="ait-list">
                            <li>Is the motion smooth?</li>
                            <li>Does the clip match the prompt?</li>
                            <li>Is the subject distorted?</li>
                            <li>Are there unwanted words or logos?</li>
                            <li>Is the camera movement too fast?</li>
                            <li>Would this work behind website text?</li>
                            <li>Does the clip need editing in another tool?</li>
                        </ul>
                        <StepDetail label="Common mistake">Keeping the first result just because it's there. Decide what to fix, then improve the prompt.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Reviewing the generated clip]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={10} title="Improve the prompt and regenerate">
                        <StepDetail label="What to change">Adjust one or two things at a time so you know what helped:</StepDetail>
                        <ul className="ait-list">
                            <li>Make the camera slower.</li>
                            <li>Keep the subject centered.</li>
                            <li>Remove words and logos.</li>
                            <li>Reduce background clutter.</li>
                            <li>Make motion smoother.</li>
                            <li>Use softer lighting.</li>
                            <li>Make it loop-friendly.</li>
                            <li>Avoid face and hand distortion.</li>
                            <li>Keep the scene simple.</li>
                        </ul>
                        <StepDetail label="Common mistake">Rewriting the whole prompt every time. Small, single changes teach you what works.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Improved prompt and new result]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={11} title="Save / export the best result">
                        <StepDetail label="Where to look">Look for "Download", "Export", "Save", "Share", or a three-dot menu near the generated clip.</StepDetail>
                        <StepDetail label="What to click">Download or save the best version.</StepDetail>
                        <StepDetail label="What you should see">A saved video file in your downloads or workspace.</StepDetail>
                        <StepDetail label="If you don't see it">Open the clip card, hover over the result, or check the three-dot menu.</StepDetail>
                        <StepDetail label="Common mistake">Leaving the page before exporting the best generation.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Download / export button]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={12} title="Organize your Runway video assets">
                        <StepDetail label="What to save">Keep everything that made the result so you can repeat or improve it: source image, final prompt, settings used, exported clip, screenshots, and notes about what worked.</StepDetail>
                        <PromptExample label="Filename examples">{`runway-hero-poisonguard-v01.mp4
runway-hero-kiddo-v01.mp4
runway-hero-real-estate-ai-v01.mp4
runway-hero-techmate-ai-v01.mp4
runway-hero-nightmare-forest-v01.mp4`}</PromptExample>
                        <StepDetail label="Common mistake">Saving the clip but not the prompt or settings, so you can't reproduce a good result later.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Organized, clearly named exports]</ScreenshotPlaceholder>
                    </Step>
                </div>

                {/* 7. Beginner workflow: website hero video */}
                <h2>Beginner workflow: website hero video</h2>
                <ul className="ait-list">
                    <li>Start with one strong image or a simple concept.</li>
                    <li>Use slow camera motion.</li>
                    <li>Avoid baked-in text and logos.</li>
                    <li>Keep the center area clean for headline text.</li>
                    <li>Make several short versions.</li>
                    <li>Test the clip behind your website text.</li>
                    <li>Save the prompt and the export together.</li>
                </ul>
                <PromptExample label="Website hero">Create a cinematic website hero video. Slow camera push-in, subtle atmospheric motion, clean center area for website text, no words, no logos, no extra objects, professional product launch mood, smooth movement, loop-friendly.</PromptExample>

                {/* 8. Beginner workflow: social media clip */}
                <h2>Beginner workflow: social media clip</h2>
                <ul className="ait-list">
                    <li>Choose a vertical or square format if available.</li>
                    <li>Use stronger motion than a website hero.</li>
                    <li>Create 3 variations to choose from.</li>
                    <li>Keep the message simple.</li>
                    <li>Add captions later in a video editor if needed.</li>
                    <li>Export and save the prompt.</li>
                </ul>

                {/* 9. Beginner workflow: CinNova product video ideas */}
                <h2>Beginner workflow: CinNova product video ideas</h2>
                <p>Generic starting prompts for different product moods — adjust the image, mood, and motion to fit your goal.</p>
                <PromptExample label="PoisonGuard">Calm, reassuring cinematic clip. Gentle protective motion, soft clean light, family-safe mood, clear center for headline text, no words, no logos.</PromptExample>
                <PromptExample label="Kiddo">Bright, playful, kid-friendly clip. Soft cheerful motion, warm colors, gentle movement, clean center for text, no words, no logos.</PromptExample>
                <PromptExample label="Real Estate AI">Professional real estate clip. Slow drifting camera, warm natural light, steady and trustworthy mood, clean center for text, no words, no logos.</PromptExample>
                <PromptExample label="TechMate AI">Clean, modern tech-support clip. Smooth subtle motion, cool calm light, helpful reassuring mood, clean center for text, no words, no logos.</PromptExample>
                <PromptExample label="Nightmare Forest">Dark fantasy game clip. Slow eerie fog motion, moody cinematic light, atmospheric depth, clean center for text, no words, no distortion.</PromptExample>

                {/* 10. Lost? Check here */}
                <h2>Lost? Check here.</h2>
                <div className="ait-faq">
                    <details className="ait-faq-item"><summary>I cannot find the Create button</summary><p>Look for "Create", "New", "Generate", "Start", or a plus (+) icon, often in the top area or a sidebar. On phones, open the menu first.</p></details>
                    <details className="ait-faq-item"><summary>My screen looks different</summary><p>Interfaces change often and vary by device. Match by purpose, not exact pixels: a way to start a creation, a prompt box, an upload area, and a generate button.</p></details>
                    <details className="ait-faq-item"><summary>I cannot find text-to-video</summary><p>Look for tabs or options like "Text to Video", "Video", "Generate", or a prompt box with no image required. If you don't see it, use the simplest video option available.</p></details>
                    <details className="ait-faq-item"><summary>I cannot find image-to-video</summary><p>Look for "Image to Video", an upload area inside a video tool, or an attach/plus icon near the prompt box. If it isn't there, start with text-to-video instead.</p></details>
                    <details className="ait-faq-item"><summary>The tool is asking me to upgrade</summary><p>You can learn the workflow with whatever is available to you. Skip the upgrade for now and revisit it only if you hit a limit that blocks your work.</p></details>
                    <details className="ait-faq-item"><summary>My video looks distorted</summary><p>Try a cleaner source image, a slower camera, and a simpler prompt. Busy scenes, fast motion, faces, and hands are the most likely to warp.</p></details>
                    <details className="ait-faq-item"><summary>The motion is too fast</summary><p>Add "slow camera motion" or "subtle movement" to the prompt, and lower any motion/strength setting if one is shown.</p></details>
                    <details className="ait-faq-item"><summary>The subject changed too much</summary><p>Add "keep the subject stable and consistent," reduce motion, and use a clearer reference image if the tool supports one.</p></details>
                    <details className="ait-faq-item"><summary>The video has unwanted text</summary><p>Add "no text, no words, no logos" to the prompt and regenerate. If text still appears, simplify the background.</p></details>
                    <details className="ait-faq-item"><summary>I cannot find the download button</summary><p>Hover over the result, open the clip card, or check a three-dot ("…") menu for Download, Export, Save, or Share.</p></details>
                    <details className="ait-faq-item"><summary>I do not know which file to save</summary><p>Save the best export plus its source image and prompt. Use a clear name like <code>runway-hero-[project]-v01.mp4</code>.</p></details>
                </div>

                {/* 11. Common beginner mistakes */}
                <h2>Common beginner mistakes</h2>
                <ul className="ait-list">
                    <li>Starting with a weak source image.</li>
                    <li>Using prompts that are too long or contradictory.</li>
                    <li>Adding text or logos into the video prompt.</li>
                    <li>Not saving prompt versions.</li>
                    <li>Not exporting the best result.</li>
                    <li>Uploading private or copyrighted images.</li>
                    <li>Expecting perfect results on the first generation.</li>
                    <li>Changing too many settings at once.</li>
                    <li>Forgetting to test hero videos on the actual website.</li>
                </ul>

                {/* 12. Prompt library */}
                <h2>Prompt library</h2>
                <PromptExample label="Basic text-to-video">Create a short cinematic video of [scene]. Slow smooth camera motion, realistic lighting, clean composition, no text, no logos, no distorted faces.</PromptExample>
                <PromptExample label="Basic image-to-video">Create a short cinematic video from this image. Slow camera push-in, smooth motion, clean background, no text, no logos, no distorted faces.</PromptExample>
                <PromptExample label="Website hero">Cinematic hero video. Slow push-in, soft atmospheric motion, clean center for headline text, no words, no logos, loop-friendly.</PromptExample>
                <PromptExample label="Product teaser">Short product teaser. Gentle rotation and light sweep, premium mood, clean background, no text, no logos.</PromptExample>
                <PromptExample label="Real estate">Calm real estate visual. Slow drifting camera, warm natural light, steady horizon, professional mood, no text, no logos.</PromptExample>
                <PromptExample label="Kid-friendly learning app">Bright, playful clip. Soft cheerful motion, warm colors, gentle movement, clean and friendly, no text, no logos.</PromptExample>
                <PromptExample label="Dark fantasy game">Dark fantasy atmosphere. Slow eerie fog motion, moody cinematic light, atmospheric depth, no text, no distortion.</PromptExample>
                <PromptExample label="Social ad">Punchy vertical social clip. Subtle zoom and light motion, bold mood, leave room for captions added later, no baked-in text.</PromptExample>
                <PromptExample label="Fix motion">Regenerate with slower, smoother camera motion and subtle movement. Keep the subject centered and stable.</PromptExample>
                <PromptExample label="Reduce artifacts">Regenerate with a cleaner, simpler background, less motion, and reduced distortion. Keep the subject sharp and stable.</PromptExample>
                <PromptExample label="Loop-friendly">Regenerate as a smooth, loop-friendly clip with gentle continuous motion and no hard cuts, so it can repeat seamlessly.</PromptExample>

                {/* 13. Final checklist */}
                <h2>Final checklist</h2>
                <Callout tone="good" title="You're set up when…">
                    <ul className="ait-list">
                        <li>I created a Runway Video Workspace folder.</li>
                        <li>I picked one video goal.</li>
                        <li>I used an image or concept I'm allowed to use.</li>
                        <li>I created one test video.</li>
                        <li>I saved the source image.</li>
                        <li>I saved the prompt.</li>
                        <li>I exported the best result.</li>
                        <li>I saved a screenshot.</li>
                        <li>I know how to improve the prompt.</li>
                        <li>I know not to upload private or copyrighted material.</li>
                        <li>I know to test hero videos behind website text.</li>
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
            <BackToHubCta note="After learning Runway basics, compare your results with Higgsfield and start building a small reusable video asset library for your product pages." />
        </div>
    );
}
