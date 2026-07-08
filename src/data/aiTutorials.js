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

/**
 * AI for Creators — a major platform category for people making video, images,
 * ads, voice, music, avatars, and cinematic/social content with AI. Evergreen,
 * vendor-neutral. Higgsfield is treated as a first-class creator platform.
 * Shape: { id, platform, description, creatorUseCases, status, tutorials, guide? }
 * `guide` is set only when a real, live guide already exists on this site.
 */
export const CREATOR_AI_PLATFORM_COLLECTIONS = [
    {
        id: "higgsfield",
        platform: "Higgsfield",
        description:
            "A creator-focused AI platform for cinematic video, images, ads, and social content, with dedicated studios for shorts, explainers, marketing, viral presets, and AI influencers.",
        creatorUseCases: ["AI video", "Cinematic scenes", "Social ads", "Character motion", "AI influencers", "Marketing content"],
        status: "Guide Planned",
        tutorials: [
            { title: "What is Higgsfield?" },
            { title: "How to Set Up Higgsfield for AI Video Creation" },
            { title: "How to Use Higgsfield Image Tools" },
            { title: "How to Use Higgsfield Video Tools" },
            { title: "How to Use Higgsfield Cinema Studio" },
            { title: "How to Use Higgsfield Shorts Studio" },
            { title: "How to Use Higgsfield Explainer" },
            { title: "How to Use Higgsfield Marketing Studio" },
            { title: "How to Use Higgsfield AI Influencer" },
            { title: "How to Use Higgsfield Viral Presets" },
            { title: "How to Use Higgsfield Canvas" },
            { title: "How to Use Higgsfield MCP & CLI" },
            { title: "How to Create Website Hero Videos with Higgsfield" },
            { title: "How to Create Social Media Ads with Higgsfield" },
            { title: "How to Create Character Motion Shots with Higgsfield" },
            { title: "Higgsfield vs Runway vs Google Flow" },
        ],
    },
    {
        id: "runway",
        platform: "Runway",
        description: "A creative suite for generating and editing video, visual effects, and motion from text and images.",
        creatorUseCases: ["AI video", "Video editing", "VFX", "Motion"],
        status: "Guide Planned",
        tutorials: [
            { title: "What is Runway?" },
            { title: "How to Set Up Runway for Video Creation" },
            { title: "How to Generate Video with Runway" },
            { title: "How to Edit Video and VFX with Runway" },
        ],
    },
    {
        id: "adobe-firefly",
        platform: "Adobe Firefly",
        description: "Generative AI for images, text effects, and creative fills that works alongside Adobe's creative apps.",
        creatorUseCases: ["AI images", "Generative fill", "Text effects", "Design assets"],
        status: "Guide Planned",
        tutorials: [
            { title: "What is Adobe Firefly?" },
            { title: "How to Generate Images with Firefly" },
            { title: "How to Use Generative Fill" },
            { title: "How to Use Firefly in Creative Cloud" },
        ],
    },
    {
        id: "canva-ai",
        platform: "Canva AI",
        description: "AI features inside a design tool for images, layouts, copy, and quick brand-consistent edits.",
        creatorUseCases: ["Design", "AI images", "Layouts", "Brand assets"],
        status: "Available",
        guide: "canva-ai-beginner-guide",
        tutorials: [
            { title: "How to Use Canva AI" },
            { title: "How to Design Social Graphics with Canva AI" },
            { title: "How to Keep Brand Consistency with Canva AI" },
        ],
    },
    {
        id: "elevenlabs",
        platform: "ElevenLabs",
        description: "Tools for generating natural-sounding narration, voiceovers, and voice from text.",
        creatorUseCases: ["AI voice", "Narration", "Dubbing", "Audio"],
        status: "Guide Planned",
        tutorials: [
            { title: "What is ElevenLabs?" },
            { title: "How to Generate a Voiceover with ElevenLabs" },
            { title: "How to Clone and Design Voices Responsibly" },
        ],
    },
    {
        id: "midjourney",
        platform: "Midjourney",
        description: "A tool for generating stylized, high-quality images from text descriptions.",
        creatorUseCases: ["AI images", "Concept art", "Styles", "Illustration"],
        status: "Guide Planned",
        tutorials: [
            { title: "What is Midjourney?" },
            { title: "How to Set Up Midjourney" },
            { title: "How to Write Better Midjourney Prompts" },
        ],
    },
    {
        id: "stability-ai",
        platform: "Stability AI",
        description: "Open image-generation models used across many creative tools and workflows.",
        creatorUseCases: ["AI images", "Open models", "Custom pipelines"],
        status: "Coming Soon",
        tutorials: [
            { title: "What is Stability AI?" },
            { title: "How to Generate Images with Stable Diffusion" },
        ],
    },
    {
        id: "luma-ai",
        platform: "Luma AI",
        description: "AI tools for generating video and 3D captures from text, images, and real-world scenes.",
        creatorUseCases: ["AI video", "3D capture", "Motion"],
        status: "Coming Soon",
        tutorials: [
            { title: "What is Luma AI?" },
            { title: "How to Generate Video with Luma AI" },
        ],
    },
    {
        id: "pika",
        platform: "Pika",
        description: "A tool for generating and restyling short video clips from text and images.",
        creatorUseCases: ["AI video", "Short clips", "Restyling"],
        status: "Coming Soon",
        tutorials: [
            { title: "What is Pika?" },
            { title: "How to Generate Short Videos with Pika" },
        ],
    },
    {
        id: "kling-ai",
        platform: "Kling AI",
        description: "A text-to-video and image-to-video tool for generating realistic motion clips.",
        creatorUseCases: ["AI video", "Realistic motion", "Image-to-video"],
        status: "Coming Soon",
        tutorials: [
            { title: "What is Kling AI?" },
            { title: "How to Generate Video with Kling AI" },
        ],
    },
    {
        id: "leonardo-ai",
        platform: "Leonardo AI",
        description: "An image-generation platform with fine-tuned models and tools for game, concept, and marketing art.",
        creatorUseCases: ["AI images", "Game art", "Concept art", "Assets"],
        status: "Guide Planned",
        tutorials: [
            { title: "What is Leonardo AI?" },
            { title: "How to Generate Images with Leonardo AI" },
            { title: "How to Use Model Presets in Leonardo AI" },
        ],
    },
    {
        id: "heygen",
        platform: "HeyGen",
        description: "A platform for creating AI avatar and talking-head videos with translation and voiceover.",
        creatorUseCases: ["AI avatars", "Talking heads", "Translation", "Voiceover"],
        status: "Guide Planned",
        tutorials: [
            { title: "What is HeyGen?" },
            { title: "How to Create an AI Avatar Video with HeyGen" },
            { title: "How to Translate a Video with HeyGen" },
        ],
    },
    {
        id: "synthesia",
        platform: "Synthesia",
        description: "A tool for creating AI presenter videos for training, explainers, and internal communication.",
        creatorUseCases: ["AI presenters", "Training video", "Explainers"],
        status: "Coming Soon",
        tutorials: [
            { title: "What is Synthesia?" },
            { title: "How to Create a Presenter Video with Synthesia" },
        ],
    },
    {
        id: "descript",
        platform: "Descript",
        description: "An audio and video editor that lets you edit recordings by editing the transcript.",
        creatorUseCases: ["Video editing", "Podcasts", "Transcription", "Voice"],
        status: "Guide Planned",
        tutorials: [
            { title: "What is Descript?" },
            { title: "How to Edit Video by Editing Text in Descript" },
            { title: "How to Clean Up Audio with Descript" },
        ],
    },
    {
        id: "suno",
        platform: "Suno",
        description: "A tool for generating original songs, instrumentals, and vocals from text prompts.",
        creatorUseCases: ["AI music", "Songs", "Instrumentals"],
        status: "Guide Planned",
        tutorials: [
            { title: "What is Suno?" },
            { title: "How to Generate a Song with Suno" },
            { title: "How to Use AI Music Responsibly" },
        ],
    },
    {
        id: "udio",
        platform: "Udio",
        description: "A music-generation tool for creating tracks, vocals, and instrumentals from text.",
        creatorUseCases: ["AI music", "Vocals", "Tracks"],
        status: "Coming Soon",
        tutorials: [
            { title: "What is Udio?" },
            { title: "How to Generate Music with Udio" },
        ],
    },
    {
        id: "capcut-ai",
        platform: "CapCut AI",
        description: "AI editing features inside a popular short-video editor for captions, effects, and quick cuts.",
        creatorUseCases: ["Video editing", "Captions", "Short video", "Effects"],
        status: "Coming Soon",
        tutorials: [
            { title: "What is CapCut AI?" },
            { title: "How to Edit Short Videos with CapCut AI" },
        ],
    },
    {
        id: "figma-ai",
        platform: "Figma AI",
        description: "AI features inside a design tool for generating layouts, content, and design edits.",
        creatorUseCases: ["Design", "UI layouts", "Prototyping", "Brand assets"],
        status: "Coming Soon",
        tutorials: [
            { title: "What is Figma AI?" },
            { title: "How to Use AI Features in Figma" },
        ],
    },
];

