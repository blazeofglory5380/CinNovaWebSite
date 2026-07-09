// ============================================================
// CinNova — AI Tutorials page data
// All tutorial links use /blog/{slug}.
// Category links use /blog/category/{categorySlug}.
// ============================================================

export const weeklyCards = [
  {
    id: 'this-week',
    eyebrow: "This week's tutorial",
    status: 'available',
    statusLabel: 'Available',
    title: 'How to Set Up Your First AI Workspace',
    desc: "Create accounts, pick your core tools, and organize a clean AI workspace you'll actually use.",
    href: '/?page=ai-workspace-setup-guide',
    linkLabel: 'Read the guide →',
  },
  {
    id: 'next-week',
    eyebrow: 'Coming next week',
    status: 'planned',
    statusLabel: 'Planned',
    title: 'How to Use Higgsfield for AI Video Creation',
    desc: 'A beginner guide to generating your first AI video — from prompt to finished clip.',
    href: null,
    linkLabel: null,
  },
  {
    id: 'roadmap',
    eyebrow: 'Tutorial roadmap',
    status: 'neutral',
    statusLabel: '100 planned',
    title: '100 tutorials across every AI skill',
    desc: 'Platforms, creator tools, automation, coding, design, business, and project builds.',
    href: '#ai-tutorials-roadmap',
    linkLabel: 'See the roadmap →',
  },
];

export const starterPrinciples = [
  {
    num: '01',
    title: 'Give clear instructions',
    desc: 'AI tools respond to how you ask. A little structure — role, task, context — dramatically improves results.',
  },
  {
    num: '02',
    title: 'Always verify',
    desc: 'AI can sound confident and still be wrong. Treat output as a first draft and check anything that matters.',
  },
  {
    num: '03',
    title: 'Protect your privacy',
    desc: 'Never paste passwords, API keys, or confidential files. Interfaces change — review official settings.',
  },
];

export const filterCategories = [
  'All',
  'Foundation',
  'AI Tools',
  'Claude Workflows',
  'Coding',
  'Design & Creative',
  'Research',
  'Video & Content',
];

// Guide slugs map to the real, existing CinNova guide routes (?page=<key>).
// The guides live at ?page= routes on this site, not at /blog/{slug}, so links
// resolve to real pages instead of a blog not-found.
const GUIDE_ROUTE = {
  'how-to-write-better-ai-prompts': '/?page=ai-prompt-writing-guide',
  'how-to-use-ai-for-research': '/?page=ai-research-guide',
  'how-to-use-ai-for-coding': '/?page=ai-coding-guide',
  'how-to-use-chatgpt': '/?page=chatgpt-beginner-guide',
  'how-to-use-claude': '/?page=claude-beginner-guide',
  'how-to-use-google-gemini': '/?page=gemini-beginner-guide',
  'how-to-use-microsoft-copilot': '/?page=microsoft-copilot-beginner-guide',
  'how-to-use-perplexity': '/?page=perplexity-beginner-guide',
  'how-to-use-cursor': '/?page=cursor-beginner-guide',
  'how-to-use-replit-ai': '/?page=replit-beginner-guide',
  'how-to-use-canva-ai': '/?page=canva-ai-beginner-guide',
  'using-claude-with-adobe': '/?page=claude-with-adobe-guide',
  'designing-a-website-with-claude': '/?page=claude-website-design-guide',
  'better-art-prompts-with-claude': '/?page=claude-art-prompts-guide',
  'branding-and-marketing-with-claude': '/?page=claude-branding-marketing-guide',
  'using-claude-with-canva': '/?page=claude-with-canva-guide',
  'using-claude-with-figma': '/?page=claude-with-figma-guide',
  'using-claude-with-cursor': '/?page=claude-with-cursor-guide',
  'using-claude-with-higgsfield': '/?page=claude-with-higgsfield-guide',
};
export const guideRouteFor = (slug) => GUIDE_ROUTE[slug] || `/blog/${slug}`;

