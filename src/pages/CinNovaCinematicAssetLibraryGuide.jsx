// CinNovaCinematicAssetLibraryGuide — /?page=cinnova-cinematic-asset-library-guide
// CSS prefix: ait-. A practical production-workflow guide for organizing a
// reusable cinematic asset library across CinNova products. Evergreen, neutral.
// Only use assets CinNova owns, created, licensed, or has permission to use.
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

const PRODUCTS = [
    { name: "PoisonGuard", mood: "Clean, trustworthy, modern safety, subtle motion.", assets: "Website hero still + video, blog safety hero, social awareness clip.", tool: "Higgsfield", avoid: "Scary poison visuals, medical claims, gore, unsafe instructions." },
    { name: "Kiddo", mood: "Bright, friendly, playful, educational, gentle motion.", assets: "Website hero still + video, blog learning hero, friendly social clip.", tool: "Higgsfield", avoid: "Chaotic visuals, scary scenes, unsafe child-related imagery." },
    { name: "Real Estate AI", mood: "Polished, cinematic property/business, trust, clean dashboards.", assets: "Website hero still + video, blog automation hero, property/business social clip.", tool: "Runway", avoid: "Fake addresses, unrealistic financial promises, cluttered UI." },
    { name: "TechMate AI", mood: "Modern support, helpful AI, clean tech visuals, calm motion.", assets: "Website hero still + video, blog tech-support hero, automation social clip.", tool: "Runway", avoid: "Overly robotic looks, confusing UI, too much text." },
    { name: "Nightmare Forest", mood: "Dark fantasy, fog, moonlight, cinematic, atmospheric motion.", assets: "Game hero still, cinematic boss teaser, dark forest mood clip, blog/game asset.", tool: "Higgsfield or Runway", avoid: "Excessive gore, unreadable darkness, copied game styles." },
    { name: "CinNova AI Tutorials", mood: "Clean learning, organized interface, friendly tech visuals.", assets: "Tutorial hub hero, weekly thumbnails, platform guide thumbnails, YouTube path hero.", tool: "Higgsfield or Runway", avoid: "Clutter, fake logos, unreadable text." },
    { name: "CinNova Core", mood: "Cinematic city/AI ecosystem, polished, connected products.", assets: "Ecosystem hero still, ecosystem animation concept, brand story clip.", tool: "Higgsfield or Runway", avoid: "Changing the current homepage hero unless explicitly approved." },
];

const TRACKER_ROWS = [
    ["PoisonGuard", "Website hero video", "Higgsfield", "poisonguard-hero-video-higgsfield-v01.mp4", "To do", "High", "Trustworthy, slow motion"],
    ["Kiddo", "Website hero video", "Higgsfield", "kiddo-hero-video-higgsfield-v01.mp4", "To do", "High", "Bright, gentle motion"],
    ["Real Estate AI", "Social clip", "Runway", "real-estate-ai-social-clip-runway-v01.mp4", "To do", "Medium", "Polished, trustworthy"],
    ["TechMate AI", "Product hero still", "—", "techmate-ai-product-hero-v01.webp", "To do", "Medium", "Clean, modern"],
    ["Nightmare Forest", "Boss teaser", "Higgsfield/Runway", "nightmare-forest-boss-teaser-v01.mp4", "To do", "Low", "Dark fantasy, atmospheric"],
    ["AI Tutorials", "YouTube path hero", "—", "ai-tutorials-youtube-learning-path-v01.webp", "To do", "Medium", "Clean learning visual"],
    ["CinNova Core", "Ecosystem hero still", "—", "cinnova-core-ecosystem-hero-v01.webp", "To do", "Low", "Do not touch live homepage hero"],
];