/*
 * ── BEGINNER TUTORIAL QUALITY RULE ────────────────────────────────────────
 * Every beginner tutorial we publish must be CLICK-BY-CLICK and SCREEN-AWARE.
 * Each beginner step must include:
 *   - Where to look
 *   - What to click
 *   - What you should see
 *   - If you do not see it
 *   - Common mistake
 *   - Screenshot placeholder
 *
 * Do NOT write vague steps like "Go to settings" or "Click create."
 * Instead write, for example:
 *   "Look in the left sidebar near the bottom of the screen for the gear icon
 *    labeled Settings. Click it once. After clicking it, you should see a
 *    settings panel open."
 * ──────────────────────────────────────────────────────────────────────────
 */

/** Weekly cadence cards for the hub (planned/placeholder content for now). */
export const WEEKLY_TUTORIAL_CARDS = [
    {
        id: "this-week",
        label: "This Week's Tutorial",
        title: "How to Set Up Your First AI Workspace",
        status: "Planned",
    },
    {
        id: "next-week",
        label: "Coming Next Week",
        title: "How to Use Higgsfield for AI Video Creation — Beginner Guide",
        status: "Planned",
    },
    {
        id: "roadmap",
        label: "Tutorial Roadmap",
        title: "100 planned tutorials across AI platforms, creator tools, automation, coding, design, business, and project builds.",
        status: "Planned",
    },
];

