// Data for the AI Tutorials Hub. Evergreen, vendor-neutral descriptions only.
// No pricing, no partnership claims, no version-specific UI instructions.

/** The three step-by-step guides that actually exist in this release. */
export const AI_TUTORIALS = [
    {
        key: "ai-prompt-writing-guide",
        title: "How to Write Better AI Prompts",
        blurb: "Learn the role + task + context + format + constraints formula, with good and bad examples.",
        level: "Beginner",
        minutes: 8,
    },
    {
        key: "ai-research-guide",
        title: "How to Use AI for Research",
        blurb: "Build outlines, find leads, summarize notes, and verify facts without trusting hallucinations.",
        level: "Beginner",
        minutes: 9,
    },
    {
        key: "ai-coding-guide",
        title: "How to Use AI for Coding",
        blurb: "Plan a project, generate small functions, debug errors, and review code before you commit.",
        level: "Beginner",
        minutes: 9,
    },
];

/** Tutorial categories shown on the hub. `available` counts what ships today. */
export const AI_CATEGORIES = [
    { name: "AI for beginners", note: "Start from zero — what AI can and can't do, and how to get useful answers.", available: 1 },
    { name: "Prompt writing", note: "Structure clear instructions so tools return what you actually need.", available: 1 },
    { name: "AI writing & research", note: "Draft, outline, summarize, and gather leads — then verify carefully.", available: 1 },
    { name: "AI coding", note: "Plan, generate, and debug code safely with an assistant.", available: 1 },
    { name: "AI image generation", note: "Turn descriptions into images and iterate on visual ideas.", available: 0 },
    { name: "AI video generation", note: "Generate and edit short video from text and images.", available: 0 },
    { name: "AI voice & audio", note: "Create narration, transcribe audio, and clean up recordings.", available: 0 },
    { name: "AI business automation", note: "Connect tools and automate repetitive back-office work.", available: 0 },
    { name: "AI productivity", note: "Summarize meetings, draft emails, and organize your day.", available: 0 },
    { name: "AI safety, privacy & responsible use", note: "Protect private data, check output, and use AI honestly.", available: 0 },
];

/** AI companies/tools covered. Status is Available / Guide Planned / Coming Soon. */
export const AI_COMPANIES = [
    { name: "OpenAI / ChatGPT", use: "General assistant", desc: "A widely used chat assistant for writing, brainstorming, coding help, and Q&A.", status: "Guide Planned" },
    { name: "Anthropic / Claude", use: "General assistant", desc: "A conversational assistant known for long-context reading, writing, and analysis.", status: "Guide Planned" },
    { name: "Google Gemini", use: "General assistant", desc: "An assistant that helps with writing, research, and tasks across common workflows.", status: "Guide Planned" },
    { name: "Microsoft Copilot", use: "Work assistant", desc: "An assistant that helps draft, summarize, and act inside everyday work apps.", status: "Guide Planned" },
    { name: "Meta AI", use: "General assistant", desc: "A general-purpose assistant available across several consumer apps.", status: "Coming Soon" },
    { name: "Perplexity", use: "Answer engine", desc: "A search-style assistant that answers questions and points to sources to check.", status: "Guide Planned" },
    { name: "Mistral", use: "Open models", desc: "A family of language models often used by developers and self-hosters.", status: "Coming Soon" },
    { name: "Runway", use: "Video generation", desc: "A creative suite for generating and editing video and visual effects.", status: "Guide Planned" },
    { name: "ElevenLabs", use: "Voice & audio", desc: "Tools for generating natural-sounding narration and voice from text.", status: "Guide Planned" },
    { name: "Canva AI", use: "Design", desc: "AI features inside a design tool for images, layouts, and quick edits.", status: "Guide Planned" },
    { name: "Cursor", use: "AI code editor", desc: "A code editor with a built-in assistant for writing and refactoring code.", status: "Guide Planned" },
    { name: "Replit", use: "Coding in the browser", desc: "A browser-based coding environment with AI help for building projects.", status: "Guide Planned" },
    { name: "Midjourney", use: "Image generation", desc: "A tool for generating stylized images from text descriptions.", status: "Coming Soon" },
    { name: "Stability AI", use: "Open image models", desc: "Open image-generation models used across many creative tools.", status: "Coming Soon" },
];