const FAQ_ITEMS = [
    { q: "Why do I need an asset library?", a: "Without one, images and videos get lost, prompts can't be reused, product style drifts, and every new page takes longer. A library lets CinNova reuse visual direction across the website, blog, tutorials, products, and social." },
    { q: "Should I start with images or videos?", a: "Start with one strong source image, then generate a short hero video from it. Images are faster to lock down and give your videos a consistent look." },
    { q: "Should I use Higgsfield or Runway first?", a: "Either works. Many people generate a quick concept in Higgsfield, then a second option in Runway, and compare. Save both prompts and pick the cleanest loop." },
    { q: "How many versions should I create?", a: "About three per goal is a good start — enough to compare without drowning in files. Keep the winner and one runner-up, and archive the rest." },
    { q: "What file names should I use?", a: "Lowercase with hyphens: product name, asset type, tool (if relevant), then version — like poisonguard-hero-video-higgsfield-v01.mp4. Avoid vague names like final-final-new.mp4." },
    { q: "Can I use AI-generated assets commercially?", a: "Sometimes, but rights depend on each tool's current terms, your plan, and the assets you used. Check the latest official terms before commercial use, and only use media you own, created, licensed, or have permission to use." },
    { q: "What should I build after the asset library?", a: "Use the Higgsfield and Runway beginner guides to create the first product hero videos, then wire the best ones into your product pages. The CinNova AI Tutorials hub has the full creator roadmap." },
];