/** Browse by Level — learning paths matched to experience. */
export const LEARNING_LEVELS = [
    {
        id: "beginner",
        level: "Beginner",
        description: "Start here if you are new to AI. These tutorials explain every screen, button, menu, and step.",
    },
    {
        id: "intermediate",
        level: "Intermediate",
        description: "Improve your results with better prompts, tool combinations, reusable workflows, and practical project systems.",
    },
    {
        id: "advanced",
        level: "Advanced",
        description: "Build full AI systems for automation, business workflows, content pipelines, agents, SEO, and product launches.",
    },
];

/** Browse by Topic — status is "Available guides" (guides exist) or "Planned path". */
export const LEARNING_TOPICS = [
    { id: "ai-basics", topic: "AI Basics", description: "What AI can and can't do, key terms, and how to get useful answers.", status: "Available guides", levels: ["Beginner"] },
    { id: "setup", topic: "Setup", description: "Create accounts, find the right settings, and get any AI tool ready to use.", status: "Planned path", levels: ["Beginner"] },
    { id: "prompting", topic: "Prompting", description: "Structure clear instructions so tools return what you actually need.", status: "Available guides", levels: ["Beginner", "Intermediate"] },
    { id: "research", topic: "Research", description: "Draft outlines, gather leads, summarize notes, and verify facts.", status: "Available guides", levels: ["Beginner", "Intermediate"] },
    { id: "image-creation", topic: "Image Creation", description: "Turn descriptions into images and iterate on visual ideas.", status: "Planned path", levels: ["Beginner", "Intermediate"] },
    { id: "video-creation", topic: "Video Creation", description: "Generate and edit short cinematic video from text and images.", status: "Planned path", levels: ["Beginner", "Intermediate", "Advanced"] },
    { id: "design", topic: "Design", description: "Create graphics, layouts, and brand-consistent visuals with AI.", status: "Available guides", levels: ["Beginner", "Intermediate"] },
    { id: "website-building", topic: "Website Building", description: "Plan, write, and design websites with AI, then hand off to build.", status: "Available guides", levels: ["Intermediate"] },
    { id: "coding", topic: "Coding", description: "Plan projects, generate functions, and debug code safely.", status: "Available guides", levels: ["Beginner", "Intermediate", "Advanced"] },
    { id: "automation", topic: "Automation", description: "Connect tools and automate repetitive back-office work.", status: "Planned path", levels: ["Intermediate", "Advanced"] },
    { id: "business-workflows", topic: "Business Workflows", description: "Positioning, content, launches, and client-facing systems.", status: "Available guides", levels: ["Intermediate", "Advanced"] },
    { id: "creator-tools", topic: "Creator Tools", description: "Video, image, voice, music, and avatar tools for creators.", status: "Planned path", levels: ["Beginner", "Intermediate", "Advanced"] },
    { id: "social-media", topic: "Social Media", description: "Plan, script, and produce short-form and social content.", status: "Planned path", levels: ["Beginner", "Intermediate"] },
    { id: "real-estate-ai", topic: "Real Estate AI", description: "Analyze deals, score properties, and support investor decisions.", status: "Planned path", levels: ["Intermediate"] },
    { id: "safety-privacy", topic: "Safety & Privacy", description: "Protect private data, check output, and use AI responsibly.", status: "Planned path", levels: ["Beginner"] },
    { id: "youtube-paths", topic: "YouTube Learning Paths", description: "Curated video paths paired with CinNova checklists and prompts.", status: "Planned path", levels: ["Beginner", "Intermediate"] },
    { id: "monetization-seo", topic: "Monetization & SEO", description: "Rank content, generate leads, and turn AI skills into income.", status: "Planned path", levels: ["Intermediate", "Advanced"] },
    { id: "project-builds", topic: "Project Builds", description: "End-to-end builds that turn tutorials into real systems.", status: "Planned path", levels: ["Intermediate", "Advanced"] },
];

