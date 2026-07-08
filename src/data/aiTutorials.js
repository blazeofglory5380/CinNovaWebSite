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

/**
 * Full 100-tutorial roadmap. Roadmap CARDS only — most pages do not exist yet
 * and are marked status "Planned" (do NOT link them). Only items whose page
 * already exists use status "Available" + a real guide key so the card links.
 * Fields: key, title, blurb, level, minutes, status, publishStatus, platforms,
 * category, topics, priority (1 = write first, 2 = next, 3 = later).
 * Distribution: 40 Beginner, 35 Intermediate, 25 Advanced.
 */
export const AI_TUTORIAL_ROADMAP_100 = [
    // ── BEGINNER (40) ──────────────────────────────────────────────────────
    { key: "rm-setup-first-ai-workspace", title: "How to Set Up Your First AI Workspace", blurb: "Create accounts, pick your core tools, and organize a clean AI workspace you can actually use.", level: "Beginner", minutes: 12, status: "Planned", publishStatus: "This Week", platforms: ["Multi-platform"], category: "Setup & Workflows", topics: ["Setup"], priority: 1 },
    { key: "rm-choose-right-ai-tool", title: "How to Choose the Right AI Tool for the Job", blurb: "A simple way to decide which AI tool fits writing, images, video, coding, or research.", level: "Beginner", minutes: 10, status: "Planned", publishStatus: "Planned", platforms: ["Multi-platform"], category: "Setup & Workflows", topics: ["AI Basics", "Setup"], priority: 2 },
    { key: "rm-setup-ai-video-workflow", title: "How to Set Up an AI Video Workflow", blurb: "Plan, generate, and organize AI video from first idea to final clip.", level: "Beginner", minutes: 12, status: "Planned", publishStatus: "Planned", platforms: ["Higgsfield", "Runway"], category: "Setup & Workflows", topics: ["Video Creation", "Setup"], priority: 2 },
    { key: "rm-setup-ai-image-workflow", title: "How to Set Up an AI Image Workflow", blurb: "Go from prompt to polished image with a repeatable image workflow.", level: "Beginner", minutes: 11, status: "Planned", publishStatus: "Planned", platforms: ["Midjourney", "Google AI"], category: "Setup & Workflows", topics: ["Image Creation", "Setup"], priority: 2 },
    { key: "rm-setup-ai-design-workflow", title: "How to Set Up an AI Design Workflow", blurb: "Turn ideas into on-brand graphics with a clear AI design workflow.", level: "Beginner", minutes: 11, status: "Planned", publishStatus: "Planned", platforms: ["Canva AI", "Adobe Firefly"], category: "Setup & Workflows", topics: ["Design", "Setup"], priority: 2 },
    { key: "rm-setup-ai-coding-workflow", title: "How to Set Up an AI Coding Workflow", blurb: "Plan, generate, and review code with a safe AI coding workflow.", level: "Beginner", minutes: 12, status: "Planned", publishStatus: "Planned", platforms: ["Cursor", "Anthropic"], category: "Setup & Workflows", topics: ["Coding", "Setup"], priority: 2 },
    { key: "rm-setup-ai-research-workflow", title: "How to Set Up an AI Research Workflow", blurb: "Collect sources, summarize, and verify facts with a research workflow.", level: "Beginner", minutes: 11, status: "Planned", publishStatus: "Planned", platforms: ["Google AI", "Perplexity"], category: "Setup & Workflows", topics: ["Research", "Setup"], priority: 2 },
    { key: "rm-setup-ai-automation-workflow", title: "How to Set Up an AI Automation Workflow", blurb: "Connect tools and automate repeat tasks with a starter automation workflow.", level: "Beginner", minutes: 13, status: "Planned", publishStatus: "Planned", platforms: ["Multi-platform"], category: "Setup & Workflows", topics: ["Automation", "Setup"], priority: 3 },
    { key: "rm-organize-ai-assets", title: "How to Organize AI Prompts, Files, Images, and Videos", blurb: "Keep prompts, assets, and outputs organized so you can find and reuse them.", level: "Beginner", minutes: 10, status: "Planned", publishStatus: "Planned", platforms: ["Multi-platform"], category: "Setup & Workflows", topics: ["Setup"], priority: 3 },
    { key: "rm-multi-platform-creator-workspace", title: "How to Build a Multi-Platform AI Creator Workspace", blurb: "Combine video, image, voice, and design tools into one creator workspace.", level: "Beginner", minutes: 14, status: "Planned", publishStatus: "Planned", platforms: ["Higgsfield", "Canva AI", "ElevenLabs"], category: "Setup & Workflows", topics: ["Creator Tools", "Setup"], priority: 3 },

    { key: "rm-what-is-openai", title: "What is OpenAI? Beginner Guide", blurb: "A plain-English intro to OpenAI and what ChatGPT can do for you.", level: "Beginner", minutes: 9, status: "Planned", publishStatus: "Planned", platforms: ["OpenAI"], category: "OpenAI", topics: ["AI Basics"], priority: 2 },
    { key: "chatgpt-beginner-guide", title: "How to Use ChatGPT Step by Step", blurb: "A click-by-click walkthrough of ChatGPT for everyday writing, planning, and Q&A.", level: "Beginner", minutes: 10, status: "Available", publishStatus: "Available", platforms: ["OpenAI"], category: "OpenAI", topics: ["AI Basics", "Prompting"], priority: 1 },
    { key: "rm-chatgpt-planning", title: "How to Use ChatGPT for Planning", blurb: "Turn goals into clear plans, checklists, and schedules with ChatGPT.", level: "Beginner", minutes: 9, status: "Planned", publishStatus: "Planned", platforms: ["OpenAI"], category: "OpenAI", topics: ["Prompting"], priority: 2 },
    { key: "rm-chatgpt-writing", title: "How to Use ChatGPT for Writing", blurb: "Draft, rewrite, and polish writing with ChatGPT.", level: "Beginner", minutes: 9, status: "Planned", publishStatus: "Planned", platforms: ["OpenAI"], category: "OpenAI", topics: ["Prompting"], priority: 2 },
    { key: "rm-chatgpt-research", title: "How to Use ChatGPT for Research", blurb: "Gather leads, summarize, and check facts responsibly with ChatGPT.", level: "Beginner", minutes: 10, status: "Planned", publishStatus: "Planned", platforms: ["OpenAI"], category: "OpenAI", topics: ["Research"], priority: 2 },
    { key: "rm-chatgpt-image-creation", title: "How to Use ChatGPT for Image Creation", blurb: "Create and edit images with ChatGPT's built-in image tools.", level: "Beginner", minutes: 9, status: "Planned", publishStatus: "Planned", platforms: ["OpenAI"], category: "OpenAI", topics: ["Image Creation"], priority: 3 },
    { key: "rm-chatgpt-coding", title: "How to Use ChatGPT for Coding", blurb: "Generate small functions and debug errors with ChatGPT.", level: "Beginner", minutes: 10, status: "Planned", publishStatus: "Planned", platforms: ["OpenAI"], category: "OpenAI", topics: ["Coding"], priority: 3 },
    { key: "rm-chatgpt-projects", title: "How to Use ChatGPT Projects", blurb: "Keep chats, files, and instructions together with ChatGPT Projects.", level: "Beginner", minutes: 9, status: "Planned", publishStatus: "Planned", platforms: ["OpenAI"], category: "OpenAI", topics: ["Setup"], priority: 3 },
    { key: "rm-custom-gpts", title: "How to Use Custom GPTs", blurb: "Build a reusable custom GPT for a specific repeat task.", level: "Beginner", minutes: 12, status: "Planned", publishStatus: "Planned", platforms: ["OpenAI"], category: "OpenAI", topics: ["Automation"], priority: 3 },
    { key: "rm-codex-website-development", title: "How to Use Codex for Website Development", blurb: "Use OpenAI Codex to help build and edit website features.", level: "Beginner", minutes: 13, status: "Planned", publishStatus: "Planned", platforms: ["OpenAI"], category: "OpenAI", topics: ["Coding", "Website Building"], priority: 3 },

    { key: "rm-what-is-anthropic", title: "What is Anthropic? Beginner Guide", blurb: "A plain-English intro to Anthropic and what Claude is good at.", level: "Beginner", minutes: 9, status: "Planned", publishStatus: "Planned", platforms: ["Anthropic"], category: "Anthropic", topics: ["AI Basics"], priority: 2 },
    { key: "claude-beginner-guide", title: "How to Use Claude Step by Step", blurb: "A click-by-click walkthrough of Claude for drafting, summarizing, and analysis.", level: "Beginner", minutes: 10, status: "Available", publishStatus: "Available", platforms: ["Anthropic"], category: "Anthropic", topics: ["AI Basics", "Prompting"], priority: 1 },
    { key: "rm-claude-long-projects", title: "How to Use Claude for Long Projects", blurb: "Use Claude's long context for big documents and multi-step work.", level: "Beginner", minutes: 10, status: "Planned", publishStatus: "Planned", platforms: ["Anthropic"], category: "Anthropic", topics: ["Research"], priority: 2 },
    { key: "rm-claude-projects", title: "How to Use Claude Projects", blurb: "Organize context, files, and instructions with Claude Projects.", level: "Beginner", minutes: 9, status: "Planned", publishStatus: "Planned", platforms: ["Anthropic"], category: "Anthropic", topics: ["Setup"], priority: 3 },
    { key: "rm-claude-artifacts", title: "How to Use Claude Artifacts", blurb: "Create and iterate on documents, code, and pages with Artifacts.", level: "Beginner", minutes: 10, status: "Planned", publishStatus: "Planned", platforms: ["Anthropic"], category: "Anthropic", topics: ["Coding", "Design"], priority: 3 },
    { key: "rm-claude-website-planning", title: "How to Use Claude for Website Planning", blurb: "Plan sitemaps, copy, and structure with Claude before you build.", level: "Beginner", minutes: 11, status: "Planned", publishStatus: "Planned", platforms: ["Anthropic"], category: "Anthropic", topics: ["Website Building"], priority: 2 },
    { key: "rm-claude-writing-editing", title: "How to Use Claude for Writing and Editing", blurb: "Draft and refine clear, trustworthy writing with Claude.", level: "Beginner", minutes: 9, status: "Planned", publishStatus: "Planned", platforms: ["Anthropic"], category: "Anthropic", topics: ["Prompting"], priority: 2 },
    { key: "rm-claude-coding-help", title: "How to Use Claude for Coding Help", blurb: "Plan features and review code safely with Claude.", level: "Beginner", minutes: 10, status: "Planned", publishStatus: "Planned", platforms: ["Anthropic"], category: "Anthropic", topics: ["Coding"], priority: 2 },
    { key: "rm-claude-design-tools", title: "How to Use Claude with Design Tools", blurb: "Plan briefs and copy with Claude alongside your design tools.", level: "Beginner", minutes: 10, status: "Planned", publishStatus: "Planned", platforms: ["Anthropic", "Canva AI", "Figma AI"], category: "Anthropic", topics: ["Design"], priority: 3 },
    { key: "rm-claude-business-workflows", title: "How to Use Claude for Business Workflows", blurb: "Shape positioning, content, and launch copy with Claude.", level: "Beginner", minutes: 11, status: "Planned", publishStatus: "Planned", platforms: ["Anthropic"], category: "Anthropic", topics: ["Business Workflows"], priority: 3 },

    { key: "rm-what-is-google-ai", title: "What is Google AI? Beginner Guide", blurb: "A plain-English intro to Google's AI tools and where to start.", level: "Beginner", minutes: 9, status: "Planned", publishStatus: "Planned", platforms: ["Google AI"], category: "Google AI", topics: ["AI Basics"], priority: 2 },
    { key: "gemini-beginner-guide", title: "How to Use Gemini Step by Step", blurb: "A click-by-click walkthrough of Google Gemini for everyday help.", level: "Beginner", minutes: 10, status: "Available", publishStatus: "Available", platforms: ["Google AI"], category: "Google AI", topics: ["AI Basics", "Prompting"], priority: 1 },
    { key: "rm-gemini-research", title: "How to Use Gemini for Research", blurb: "Ask research questions and summarize findings with Gemini.", level: "Beginner", minutes: 9, status: "Planned", publishStatus: "Planned", platforms: ["Google AI"], category: "Google AI", topics: ["Research"], priority: 2 },
    { key: "rm-gemini-visual-workflows", title: "How to Use Gemini for Visual Workflows", blurb: "Work with images and visual tasks inside Gemini.", level: "Beginner", minutes: 10, status: "Planned", publishStatus: "Planned", platforms: ["Google AI"], category: "Google AI", topics: ["Image Creation"], priority: 3 },
    { key: "rm-gemini-gems", title: "How to Use Gemini Gems", blurb: "Create reusable Gems for repeat tasks in Gemini.", level: "Beginner", minutes: 10, status: "Planned", publishStatus: "Planned", platforms: ["Google AI"], category: "Google AI", topics: ["Automation"], priority: 3 },
    { key: "rm-nano-banana", title: "How to Use Nano Banana for Image Creation and Editing", blurb: "Create and edit images with Google's Nano Banana image model.", level: "Beginner", minutes: 11, status: "Planned", publishStatus: "Planned", platforms: ["Google AI"], category: "Google AI", topics: ["Image Creation"], priority: 1 },
    { key: "rm-google-flow-video", title: "How to Use Google Flow for AI Video", blurb: "Generate AI video scenes with Google Flow.", level: "Beginner", minutes: 12, status: "Planned", publishStatus: "Planned", platforms: ["Google AI"], category: "Google AI", topics: ["Video Creation"], priority: 2 },
    { key: "rm-veo-video-generation", title: "How to Use Veo for Video Generation", blurb: "Generate short video clips from text with Veo.", level: "Beginner", minutes: 11, status: "Planned", publishStatus: "Planned", platforms: ["Google AI"], category: "Google AI", topics: ["Video Creation"], priority: 3 },
    { key: "rm-imagen-ai-images", title: "How to Use Imagen for AI Images", blurb: "Create images from text descriptions with Imagen.", level: "Beginner", minutes: 10, status: "Planned", publishStatus: "Planned", platforms: ["Google AI"], category: "Google AI", topics: ["Image Creation"], priority: 3 },
    { key: "rm-notebooklm", title: "How to Use NotebookLM for Research and Study", blurb: "Turn your own sources into notes, summaries, and study aids.", level: "Beginner", minutes: 11, status: "Planned", publishStatus: "Planned", platforms: ["Google AI"], category: "Google AI", topics: ["Research"], priority: 2 },

    // ── INTERMEDIATE (35) ──────────────────────────────────────────────────
    { key: "rm-google-ai-studio", title: "How to Use Google AI Studio", blurb: "Build and test prompts and prototypes in Google AI Studio.", level: "Intermediate", minutes: 13, status: "Planned", publishStatus: "Planned", platforms: ["Google AI"], category: "Google AI", topics: ["Coding", "Prompting"], priority: 2 },
    { key: "rm-ai-studio-vibe-coding", title: "How to Use Google AI Studio for Vibe Coding", blurb: "Prototype apps quickly with AI-assisted 'vibe coding'.", level: "Intermediate", minutes: 14, status: "Planned", publishStatus: "Planned", platforms: ["Google AI"], category: "Google AI", topics: ["Coding"], priority: 3 },
    { key: "rm-jules-coding-tasks", title: "How to Use Jules for Coding Tasks", blurb: "Delegate coding tasks to the Jules coding agent.", level: "Intermediate", minutes: 13, status: "Planned", publishStatus: "Planned", platforms: ["Google AI"], category: "Google AI", topics: ["Coding", "Automation"], priority: 3 },
    { key: "rm-gemini-workspace", title: "How to Use Gemini in Google Workspace", blurb: "Use Gemini inside Docs, Sheets, Gmail, and Slides.", level: "Intermediate", minutes: 12, status: "Planned", publishStatus: "Planned", platforms: ["Google AI"], category: "Google AI", topics: ["Business Workflows"], priority: 2 },
    { key: "rm-google-ai-agents", title: "How to Use Google AI Agents and Automation Tools", blurb: "Automate multi-step tasks with Google's AI agents.", level: "Intermediate", minutes: 15, status: "Planned", publishStatus: "Planned", platforms: ["Google AI"], category: "Google AI", topics: ["Automation"], priority: 3 },

    { key: "rm-what-is-copilot", title: "What is Microsoft Copilot? Beginner Guide", blurb: "A plain-English intro to Microsoft Copilot across work apps.", level: "Intermediate", minutes: 9, status: "Planned", publishStatus: "Planned", platforms: ["Microsoft"], category: "Microsoft", topics: ["AI Basics"], priority: 2 },
    { key: "microsoft-copilot-beginner-guide", title: "How to Use Microsoft Copilot Step by Step", blurb: "A click-by-click walkthrough of Microsoft Copilot for everyday work.", level: "Intermediate", minutes: 10, status: "Available", publishStatus: "Available", platforms: ["Microsoft"], category: "Microsoft", topics: ["Business Workflows"], priority: 2 },
    { key: "rm-copilot-word", title: "How to Use Copilot in Word", blurb: "Draft, summarize, and rewrite documents with Copilot in Word.", level: "Intermediate", minutes: 10, status: "Planned", publishStatus: "Planned", platforms: ["Microsoft"], category: "Microsoft", topics: ["Business Workflows"], priority: 2 },
    { key: "rm-copilot-excel", title: "How to Use Copilot in Excel", blurb: "Analyze data and build formulas with Copilot in Excel.", level: "Intermediate", minutes: 12, status: "Planned", publishStatus: "Planned", platforms: ["Microsoft"], category: "Microsoft", topics: ["Business Workflows", "Automation"], priority: 2 },
    { key: "rm-copilot-powerpoint", title: "How to Use Copilot in PowerPoint", blurb: "Turn notes and docs into slides with Copilot in PowerPoint.", level: "Intermediate", minutes: 10, status: "Planned", publishStatus: "Planned", platforms: ["Microsoft"], category: "Microsoft", topics: ["Business Workflows"], priority: 3 },
    { key: "rm-copilot-outlook", title: "How to Use Copilot in Outlook", blurb: "Draft and triage email faster with Copilot in Outlook.", level: "Intermediate", minutes: 9, status: "Planned", publishStatus: "Planned", platforms: ["Microsoft"], category: "Microsoft", topics: ["Business Workflows"], priority: 3 },
    { key: "rm-copilot-teams", title: "How to Use Copilot in Teams", blurb: "Summarize meetings and capture action items with Copilot in Teams.", level: "Intermediate", minutes: 10, status: "Planned", publishStatus: "Planned", platforms: ["Microsoft"], category: "Microsoft", topics: ["Business Workflows"], priority: 3 },
    { key: "rm-copilot-studio", title: "How to Use Copilot Studio", blurb: "Build custom copilots for your team without heavy coding.", level: "Intermediate", minutes: 14, status: "Planned", publishStatus: "Planned", platforms: ["Microsoft"], category: "Microsoft", topics: ["Automation"], priority: 3 },
    { key: "rm-copilot-studio-agents", title: "How to Build AI Agents with Copilot Studio", blurb: "Create automated agents for business tasks in Copilot Studio.", level: "Intermediate", minutes: 16, status: "Planned", publishStatus: "Planned", platforms: ["Microsoft"], category: "Microsoft", topics: ["Automation"], priority: 3 },
    { key: "rm-github-copilot", title: "How to Use GitHub Copilot for Coding", blurb: "Write and refactor code faster with GitHub Copilot.", level: "Intermediate", minutes: 12, status: "Planned", publishStatus: "Planned", platforms: ["Microsoft"], category: "Microsoft", topics: ["Coding"], priority: 2 },

    { key: "rm-what-is-higgsfield", title: "What is Higgsfield? Beginner Guide", blurb: "A plain-English intro to Higgsfield's creator studios.", level: "Intermediate", minutes: 10, status: "Planned", publishStatus: "Planned", platforms: ["Higgsfield"], category: "Creator Tools", topics: ["Creator Tools", "Video Creation"], priority: 2 },
    { key: "rm-higgsfield-setup", title: "How to Set Up Higgsfield for AI Video Creation", blurb: "Set up Higgsfield and generate your first AI video, step by step.", level: "Intermediate", minutes: 13, status: "Planned", publishStatus: "Coming Next", platforms: ["Higgsfield"], category: "Creator Tools", topics: ["Video Creation", "Setup", "Creator Tools"], priority: 1 },
    { key: "rm-higgsfield-image-tools", title: "How to Use Higgsfield Image Tools", blurb: "Create images and stills with Higgsfield's image tools.", level: "Intermediate", minutes: 11, status: "Planned", publishStatus: "Planned", platforms: ["Higgsfield"], category: "Creator Tools", topics: ["Image Creation", "Creator Tools"], priority: 2 },
    { key: "rm-higgsfield-video-tools", title: "How to Use Higgsfield Video Tools", blurb: "Generate and refine video clips with Higgsfield's video tools.", level: "Intermediate", minutes: 12, status: "Planned", publishStatus: "Planned", platforms: ["Higgsfield"], category: "Creator Tools", topics: ["Video Creation", "Creator Tools"], priority: 2 },
    { key: "rm-higgsfield-cinema-studio", title: "How to Use Higgsfield Cinema Studio", blurb: "Direct cinematic scenes with Higgsfield Cinema Studio.", level: "Intermediate", minutes: 13, status: "Planned", publishStatus: "Planned", platforms: ["Higgsfield"], category: "Creator Tools", topics: ["Video Creation", "Creator Tools"], priority: 3 },
    { key: "rm-higgsfield-shorts-studio", title: "How to Use Higgsfield Shorts Studio", blurb: "Produce short-form video with Higgsfield Shorts Studio.", level: "Intermediate", minutes: 12, status: "Planned", publishStatus: "Planned", platforms: ["Higgsfield"], category: "Creator Tools", topics: ["Social Media", "Video Creation"], priority: 3 },
    { key: "rm-higgsfield-marketing-studio", title: "How to Use Higgsfield Marketing Studio", blurb: "Create marketing videos and ads with Higgsfield Marketing Studio.", level: "Intermediate", minutes: 13, status: "Planned", publishStatus: "Planned", platforms: ["Higgsfield"], category: "Creator Tools", topics: ["Business Workflows", "Video Creation"], priority: 3 },
    { key: "rm-higgsfield-hero-videos", title: "How to Create Website Hero Videos with Higgsfield", blurb: "Produce a cinematic website hero video with Higgsfield.", level: "Intermediate", minutes: 14, status: "Planned", publishStatus: "Planned", platforms: ["Higgsfield"], category: "Creator Tools", topics: ["Video Creation", "Website Building"], priority: 1 },
    { key: "rm-higgsfield-character-motion", title: "How to Create Character Motion Shots with Higgsfield", blurb: "Animate characters and motion shots with Higgsfield.", level: "Intermediate", minutes: 13, status: "Planned", publishStatus: "Planned", platforms: ["Higgsfield"], category: "Creator Tools", topics: ["Video Creation", "Creator Tools"], priority: 3 },
    { key: "rm-higgsfield-vs-runway-flow", title: "Higgsfield vs Runway vs Google Flow", blurb: "Compare three AI video tools to pick the right one for your project.", level: "Intermediate", minutes: 12, status: "Planned", publishStatus: "Planned", platforms: ["Higgsfield", "Runway", "Google AI"], category: "Creator Tools", topics: ["Video Creation"], priority: 2 },

    { key: "rm-runway-ai-video", title: "How to Use Runway for AI Video", blurb: "Generate and edit video with Runway's creative suite.", level: "Intermediate", minutes: 12, status: "Planned", publishStatus: "Planned", platforms: ["Runway"], category: "Creator Tools", topics: ["Video Creation", "Creator Tools"], priority: 1 },
    { key: "rm-runway-product-videos", title: "How to Use Runway for Product Videos", blurb: "Make product videos and short ads with Runway.", level: "Intermediate", minutes: 12, status: "Planned", publishStatus: "Planned", platforms: ["Runway"], category: "Creator Tools", topics: ["Video Creation", "Business Workflows"], priority: 3 },
    { key: "rm-firefly-images-design", title: "How to Use Adobe Firefly for Images and Design", blurb: "Generate images and design assets with Adobe Firefly.", level: "Intermediate", minutes: 12, status: "Planned", publishStatus: "Planned", platforms: ["Adobe Firefly"], category: "Creator Tools", topics: ["Image Creation", "Design"], priority: 2 },
    { key: "rm-canva-social-graphics", title: "How to Use Canva AI for Social Media Graphics", blurb: "Design social graphics fast and keep them on-brand with Canva AI.", level: "Intermediate", minutes: 11, status: "Planned", publishStatus: "Planned", platforms: ["Canva AI"], category: "Creator Tools", topics: ["Design", "Social Media"], priority: 2 },
    { key: "rm-midjourney-image-creation", title: "How to Use Midjourney for Image Creation", blurb: "Create stylized, high-quality images with Midjourney.", level: "Intermediate", minutes: 12, status: "Planned", publishStatus: "Planned", platforms: ["Midjourney"], category: "Creator Tools", topics: ["Image Creation"], priority: 2 },
    { key: "rm-stability-image-generation", title: "How to Use Stability AI for Image Generation", blurb: "Generate images with open Stability AI models.", level: "Intermediate", minutes: 12, status: "Planned", publishStatus: "Planned", platforms: ["Stability AI"], category: "Creator Tools", topics: ["Image Creation"], priority: 3 },
    { key: "rm-leonardo-product-images", title: "How to Use Leonardo AI for Product Images", blurb: "Create product and concept images with Leonardo AI.", level: "Intermediate", minutes: 12, status: "Planned", publishStatus: "Planned", platforms: ["Leonardo AI"], category: "Creator Tools", topics: ["Image Creation"], priority: 3 },
    { key: "rm-elevenlabs-voiceovers", title: "How to Use ElevenLabs for Voiceovers", blurb: "Generate natural voiceovers and narration with ElevenLabs.", level: "Intermediate", minutes: 11, status: "Planned", publishStatus: "Planned", platforms: ["ElevenLabs"], category: "Creator Tools", topics: ["Creator Tools"], priority: 2 },
    { key: "rm-heygen-synthesia-avatars", title: "How to Use HeyGen or Synthesia for AI Avatars", blurb: "Create avatar and presenter videos with HeyGen or Synthesia.", level: "Intermediate", minutes: 12, status: "Planned", publishStatus: "Planned", platforms: ["HeyGen", "Synthesia"], category: "Creator Tools", topics: ["Video Creation", "Creator Tools"], priority: 3 },
    { key: "rm-suno-udio-music", title: "How to Use Suno or Udio for AI Music", blurb: "Generate original music and vocals with Suno or Udio.", level: "Intermediate", minutes: 11, status: "Planned", publishStatus: "Planned", platforms: ["Suno", "Udio"], category: "Creator Tools", topics: ["Creator Tools"], priority: 3 },

    // ── ADVANCED (25) ──────────────────────────────────────────────────────
    { key: "rm-cursor-website-development", title: "How to Use Cursor for Website Development", blurb: "Build and refactor a full website in the Cursor AI editor.", level: "Advanced", minutes: 16, status: "Planned", publishStatus: "Planned", platforms: ["Cursor"], category: "Coding & Apps", topics: ["Coding", "Website Building", "Project Builds"], priority: 1 },
    { key: "rm-replit-beginner-projects", title: "How to Use Replit AI for Beginner Projects", blurb: "Build a small working project in the browser with Replit AI.", level: "Advanced", minutes: 15, status: "Planned", publishStatus: "Planned", platforms: ["Replit"], category: "Coding & Apps", topics: ["Coding", "Project Builds"], priority: 2 },
    { key: "rm-lovable-build-apps", title: "How to Use Lovable to Build Apps", blurb: "Turn a prompt into a working app with Lovable.", level: "Advanced", minutes: 16, status: "Planned", publishStatus: "Planned", platforms: ["Lovable"], category: "Coding & Apps", topics: ["Coding", "Project Builds"], priority: 3 },
    { key: "rm-bolt-build-apps", title: "How to Use Bolt to Build Apps", blurb: "Prototype and ship apps quickly with Bolt.", level: "Advanced", minutes: 16, status: "Planned", publishStatus: "Planned", platforms: ["Bolt"], category: "Coding & Apps", topics: ["Coding", "Project Builds"], priority: 3 },
    { key: "rm-v0-ui-designs", title: "How to Use v0 to Create UI Designs", blurb: "Generate UI components and layouts with v0.", level: "Advanced", minutes: 14, status: "Planned", publishStatus: "Planned", platforms: ["v0"], category: "Coding & Apps", topics: ["Design", "Coding"], priority: 3 },
    { key: "rm-ai-fix-code-errors", title: "How to Use AI to Fix Code Errors", blurb: "Paste errors and get targeted, safe fixes from AI.", level: "Advanced", minutes: 12, status: "Planned", publishStatus: "Planned", platforms: ["Cursor", "Anthropic"], category: "Coding & Apps", topics: ["Coding"], priority: 2 },
    { key: "rm-review-ai-code-safely", title: "How to Review AI-Generated Code Safely", blurb: "Check AI code for bugs, security, and correctness before you ship.", level: "Advanced", minutes: 13, status: "Planned", publishStatus: "Planned", platforms: ["Multi-platform"], category: "Coding & Apps", topics: ["Coding", "Safety & Privacy"], priority: 2 },
    { key: "rm-build-landing-page-ai", title: "How to Build a Landing Page with AI", blurb: "Go from brief to a working landing page with AI, step by step.", level: "Advanced", minutes: 17, status: "Planned", publishStatus: "Planned", platforms: ["Cursor", "Anthropic"], category: "Coding & Apps", topics: ["Website Building", "Project Builds"], priority: 2 },
    { key: "rm-build-free-tool-ai", title: "How to Build a Free Tool with AI", blurb: "Build a simple, useful free tool that helps your audience.", level: "Advanced", minutes: 18, status: "Planned", publishStatus: "Planned", platforms: ["Replit", "Cursor"], category: "Coding & Apps", topics: ["Project Builds", "Monetization & SEO"], priority: 3 },
    { key: "rm-app-idea-to-prototype", title: "How to Turn an App Idea into a Working Prototype", blurb: "Take an idea to a testable prototype with AI coding tools.", level: "Advanced", minutes: 18, status: "Planned", publishStatus: "Planned", platforms: ["Multi-platform"], category: "Coding & Apps", topics: ["Project Builds", "Coding"], priority: 3 },

    { key: "rm-automate-blog-research", title: "How to Automate Blog Research with AI", blurb: "Build a repeatable system for blog research and outlines.", level: "Advanced", minutes: 16, status: "Planned", publishStatus: "Planned", platforms: ["Multi-platform"], category: "Automation & Business", topics: ["Automation", "Research", "Business Workflows"], priority: 1 },
    { key: "rm-automate-social-content", title: "How to Automate Social Media Content with AI", blurb: "Plan and produce social content on a schedule with AI.", level: "Advanced", minutes: 15, status: "Planned", publishStatus: "Planned", platforms: ["Multi-platform"], category: "Automation & Business", topics: ["Automation", "Social Media"], priority: 2 },
    { key: "rm-automate-real-estate-leads", title: "How to Automate Real Estate Lead Capture with AI", blurb: "Capture and qualify real estate leads automatically.", level: "Advanced", minutes: 16, status: "Planned", publishStatus: "Planned", platforms: ["Multi-platform"], category: "Automation & Business", topics: ["Automation", "Real Estate AI"], priority: 3 },
    { key: "rm-automate-client-intake", title: "How to Automate Client Intake Forms with AI", blurb: "Turn intake forms into structured, actionable data.", level: "Advanced", minutes: 14, status: "Planned", publishStatus: "Planned", platforms: ["Multi-platform"], category: "Automation & Business", topics: ["Automation", "Business Workflows"], priority: 3 },
    { key: "rm-automate-spreadsheet-workflows", title: "How to Automate Spreadsheet Workflows with AI", blurb: "Clean, analyze, and report on spreadsheets automatically.", level: "Advanced", minutes: 15, status: "Planned", publishStatus: "Planned", platforms: ["Microsoft", "Google AI"], category: "Automation & Business", topics: ["Automation", "Business Workflows"], priority: 2 },
    { key: "rm-automate-launch-content", title: "How to Automate Product Launch Content", blurb: "Generate a full product launch content pack with AI.", level: "Advanced", minutes: 16, status: "Planned", publishStatus: "Planned", platforms: ["Multi-platform"], category: "Automation & Business", topics: ["Automation", "Business Workflows"], priority: 3 },
    { key: "rm-free-tool-traffic", title: "How to Create a Free Tool That Brings Traffic to Your Website", blurb: "Build a lead-generating free tool that ranks and converts.", level: "Advanced", minutes: 18, status: "Planned", publishStatus: "Planned", platforms: ["Multi-platform"], category: "Automation & Business", topics: ["Monetization & SEO", "Project Builds"], priority: 2 },
    { key: "rm-tutorials-to-blog-traffic", title: "How to Turn AI Tutorials into Blog Traffic", blurb: "Repurpose tutorials into search-friendly blog content.", level: "Advanced", minutes: 14, status: "Planned", publishStatus: "Planned", platforms: ["Multi-platform"], category: "Automation & Business", topics: ["Monetization & SEO"], priority: 3 },
    { key: "rm-content-to-newsletter", title: "How to Turn AI Content into a Newsletter", blurb: "Build a newsletter growth system from your AI content.", level: "Advanced", minutes: 14, status: "Planned", publishStatus: "Planned", platforms: ["Multi-platform"], category: "Automation & Business", topics: ["Monetization & SEO", "Business Workflows"], priority: 3 },
    { key: "rm-resource-hub-ranks", title: "How to Build a Resource Hub That Ranks on Google", blurb: "Design a resource hub that earns steady organic traffic.", level: "Advanced", minutes: 17, status: "Planned", publishStatus: "Planned", platforms: ["Multi-platform"], category: "Automation & Business", topics: ["Monetization & SEO", "Website Building"], priority: 2 },

    { key: "rm-yt-best-chatgpt", title: "Best YouTube Tutorials for ChatGPT", blurb: "A curated video path for ChatGPT, paired with CinNova checklists and prompts.", level: "Advanced", minutes: 10, status: "Planned", publishStatus: "Planned", platforms: ["OpenAI"], category: "YouTube Learning Paths", topics: ["YouTube Learning Paths"], priority: 3 },
    { key: "rm-yt-best-claude", title: "Best YouTube Tutorials for Claude", blurb: "A curated video path for Claude, paired with CinNova checklists and prompts.", level: "Advanced", minutes: 10, status: "Planned", publishStatus: "Planned", platforms: ["Anthropic"], category: "YouTube Learning Paths", topics: ["YouTube Learning Paths"], priority: 3 },
    { key: "rm-yt-best-google", title: "Best YouTube Tutorials for Google AI", blurb: "A curated video path for Google AI, paired with CinNova checklists and prompts.", level: "Advanced", minutes: 10, status: "Planned", publishStatus: "Planned", platforms: ["Google AI"], category: "YouTube Learning Paths", topics: ["YouTube Learning Paths"], priority: 3 },
    { key: "rm-yt-best-higgsfield-runway", title: "Best YouTube Tutorials for Higgsfield and Runway", blurb: "A curated video path for Higgsfield and Runway, paired with CinNova checklists.", level: "Advanced", minutes: 10, status: "Planned", publishStatus: "Planned", platforms: ["Higgsfield", "Runway"], category: "YouTube Learning Paths", topics: ["YouTube Learning Paths", "Video Creation"], priority: 3 },
    { key: "rm-check-ai-answers", title: "How to Check AI Answers Before Publishing", blurb: "A verification checklist to catch AI mistakes before you publish anything.", level: "Advanced", minutes: 12, status: "Planned", publishStatus: "Planned", platforms: ["Multi-platform"], category: "Safety", topics: ["Safety & Privacy"], priority: 2 },
];