export default function CinNovaCinematicAssetLibraryGuide() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="Build the CinNova Cinematic Asset Library | AI Creator Workflow"
                description="Plan and organize a cinematic AI asset library for CinNova products, including website hero images, hero videos, social clips, prompt versions, source images, exports, screenshots, naming conventions, and quality checklists."
                pageKey="cinnova-cinematic-asset-library-guide"
                siteUrl={siteUrl}
            />

            <TutorialHero
                eyebrow="CINNOVA · CREATOR WORKFLOW"
                title="Build the CinNova Cinematic Asset Library"
                intro="A reusable, organized system for every CinNova product's images, videos, prompts, source files, exports, and notes. This guide sets up the folders, naming, and production workflow so visual direction stays consistent across the website, blog, tutorials, and social."
                level="Intermediate"
                minutes={16}
            />

            <section className="section ait-guide-body">
                {/* 1. What is it */}
                <h2>What is the CinNova Cinematic Asset Library?</h2>
                <p>
                    It is a reusable, organized collection of images, videos, prompts, source files, exports,
                    thumbnails, screenshots, and notes for every CinNova product and tutorial track.
                </p>
                <ul className="ait-list">
                    <li>Product website hero assets.</li>
                    <li>App/website hero assets.</li>
                    <li>Blog hero images.</li>
                    <li>Tutorial thumbnails.</li>
                    <li>Social media clips.</li>
                    <li>Cinematic video backgrounds.</li>
                    <li>Source images.</li>
                    <li>Prompt versions.</li>
                    <li>Exported files.</li>
                    <li>Notes about what worked.</li>
                </ul>

                {/* 2. Why this matters */}
                <h2>Why this matters</h2>
                <p>
                    Without an asset library, images and videos get lost, prompts can't be reused, product style
                    becomes inconsistent, and every new page takes longer. With a library, CinNova can reuse
                    visual direction across the website, blog, tutorials, products, and social media.
                </p>

                {/* 3. Products included */}
                <h2>Products included</h2>
                <div className="ait-cmp-grid">
                    {PRODUCTS.map((p) => (
                        <div className="ait-cmp-card" key={p.name}>
                            <h3>{p.name}</h3>
                            <p><strong>Visual mood:</strong> {p.mood}</p>
                            <p><strong>Asset types needed:</strong> {p.assets}</p>
                            <p><strong>Best first AI video tool:</strong> {p.tool}</p>
                            <p><strong>What to avoid:</strong> {p.avoid}</p>
                        </div>
                    ))}
                </div>

                {/* 4. Asset types to create */}
                <h2>Asset types to create</h2>
                <ul className="ait-list">
                    <li>Website hero still image.</li>
                    <li>Website hero video.</li>
                    <li>App/product hero image.</li>
                    <li>Blog hero image.</li>
                    <li>Tutorial thumbnail.</li>
                    <li>Social post image.</li>
                    <li>Social video clip.</li>
                    <li>Product teaser video.</li>
                    <li>Character/object reference image (if needed).</li>
                    <li>Prompt template.</li>
                    <li>Exported final asset.</li>
                    <li>Screenshot proof.</li>
                </ul>

                {/* 5. Folder structure */}
                <h2>Folder structure</h2>
                <PromptExample label="Main library">{`CinNova Cinematic Asset Library/
  00 Brand System/
  01 Shared Prompts/
  02 Source Images/
  03 Hero Videos/
  04 Product Pages/
    PoisonGuard/
    Kiddo/
    Real Estate AI/
    TechMate AI/
    Nightmare Forest/
    AI Tutorials/
    CinNova Core/
  05 Blog Assets/
  06 Social Clips/
  07 Exports/
  08 Screenshots/
  09 Archive/
  10 Notes and QA/`}</PromptExample>
                <PromptExample label="Inside each product folder">{`Product Name/
  01 Source Images/
  02 Prompts/
  03 Higgsfield Tests/
  04 Runway Tests/
  05 Final Hero Images/
  06 Final Hero Videos/
  07 Blog Images/
  08 Social Clips/
  09 Screenshots/
  10 Notes/`}</PromptExample>

                {/* 6. Naming convention */}
                <h2>Naming convention</h2>
                <PromptExample label="Examples">{`poisonguard-hero-video-higgsfield-v01.mp4
poisonguard-hero-still-v01.webp
kiddo-blog-hero-learning-v01.webp
real-estate-ai-social-clip-runway-v01.mp4
techmate-ai-product-hero-v01.webp
nightmare-forest-boss-teaser-v01.mp4
ai-tutorials-youtube-learning-path-v01.webp`}</PromptExample>
                <ul className="ait-list">
                    <li>Product name first.</li>
                    <li>Asset type second.</li>
                    <li>Tool if relevant.</li>
                    <li>Version number last.</li>
                    <li>Use lowercase and hyphens.</li>
                    <li>Do not use vague names like <code>final-final-new.mp4</code>.</li>
                </ul>

                {/* 7. Production workflow */}
                <h2>Production workflow</h2>
                <div className="ait-steps">
                    <Step n={1} title="Create the main asset library folder">
                        <StepDetail label="Where to look">Open your computer's desktop, documents folder, or project drive.</StepDetail>
                        <StepDetail label="What to create">Create a folder named "CinNova Cinematic Asset Library".</StepDetail>
                        <StepDetail label="What you should see">A clean main folder that will hold all source images, prompts, video tests, exports, and screenshots.</StepDetail>
                        <StepDetail label="If you don't see it">Use any easy-to-find location first, then move it later.</StepDetail>
                        <StepDetail label="Common mistake">Saving assets in Downloads and losing the source files.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Main Cinematic Asset Library folder]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={2} title="Create product subfolders">
                        <StepDetail label="What to create">Inside the library, create folders for PoisonGuard, Kiddo, Real Estate AI, TechMate AI, Nightmare Forest, AI Tutorials, and CinNova Core.</StepDetail>
                        <StepDetail label="What you should see">One folder per product, each ready for its own source images, tests, and finals.</StepDetail>
                        <StepDetail label="If you don't see it">Copy the "inside each product folder" structure above into each one.</StepDetail>
                        <StepDetail label="Common mistake">Mixing products together so you can't tell which asset belongs where.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Product subfolders]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={3} title="Create prompt and notes documents">
                        <StepDetail label="What to create">Add four documents to the library: Master Prompt Library, Product Visual Notes, Asset QA Checklist, and Export Log.</StepDetail>
                        <StepDetail label="What you should see">A place to store reusable prompts, per-product notes, a quality checklist, and a record of exports.</StepDetail>
                        <StepDetail label="Common mistake">Keeping prompts only in chat history instead of your own documents.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Prompt and notes documents]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={4} title="Pick one product to start with">
                        <StepDetail label="What to do">Start with PoisonGuard or Kiddo — they already have clear visual direction, so your first assets come together faster.</StepDetail>
                        <StepDetail label="Common mistake">Trying to produce assets for all seven products at once.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Chosen starting product]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={5} title="Define the product mood">
                        <StepDetail label="What to write">Fill a simple mood sheet before generating anything:</StepDetail>
                        <ul className="ait-list">
                            <li>Audience.</li>
                            <li>Emotion.</li>
                            <li>Colors.</li>
                            <li>Lighting.</li>
                            <li>Motion style.</li>
                            <li>What to avoid.</li>
                        </ul>
                        <StepDetail label="Common mistake">Generating first and deciding the mood later, which leads to inconsistent assets.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Product mood sheet]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={6} title="Create or choose a source image">
                        <StepDetail label="What to do">Use an image you own, generated, licensed, or have permission to use. Save it in the product's 01 Source Images folder.</StepDetail>
                        <StepDetail label="Common mistake">Using copyrighted, private, or client images you don't have rights to.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Approved source image]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={7} title="Generate the first hero video in Higgsfield">
                        <StepDetail label="What to do">Follow the Higgsfield setup guide to generate a first hero video from your source image.</StepDetail>
                        <PromptExample label="Higgsfield">Create a cinematic website hero video from this image. Slow camera push-in, clean center area for headline text, no words, no logos, subtle atmospheric motion, professional product launch mood, loop-friendly.</PromptExample>
                        <StepDetail label="Common mistake">Baking text or logos into the video instead of leaving room for real website headings.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Higgsfield hero test]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={8} title="Generate a second hero option in Runway">
                        <StepDetail label="What to do">Follow the Runway guide to generate a second option so you have something to compare.</StepDetail>
                        <PromptExample label="Runway">Create a short cinematic website hero clip. Smooth slow camera push-in, clean modern background, no text, no logos, subtle motion, realistic lighting, professional product page style, loop-friendly.</PromptExample>
                        <StepDetail label="Common mistake">Only ever generating one option, so you can't tell if it's actually good.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Runway hero test]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={9} title="Compare both video outputs">
                        <StepDetail label="What to check">Put the two side by side and judge:</StepDetail>
                        <ul className="ait-list">
                            <li>Clarity.</li>
                            <li>Motion.</li>
                            <li>Artifacts.</li>
                            <li>Brand fit.</li>
                            <li>Text readability.</li>
                            <li>Loop quality.</li>
                            <li>File size / export quality.</li>
                        </ul>
                        <StepDetail label="Common mistake">Choosing the flashier clip over the one that actually works behind headline text.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Side-by-side comparison]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={10} title="Save the winning asset and the runner-up">
                        <StepDetail label="What to save">Save both the final export and its prompt for the winner and the runner-up, in the product's final folders.</StepDetail>
                        <StepDetail label="Common mistake">Deleting the runner-up — it's often useful for social or a future page.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Saved winner + runner-up]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={11} title="Test the asset on the website or a mockup">
                        <StepDetail label="What to do">Place the video or image behind a headline, or use a local preview. Check readability, motion, loading, mobile crop, and whether text stays clear.</StepDetail>
                        <StepDetail label="Common mistake">Approving a clip in isolation, then finding the text is unreadable once it's on the page.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Asset tested behind headline]</ScreenshotPlaceholder>
                    </Step>

                    <Step n={12} title="Update the asset tracker">
                        <StepDetail label="What to record">Log the work so the library stays usable:</StepDetail>
                        <ul className="ait-list">
                            <li>Product.</li>
                            <li>Asset type.</li>
                            <li>Tool used.</li>
                            <li>Prompt version.</li>
                            <li>File name.</li>
                            <li>Status.</li>
                            <li>Notes.</li>
                            <li>Next action.</li>
                        </ul>
                        <StepDetail label="Common mistake">Finishing an asset but never recording it, so nobody knows what exists.</StepDetail>
                        <ScreenshotPlaceholder>[SCREENSHOT PLACEHOLDER: Updated asset tracker]</ScreenshotPlaceholder>
                    </Step>
                </div>

                {/* 8. Product-specific asset plan */}
                <h2>Product-specific asset plan</h2>

                <h3>PoisonGuard</h3>
                <ul className="ait-list">
                    <li>Website hero still.</li>
                    <li>Website hero video.</li>
                    <li>Blog safety hero.</li>
                    <li>Social awareness clip.</li>
                    <li><strong>Prompt direction:</strong> clean, trustworthy, modern safety, subtle motion.</li>
                    <li><strong>Avoid:</strong> scary poison visuals, medical claims, gore, unsafe instructions.</li>
                </ul>

                <h3>Kiddo</h3>
                <ul className="ait-list">
                    <li>Website hero still.</li>
                    <li>Website hero video.</li>
                    <li>Blog learning hero.</li>
                    <li>Friendly social clip.</li>
                    <li><strong>Prompt direction:</strong> bright, friendly, playful, educational, gentle motion.</li>
                    <li><strong>Avoid:</strong> chaotic visuals, scary scenes, unsafe child-related imagery.</li>
                </ul>

                <h3>Real Estate AI</h3>
                <ul className="ait-list">
                    <li>Website hero still.</li>
                    <li>Website hero video.</li>
                    <li>Blog real estate automation hero.</li>
                    <li>Property/business social clip.</li>
                    <li><strong>Prompt direction:</strong> polished, cinematic property/business, trust, clean dashboards.</li>
                    <li><strong>Avoid:</strong> fake addresses, unrealistic financial promises, cluttered UI.</li>
                </ul>

                <h3>TechMate AI</h3>
                <ul className="ait-list">
                    <li>Website hero still.</li>
                    <li>Website hero video.</li>
                    <li>Blog tech support hero.</li>
                    <li>Modern automation social clip.</li>
                    <li><strong>Prompt direction:</strong> modern support, helpful AI, clean tech visuals, calm motion.</li>
                    <li><strong>Avoid:</strong> overly robotic, confusing UI, too much text.</li>
                </ul>

                <h3>Nightmare Forest</h3>
                <ul className="ait-list">
                    <li>Website/game hero still.</li>
                    <li>Cinematic boss teaser.</li>
                    <li>Dark forest mood clip.</li>
                    <li>Blog/game dev asset image.</li>
                    <li><strong>Prompt direction:</strong> dark fantasy, fog, moonlight, cinematic, atmospheric motion.</li>
                    <li><strong>Avoid:</strong> excessive gore, unreadable darkness, copied game styles.</li>
                </ul>

                <h3>AI Tutorials</h3>
                <ul className="ait-list">
                    <li>Tutorial hub hero.</li>
                    <li>Weekly tutorial thumbnails.</li>
                    <li>Platform guide thumbnails.</li>
                    <li>YouTube learning path hero.</li>
                    <li><strong>Prompt direction:</strong> clean learning, organized interface, friendly tech visuals.</li>
                    <li><strong>Avoid:</strong> clutter, fake logos, unreadable text.</li>
                </ul>

                <h3>CinNova Core</h3>
                <ul className="ait-list">
                    <li>Ecosystem hero still.</li>
                    <li>Product ecosystem animation concept.</li>
                    <li>Brand story clip.</li>
                    <li><strong>Prompt direction:</strong> cinematic city/AI ecosystem, polished, connected products.</li>
                    <li><strong>Avoid:</strong> changing the current homepage hero unless explicitly approved.</li>
                </ul>

                {/* 9. Asset tracker table */}
                <h2>Asset tracker</h2>
                <div className="ait-cmp-table-wrap">
                    <table className="ait-cmp-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Asset</th>
                                <th>Tool</th>
                                <th>File name</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TRACKER_ROWS.map((row) => (
                                <tr key={row[3]}>
                                    {row.map((cell, i) => <td key={i}>{cell}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 10. Prompt library */}
                <h2>Prompt library</h2>
                <PromptExample label="Universal website hero">Cinematic website hero video from this image. Slow push-in, subtle atmospheric motion, clean center for headline text, no words, no logos, loop-friendly.</PromptExample>
                <PromptExample label="Universal product teaser">Short product teaser from this image. Gentle motion and light sweep, premium mood, clean background, no text, no logos.</PromptExample>
                <PromptExample label="PoisonGuard">Calm, reassuring safety hero from this image. Gentle protective motion, soft clean light, trustworthy family-safe mood, clear center for text, no words, no logos.</PromptExample>
                <PromptExample label="Kiddo">Bright, playful, kid-friendly hero from this image. Soft cheerful motion, warm colors, gentle movement, clean center for text, no words, no logos.</PromptExample>
                <PromptExample label="Real Estate AI">Professional real estate hero from this image. Slow drifting camera, warm natural light, steady trustworthy mood, clean center for text, no words, no logos.</PromptExample>
                <PromptExample label="TechMate AI">Clean, modern tech-support hero from this image. Smooth subtle motion, cool calm light, helpful reassuring mood, clean center for text, no words, no logos.</PromptExample>
                <PromptExample label="Nightmare Forest">Dark fantasy game hero from this image. Slow eerie fog motion, moody cinematic light, atmospheric depth, clean center for text, no words, no distortion.</PromptExample>
                <PromptExample label="AI Tutorials">Clean, friendly learning hero from this image. Soft organized motion, bright approachable light, calm educational mood, clean center for text, no words, no logos.</PromptExample>
                <PromptExample label="Fix motion">Regenerate with slower, smoother camera motion and subtle movement. Keep the subject centered and stable.</PromptExample>
                <PromptExample label="Clean center">Regenerate keeping the center area clean and simple so website headline text stays readable on top.</PromptExample>
                <PromptExample label="Loop-friendly">Regenerate as a smooth, loop-friendly clip with gentle continuous motion and no hard cuts.</PromptExample>

                {/* 11. Quality checklist */}
                <h2>Quality checklist</h2>
                <Callout tone="good" title="Before an asset is 'done'">
                    <ul className="ait-list">
                        <li>Does it fit the product?</li>
                        <li>Can website text sit on top?</li>
                        <li>Is the motion too distracting?</li>
                        <li>Is there unwanted text?</li>
                        <li>Is the subject distorted?</li>
                        <li>Does it work on mobile?</li>
                        <li>Is the file named correctly?</li>
                        <li>Did we save the prompt?</li>
                        <li>Did we save the source image?</li>
                        <li>Do we have rights to use it?</li>
                        <li>Did we save a screenshot?</li>
                        <li>Is it ready for website/blog/social?</li>
                    </ul>
                </Callout>

                {/* 12. Safety and rights checklist */}
                <h2>Safety &amp; rights checklist</h2>
                <Callout tone="bad" title="Rights and safety">
                    <ul className="ait-list">
                        <li>Do not upload private photos.</li>
                        <li>Do not upload client files without permission.</li>
                        <li>Do not use copyrighted images unless licensed.</li>
                        <li>Do not use someone's likeness without permission.</li>
                        <li>Check tool terms before commercial use.</li>
                        <li>Avoid misleading or deceptive content.</li>
                        <li>Keep prompt notes for provenance.</li>
                    </ul>
                </Callout>
                <p className="ait-note-line">Only build the library from assets CinNova owns, created, licensed, or has permission to use.</p>
                <SafetyNote />

                {/* 13. Weekly asset production plan */}
                <h2>Weekly asset production plan</h2>
                <ul className="ait-list">
                    <li><strong>Week 1:</strong> PoisonGuard + Kiddo hero assets.</li>
                    <li><strong>Week 2:</strong> Real Estate AI + TechMate AI hero assets.</li>
                    <li><strong>Week 3:</strong> Nightmare Forest + AI Tutorials assets.</li>
                    <li><strong>Week 4:</strong> Social clips, blog thumbnails, cleanup, QA, archive.</li>
                </ul>

                {/* 14. Final checklist */}
                <h2>Final checklist</h2>
                <Callout tone="good" title="You've started the library when…">
                    <ul className="ait-list">
                        <li>Main folder created.</li>
                        <li>Product folders created.</li>
                        <li>Prompt library created.</li>
                        <li>First product mood defined.</li>
                        <li>First source image saved.</li>
                        <li>First Higgsfield test created.</li>
                        <li>First Runway test created.</li>
                        <li>Best export saved.</li>
                        <li>Prompt version saved.</li>
                        <li>Screenshot saved.</li>
                        <li>Asset tracker updated.</li>
                        <li>Rights/safety checked.</li>
                    </ul>
                </Callout>

                {/* 15. FAQ */}
                <h2>FAQ</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            {/* 16. Related guides */}
            <RelatedGuides />
            <BackToHubCta note="After planning the cinematic asset library, use the Higgsfield and Runway guides to create the first product hero videos." />
        </div>
    );
}