/** Build Real AI Projects — hands-on tracks (planned). */
export const AI_PROJECT_TRACKS = [
    {
        id: "website-builder",
        title: "AI Website Builder Track",
        description: "Design and ship pages that convert — landing pages, hero sections, hubs, and lead tools.",
        levels: ["Beginner", "Intermediate", "Advanced"],
        cta: "Project track planned",
        examples: [
            "Build a Product Landing Page with AI",
            "Build a Cinematic Homepage Hero with AI",
            "Build an AI Tutorial Hub",
            "Build a Resource Hub That Ranks on Google",
            "Build a Free Tool Page for Lead Generation",
        ],
    },
    {
        id: "creator",
        title: "AI Creator Track",
        description: "Produce cinematic video, brand kits, and consistent characters with AI creator tools.",
        levels: ["Beginner", "Intermediate", "Advanced"],
        cta: "Project track planned",
        examples: [
            "Build a Cinematic Asset Library",
            "Create a Full Brand Kit with AI",
            "Create Website Hero Videos for Multiple Products",
            "Create a Product Launch Video Pack",
            "Create Consistent Characters for a Story or Game",
        ],
    },
    {
        id: "business-automation",
        title: "AI Business Automation Track",
        description: "Automate research, intake, reports, and launch content across your back office.",
        levels: ["Intermediate", "Advanced"],
        cta: "Project track planned",
        examples: [
            "Automate Blog Research and Outlines",
            "Automate Client Intake Forms",
            "Automate Spreadsheet Reports",
            "Automate Product Launch Content",
            "Build a Newsletter Growth System",
        ],
    },
    {
        id: "real-estate",
        title: "AI Real Estate Track",
        description: "Build lead magnets, calculators, and follow-up systems for real estate.",
        levels: ["Intermediate", "Advanced"],
        cta: "Project track planned",
        examples: [
            "Build a Real Estate AI Lead Magnet",
            "Build a Rental Property Calculator Funnel",
            "Build a Contractor Estimate Assistant",
            "Automate Real Estate Follow-Ups",
            "Build a Property Analysis Dashboard Concept",
        ],
    },
    {
        id: "coding-app",
        title: "AI Coding and App Track",
        description: "Go from idea to working prototype with AI coding tools — safely reviewed.",
        levels: ["Beginner", "Intermediate", "Advanced"],
        cta: "Project track planned",
        examples: [
            "Build a Landing Page with Cursor",
            "Build a Simple AI App with Replit",
            "Build a Free Calculator Tool",
            "Turn an App Idea into a Working Prototype",
            "Review AI-Generated Code Safely",
        ],
    },
    {
        id: "cinnova-product",
        title: "CinNova Product Project Track",
        description: "Build content and asset systems across the CinNova product ecosystem.",
        levels: ["Intermediate", "Advanced"],
        cta: "Project track planned",
        examples: [
            "Build a PoisonGuard Safety Content System",
            "Build a Kiddo Learning Asset Pipeline",
            "Build a Real Estate AI Lead Magnet",
            "Build a TechMate AI Support Workflow",
            "Build a Nightmare Forest Game Asset Pipeline",
            "Build the CinNova Cinematic Asset Library",
        ],
    },
];

/**
 * YouTube Learning Paths — Watch → Do → Build. These pages CURATE, CREDIT, and
 * organize the best existing videos and add CinNova's own checklists, prompts,
 * and project steps. We never copy or reproduce creators' tutorials.
 */
export const YOUTUBE_LEARNING_PATHS = [
    { id: "yt-chatgpt", title: "Best YouTube Tutorials for ChatGPT", status: "Planned path" },
    { id: "yt-claude", title: "Best YouTube Tutorials for Claude", status: "Planned path" },
    { id: "yt-google", title: "Best YouTube Tutorials for Google AI", status: "Planned path" },
    { id: "yt-higgsfield", title: "Best YouTube Tutorials for Higgsfield", status: "Planned path" },
    { id: "yt-runway", title: "Best YouTube Tutorials for Runway", status: "Planned path" },
    { id: "yt-canva", title: "Best YouTube Tutorials for Canva AI", status: "Planned path" },
    { id: "yt-cursor", title: "Best YouTube Tutorials for Cursor and AI Coding", status: "Planned path" },
    { id: "yt-automation", title: "Best YouTube Tutorials for AI Automation", status: "Planned path" },
    { id: "yt-web-design", title: "Best YouTube Tutorials for AI Website Design", status: "Planned path" },
    { id: "yt-business", title: "Best YouTube Tutorials for AI Business Workflows", status: "Planned path" },
];