// tags drive the Guide Finder filters; a guide can appear under several.
export const guides = [
  { category: 'Foundation', tags: ['Foundation'], title: 'How to Write Better AI Prompts', slug: 'how-to-write-better-ai-prompts', time: '8 min', desc: 'Learn the role + task + context + format formula, with good and bad examples.' },
  { category: 'Foundation', tags: ['Foundation', 'Research'], title: 'How to Use AI for Research', slug: 'how-to-use-ai-for-research', time: '9 min', desc: 'Build outlines, find leads, summarize notes, and verify facts without trusting hallucinations.' },
  { category: 'Foundation', tags: ['Foundation', 'Coding'], title: 'How to Use AI for Coding', slug: 'how-to-use-ai-for-coding', time: '9 min', desc: 'Plan a project, generate small functions, debug errors, and review code before you commit.' },
  { category: 'Tool Guide', tags: ['AI Tools'], title: 'How to Use ChatGPT', slug: 'how-to-use-chatgpt', time: '9 min', desc: 'Writing, studying, planning, and coding help — with clear steps and example prompts.' },
  { category: 'Tool Guide', tags: ['AI Tools'], title: 'How to Use Claude', slug: 'how-to-use-claude', time: '9 min', desc: 'Drafting, summarizing, planning, and document-style work — step by step for beginners.' },
  { category: 'Tool Guide', tags: ['AI Tools'], title: 'How to Use Google Gemini', slug: 'how-to-use-google-gemini', time: '9 min', desc: 'Writing, research support, productivity, and everyday AI help, explained simply.' },
  { category: 'Tool Guide', tags: ['AI Tools'], title: 'How to Use Microsoft Copilot', slug: 'how-to-use-microsoft-copilot', time: '9 min', desc: 'Email, documents, spreadsheets, and meeting help for everyday work — with privacy guidance.' },
  { category: 'Tool Guide', tags: ['AI Tools', 'Research'], title: 'How to Use Perplexity', slug: 'how-to-use-perplexity', time: '9 min', desc: 'Research questions, follow-ups, comparing sources, and verifying facts.' },
  { category: 'Tool Guide', tags: ['AI Tools', 'Coding'], title: 'How to Use Cursor', slug: 'how-to-use-cursor', time: '10 min', desc: 'Describe a project, plan first, work file by file, and review changes safely.' },
  { category: 'Tool Guide', tags: ['AI Tools', 'Coding'], title: 'How to Use Replit AI', slug: 'how-to-use-replit-ai', time: '10 min', desc: 'Build a small project in the browser, generate features one at a time, and debug.' },
  { category: 'Tool Guide', tags: ['AI Tools', 'Design & Creative'], title: 'How to Use Canva AI', slug: 'how-to-use-canva-ai', time: '9 min', desc: 'Choose a format, write clear design prompts, edit the result, and keep brand consistency.' },
  { category: 'Claude Workflow', tags: ['Claude Workflows', 'Design & Creative'], title: 'Using Claude with Adobe', slug: 'using-claude-with-adobe', time: '10 min', desc: 'Plan briefs, mood boards, copy, and reviews with Claude alongside your Adobe tools.' },
  { category: 'Claude Workflow', tags: ['Claude Workflows', 'Design & Creative'], title: 'Designing a Website with Claude', slug: 'designing-a-website-with-claude', time: '11 min', desc: 'Define goals, build a sitemap, draft copy and wireframe notes, and prep a dev handoff.' },
  { category: 'Claude Workflow', tags: ['Claude Workflows', 'Video & Content'], title: 'Better Art Prompts with Claude', slug: 'better-art-prompts-with-claude', time: '10 min', desc: 'Turn ideas into detailed art prompts — subject, style, mood, lighting, composition.' },
  { category: 'Claude Workflow', tags: ['Claude Workflows'], title: 'Branding & Marketing with Claude', slug: 'branding-and-marketing-with-claude', time: '11 min', desc: 'Shape audience, positioning, voice, content pillars, and launch copy.' },
  { category: 'Claude Workflow', tags: ['Claude Workflows', 'Design & Creative'], title: 'Using Claude with Canva', slug: 'using-claude-with-canva', time: '10 min', desc: 'Plan briefs, copy, and layout ideas with Claude, then build and review the design.' },
  { category: 'Claude Workflow', tags: ['Claude Workflows', 'Design & Creative'], title: 'Using Claude with Figma', slug: 'using-claude-with-figma', time: '11 min', desc: 'Map user flows, wireframe notes, and UX copy with Claude, then design and hand off.' },
  { category: 'Claude Workflow', tags: ['Claude Workflows', 'Coding'], title: 'Using Claude with Cursor', slug: 'using-claude-with-cursor', time: '11 min', desc: 'Plan features and review risk with Claude, make changes in Cursor, verify before committing.' },
  { category: 'Claude Workflow', tags: ['Claude Workflows', 'Video & Content'], title: 'Using Claude with Higgsfield', slug: 'using-claude-with-higgsfield', time: '11 min', desc: 'Plan concepts and scene-by-scene AI video prompts, then generate footage in the tool.' },
];

