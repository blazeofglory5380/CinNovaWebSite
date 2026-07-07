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

/** Step-by-step beginner guides for specific AI tools. */
export const AI_TOOL_TUTORIALS = [
    {
        key: "chatgpt-beginner-guide",
        title: "How to Use ChatGPT",
        blurb: "Writing, studying, planning, and coding help — with clear steps, example prompts, and safety tips.",
        tool: "ChatGPT / OpenAI",
        level: "Beginner",
        minutes: 9,
    },
    {
        key: "claude-beginner-guide",
        title: "How to Use Claude",
        blurb: "Drafting, summarizing, planning, and document-style work — step by step for beginners.",
        tool: "Claude / Anthropic",
        level: "Beginner",
        minutes: 9,
    },
    {
        key: "gemini-beginner-guide",
        title: "How to Use Google Gemini",
        blurb: "Writing, research support, productivity, and everyday AI help, explained simply.",
        tool: "Google Gemini",
        level: "Beginner",
        minutes: 9,
    },
    {
        key: "microsoft-copilot-beginner-guide",
        title: "How to Use Microsoft Copilot",
        blurb: "Email, documents, spreadsheets, and meeting help for everyday work — with privacy guidance.",
        tool: "Microsoft Copilot",
        level: "Beginner",
        minutes: 9,
    },
    {
        key: "perplexity-beginner-guide",
        title: "How to Use Perplexity",
        blurb: "Research questions, follow-ups, comparing sources, and verifying facts — step by step for beginners.",
        tool: "Perplexity",
        level: "Beginner",
        minutes: 9,
    },
    {
        key: "cursor-beginner-guide",
        title: "How to Use Cursor",
        blurb: "Describe a project, plan first, work file by file, and review changes safely in the AI code editor.",
        tool: "Cursor",
        level: "Beginner",
        minutes: 10,
    },
    {
        key: "replit-beginner-guide",
        title: "How to Use Replit AI",
        blurb: "Build a small project in the browser, generate features one at a time, and debug with error context.",
        tool: "Replit",
        level: "Beginner",
        minutes: 10,
    },
    {
        key: "canva-ai-beginner-guide",
        title: "How to Use Canva AI",
        blurb: "Choose a format, write clear design prompts, edit the result, and keep brand consistency.",
        tool: "Canva AI",
        level: "Beginner",
        minutes: 9,
    },
];

/** Practical Claude workflow guides for creative, website, art, and marketing work. */
export const CLAUDE_WORKFLOW_GUIDES = [
    {
        key: "claude-with-adobe-guide",
        title: "Using Claude with Adobe",
        blurb: "Plan briefs, mood boards, copy, and reviews with Claude alongside your Adobe creative tools.",
        level: "Workflow",
        minutes: 10,
    },
    {
        key: "claude-website-design-guide",
        title: "Designing a Website with Claude",
        blurb: "Define goals, build a sitemap, draft copy and wireframe notes, and prepare a developer handoff.",
        level: "Workflow",
        minutes: 11,
    },
    {
        key: "claude-art-prompts-guide",
        title: "Better Art Prompts with Claude",
        blurb: "Turn ideas into detailed art prompts — subject, style, mood, lighting, and composition — to use in an image tool.",
        level: "Workflow",
        minutes: 10,
    },
    {
        key: "claude-branding-marketing-guide",
        title: "Branding & Marketing with Claude",
        blurb: "Shape audience, positioning, voice, content pillars, and launch copy — then review for clarity and trust.",
        level: "Workflow",
        minutes: 11,
    },
    {
        key: "claude-with-canva-guide",
        title: "Using Claude with Canva",
        blurb: "Plan briefs, copy, and layout ideas with Claude alongside Canva, then build and review the design.",
        level: "Workflow",
        minutes: 10,
    },
    {
        key: "claude-with-figma-guide",
        title: "Using Claude with Figma",
        blurb: "Map user flows, wireframe notes, and UX copy with Claude alongside Figma, then design and hand off.",
        level: "Workflow",
        minutes: 11,
    },
    {
        key: "claude-with-cursor-guide",
        title: "Using Claude with Cursor",
        blurb: "Plan features and review risk with Claude, make changes in Cursor, and verify before committing.",
        level: "Workflow",
        minutes: 11,
    },
    {
        key: "claude-with-higgsfield-guide",
        title: "Using Claude with Higgsfield",
        blurb: "Plan concepts and scene-by-scene AI video prompts with Claude, then generate footage in the tool.",
        level: "Workflow",
        minutes: 11,
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
    { name: "OpenAI / ChatGPT", use: "General assistant", desc: "A widely used chat assistant for writing, brainstorming, coding help, and Q&A.", status: "Available", guide: "chatgpt-beginner-guide" },
    { name: "Anthropic / Claude", use: "General assistant", desc: "A conversational assistant known for long-context reading, writing, and analysis.", status: "Available", guide: "claude-beginner-guide" },
    { name: "Google Gemini", use: "General assistant", desc: "An assistant that helps with writing, research, and tasks across common workflows.", status: "Available", guide: "gemini-beginner-guide" },
    { name: "Microsoft Copilot", use: "Work assistant", desc: "An assistant that helps draft, summarize, and act inside everyday work apps.", status: "Available", guide: "microsoft-copilot-beginner-guide" },
    { name: "Meta AI", use: "General assistant", desc: "A general-purpose assistant available across several consumer apps.", status: "Coming Soon" },
    { name: "Perplexity", use: "Answer engine", desc: "A search-style assistant that answers questions and points to sources to check.", status: "Available", guide: "perplexity-beginner-guide" },
    { name: "Mistral", use: "Open models", desc: "A family of language models often used by developers and self-hosters.", status: "Coming Soon" },
    { name: "Runway", use: "Video generation", desc: "A creative suite for generating and editing video and visual effects.", status: "Guide Planned" },
    { name: "ElevenLabs", use: "Voice & audio", desc: "Tools for generating natural-sounding narration and voice from text.", status: "Guide Planned" },
    { name: "Canva AI", use: "Design", desc: "AI features inside a design tool for images, layouts, and quick edits.", status: "Available", guide: "canva-ai-beginner-guide" },
    { name: "Cursor", use: "AI code editor", desc: "A code editor with a built-in assistant for writing and refactoring code.", status: "Available", guide: "cursor-beginner-guide" },
    { name: "Replit", use: "Coding in the browser", desc: "A browser-based coding environment with AI help for building projects.", status: "Available", guide: "replit-beginner-guide" },
    { name: "Midjourney", use: "Image generation", desc: "A tool for generating stylized images from text descriptions.", status: "Coming Soon" },
    { name: "Stability AI", use: "Open image models", desc: "Open image-generation models used across many creative tools.", status: "Coming Soon" },
];