export const claudeWorkflows = [
  { initials: 'AD', title: 'Claude + Adobe', desc: 'Plan briefs, mood boards, copy, and reviews before Adobe work.', slug: 'using-claude-with-adobe' },
  { initials: 'WD', title: 'Claude + Website Design', desc: 'Goals, sitemap, copy, wireframe notes, and developer handoff.', slug: 'designing-a-website-with-claude' },
  { initials: 'AP', title: 'Claude + Art Prompts', desc: 'Detailed art prompts — subject, style, mood, lighting, composition.', slug: 'better-art-prompts-with-claude' },
  { initials: 'BM', title: 'Claude + Branding & Marketing', desc: 'Audience, positioning, voice, content pillars, and launch copy.', slug: 'branding-and-marketing-with-claude' },
  { initials: 'CV', title: 'Claude + Canva', desc: 'Plan briefs, copy, and layout ideas, then build and review the design.', slug: 'using-claude-with-canva' },
  { initials: 'FG', title: 'Claude + Figma', desc: 'User flows, wireframe notes, and UX copy before Figma work.', slug: 'using-claude-with-figma' },
  { initials: 'CU', title: 'Claude + Cursor', desc: 'Plan features and review risk, make changes, verify before committing.', slug: 'using-claude-with-cursor' },
  { initials: 'HG', title: 'Claude + Higgsfield', desc: 'Scene-by-scene AI video prompts, then generate footage in the tool.', slug: 'using-claude-with-higgsfield' },
];

export const browseLevels = [
  { name: 'Beginner', modifier: 'beginner', desc: 'Start here if you are new to AI. These tutorials explain every screen, button, menu, and step.', href: '/blog/category/ai-tutorials' },
  { name: 'Intermediate', modifier: 'intermediate', desc: 'Improve your results with better prompts, tool combinations, reusable workflows, and practical project systems.', href: '/blog/category/ai-tutorials' },
  { name: 'Advanced', modifier: 'advanced', desc: 'Build full AI systems for automation, business workflows, content pipelines, agents, SEO, and product launches.', href: '/blog/category/ai-tutorials' },
];

// available: true → green chip; false → muted (planned)
export const browseTopics = [
  { name: 'AI Basics', available: true },
  { name: 'Setup', available: false },
  { name: 'Prompting', available: true },
  { name: 'Research', available: true },
  { name: 'Image Creation', available: false },
  { name: 'Video Creation', available: false },
  { name: 'Design', available: true },
  { name: 'Website Building', available: true },
  { name: 'Coding', available: true },
  { name: 'Automation', available: false },
  { name: 'Business Workflows', available: true },
  { name: 'Creator Tools', available: false },
  { name: 'Social Media', available: false },
  { name: 'Real Estate AI', available: false },
  { name: 'Safety & Privacy', available: false },
  { name: 'YouTube Learning Paths', available: false },
  { name: 'Monetization & SEO', available: false },
  { name: 'Project Builds', available: false },
].map((t) => ({ ...t, href: '/blog/category/ai-tutorials' }));

export const roadmapStats = [
  { value: '19', label: 'Available now', highlight: true },
  { value: '12', label: 'Coming soon', highlight: false },
  { value: '44', label: 'Planned', highlight: false },
  { value: '25', label: 'Advanced projects', highlight: false },
];

export const roadmapItems = [
  { tag: 'Available', status: 'available', title: 'How to Set Up Your First AI Workspace', meta: 'Setup · Beginner · 14 min' },
  { tag: 'Soon', status: 'planned', title: 'How to Use Higgsfield for AI Video Creation', meta: 'Video Creation · Beginner · 12 min' },
  { tag: 'Soon', status: 'planned', title: 'How to Choose the Right AI Tool for the Job', meta: 'AI Basics · Beginner · 10 min' },
  { tag: 'Planned', status: 'planned', title: 'How to Set Up an AI Image Workflow', meta: 'Image Creation · Beginner · 11 min' },
  { tag: 'Advanced', status: 'planned', title: 'Build a Multi-Platform AI Creator Workspace', meta: 'Project Builds · Advanced · 14 min' },
];

export const languageLinks = [
  { code: 'ES', name: 'Español', href: '/blog/category/ai-tutorials-es' },
  { code: 'FR', name: 'Français', href: '/blog/category/ai-tutorials-fr' },
  { code: 'DE', name: 'Deutsch', href: '/blog/category/ai-tutorials-de' },
];

export const tutorialCategories = [
  { name: 'AI for beginners', slug: 'ai-for-beginners' },
  { name: 'Prompt writing', slug: 'prompt-writing' },
  { name: 'AI writing & research', slug: 'ai-writing-research' },
  { name: 'AI coding', slug: 'ai-coding' },
  { name: 'AI image generation', slug: 'ai-image-generation' },
  { name: 'AI video generation', slug: 'ai-video-generation' },
  { name: 'AI voice & audio', slug: 'ai-voice-audio' },
  { name: 'AI business automation', slug: 'ai-business-automation' },
  { name: 'AI productivity', slug: 'ai-productivity' },
  { name: 'AI safety & responsible use', slug: 'ai-safety-responsible-use' },
].map((c) => ({ ...c, href: `/blog/category/${c.slug}` }));

export const aiCompanies = [
  { initials: 'OA', name: 'OpenAI', sub: 'ChatGPT', logoClass: 'openai' },
  { initials: 'AN', name: 'Anthropic', sub: 'Claude', logoClass: 'anthropic' },
  { initials: 'G', name: 'Google', sub: 'Gemini', logoClass: 'google' },
  { initials: 'MS', name: 'Microsoft', sub: 'Copilot', logoClass: 'microsoft' },
  { initials: 'ME', name: 'Meta AI', sub: 'Llama', logoClass: 'meta' },
  { initials: 'PX', name: 'Perplexity', sub: 'Search & research', logoClass: 'perplexity' },
  { initials: 'MI', name: 'Mistral', sub: 'Le Chat', logoClass: 'mistral' },
  { initials: 'RW', name: 'Runway', sub: 'AI video', logoClass: 'neutral' },
  { initials: 'EL', name: 'ElevenLabs', sub: 'AI voice', logoClass: 'neutral' },
  { initials: 'CV', name: 'Canva', sub: 'Canva AI', logoClass: 'canva' },
  { initials: 'CU', name: 'Cursor', sub: 'AI coding', logoClass: 'neutral' },
  { initials: 'RP', name: 'Replit', sub: 'AI app building', logoClass: 'replit' },
  { initials: 'MJ', name: 'Midjourney', sub: 'AI images', logoClass: 'midjourney' },
  { initials: 'SA', name: 'Stability AI', sub: 'Stable Diffusion', logoClass: 'stability' },
].map((c) => ({ ...c, href: '/blog/category/ai-tutorials' }));

export const featuredCreatorPlatform = {
  badge: 'Featured platform',
  name: 'Higgsfield',
  desc: 'Our featured AI video platform for creators — cinematic video from text and images, covered across setup, prompting, and full workflow guides.',
  href: '/?page=higgsfield-ai-video-setup-guide',
  linkLabel: 'Start with Higgsfield →',
};

export const creatorGroups = [
  { label: 'AI Video', tools: ['Runway', 'Luma AI', 'Pika', 'Kling AI', 'HeyGen', 'Synthesia'] },
  { label: 'AI Images', tools: ['Midjourney', 'Stability AI', 'Leonardo AI', 'Adobe Firefly'] },
  { label: 'Voice & Audio', tools: ['ElevenLabs', 'Suno', 'Udio', 'Descript'] },
  { label: 'Design & Editing', tools: ['Canva AI', 'Figma AI', 'CapCut AI'] },
].map((g) => ({
  ...g,
  tools: g.tools.map((name) => ({ name, href: '/blog/category/ai-tutorials' })),
}));

export const projectTracks = [
  { initials: 'WB', title: 'AI Website Builder Track', desc: 'Plan, design, and launch a real website with AI at every step.' },
  { initials: 'CR', title: 'AI Creator Track', desc: 'Video, image, voice, and design tools combined into one creator workflow.' },
  { initials: 'BA', title: 'AI Business Automation Track', desc: 'Connect tools and automate repetitive back-office work end to end.' },
  { initials: 'RE', title: 'AI Real Estate Track', desc: 'Analyze deals, score properties, and support investor decisions with AI.' },
  { initials: 'CA', title: 'AI Coding & App Track', desc: 'Go from idea to working app with AI-assisted planning, coding, and review.' },
  { initials: 'CN', title: 'CinNova Product Project Track', desc: 'Build real projects on CinNova products, from setup to launch.' },
].map((t) => ({ ...t, href: '/blog/category/ai-tutorials' }));

export const youtubePaths = [
  'ChatGPT',
  'Claude',
  'Google AI',
  'Higgsfield',
  'Runway',
  'Canva AI',
  'Cursor & AI coding',
  'AI automation',
  'AI website design',
  'AI business workflows',
].map((name) => ({ name }));

export const ctaButtons = [
  { label: 'Blog', href: '/blog' },
  { label: 'Products', href: '/?page=products' },
  { label: 'Real Estate AI', href: '/?page=real-estate' },
  { label: 'Free Rental Calculator', href: '/?page=free-rental-property-calculator' },
];
