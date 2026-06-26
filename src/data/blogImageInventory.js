/**
 * Blog editorial image inventory — unique hero assignments and category pools.
 * Each published article maps to one asset. Pool images are reserved for future posts.
 */

export const blogImageCategories = {
    "Artificial Intelligence": {
        folder: "ai",
        topics: ["AI infrastructure", "machine learning", "AI business", "AI assistants"],
    },
    "Education Technology": {
        folder: "education",
        topics: ["classrooms", "study techniques", "tutoring", "online learning", "parent tools"],
    },
    "Real Estate Technology": {
        folder: "real-estate",
        topics: ["modern homes", "property search", "deal analysis", "investing"],
    },
    "Healthcare Technology": {
        folder: "healthcare",
        topics: ["family safety", "poison prevention", "emergency preparedness", "home health"],
    },
    "Construction Technology": {
        folder: "construction",
        topics: ["active construction sites", "contractors", "estimating", "jobsites"],
    },
    "Data Centers & Databases": {
        folder: "datacenters",
        topics: ["server racks", "cooling facilities", "cloud infrastructure", "databases"],
    },
    "Robotics & Automation": {
        folder: "robotics",
        topics: ["industrial robots", "warehouse automation", "assembly lines"],
    },
    "Future Technology": {
        folder: "future-tech",
        topics: ["emerging technology", "innovation labs", "research"],
    },
    "Business & Entrepreneurship": {
        folder: "business",
        topics: ["startups", "founders", "validation", "product strategy"],
    },
    "CinNova Updates": {
        folder: "cinnova",
        topics: ["product ecosystem", "roadmap", "company updates"],
    },
};

/** @type {Array<{ id: string, category: string, localPath: string, alt: string, caption?: string, unsplashId: string, creatorName: string, tags: string[] }>} */
export const blogImagePool = [
    // ── Assigned: cornerstone & pillar articles (IDs 1–15, 31–32) ─────────────
    {
        id: "edu-ai-classroom-transforming",
        category: "Education Technology",
        localPath: "/images/education/ai-transforming-education-classroom.jpg",
        alt: "Students and a teacher using AI tools in a modern classroom",
        caption: "AI is reshaping how students learn and how teachers deliver instruction.",
        unsplashId: "1509062522246-3755977927d7",
        creatorName: "Quilia",
        tags: ["classroom", "education", "AI"],
    },
    {
        id: "ai-chatgpt-infrastructure",
        category: "Artificial Intelligence",
        localPath: "/images/ai/chatgpt-infrastructure-data-center.jpg",
        alt: "Server racks inside a large AI data center facility",
        caption: "Behind every AI response is a vast physical infrastructure of chips, servers, and power systems.",
        unsplashId: "1558494949-ef010cbdcc31",
        creatorName: "Taylor Vick",
        tags: ["infrastructure", "servers", "data center"],
    },
    {
        id: "dc-gold-rush-facility",
        category: "Data Centers & Databases",
        localPath: "/images/datacenters/data-center-gold-rush-facility.jpg",
        alt: "Rows of server racks inside a modern hyperscale data center",
        caption: "Data centers have become strategic assets as AI demand for compute accelerates.",
        unsplashId: "1584169417032-d34e8d805e8b",
        creatorName: "İsmail Enes Ayhan",
        tags: ["data center", "servers", "hyperscale"],
    },
    {
        id: "ai-economy-tech-stack",
        category: "Artificial Intelligence",
        localPath: "/images/ai/ai-economy-companies-tech-stack.jpg",
        alt: "Software engineering workspace representing the companies building the AI economy",
        caption: "The AI economy spans chip manufacturers, model labs, cloud platforms, and application developers.",
        unsplashId: "1697577418970-95d99b5a55cf",
        creatorName: "Igor Omilaev",
        tags: ["AI economy", "technology companies"],
    },
    {
        id: "dc-power-grid-demand",
        category: "Data Centers & Databases",
        localPath: "/images/datacenters/power-grid-ai-electricity-demand.jpg",
        alt: "High-voltage power transmission lines supplying electricity to AI data centers",
        caption: "AI data centers are drawing unprecedented electricity demand from regional power grids.",
        unsplashId: "1509391111737-9b07f052f6b6",
        creatorName: "American Public Power Association",
        tags: ["power grid", "electricity", "infrastructure"],
    },
    {
        id: "edu-ai-tutor-dashboard",
        category: "Education Technology",
        localPath: "/images/education/ai-tutor-personalized-learning-dashboard.jpg",
        alt: "Student using an AI tutoring dashboard on a laptop at their desk",
        caption: "AI tutors adapt to each student's pace and learning gaps in real time.",
        unsplashId: "1515378960530-7c0da6231fb1",
        creatorName: "Christin Hume",
        tags: ["AI tutor", "personalized learning"],
    },
    {
        id: "re-deal-analysis-investor",
        category: "Real Estate Technology",
        localPath: "/images/real-estate/ai-real-estate-investing-deal-analysis.jpg",
        alt: "Real estate investor reviewing AI-powered deal analysis on a laptop screen",
        caption: "AI tools are helping real estate investors analyze deals faster and with greater confidence.",
        unsplashId: "1754039985021-5c50d180d7cd",
        creatorName: "Jakub Żerdzicki",
        tags: ["real estate", "investing", "analysis"],
    },
    {
        id: "construction-engineering-jobsite",
        category: "Construction Technology",
        localPath: "/images/construction/ai-construction-engineering-jobsite.jpg",
        alt: "Active construction site with engineers reviewing digital plans",
        caption: "AI is entering construction through estimating, jobsite safety monitoring, and project management.",
        unsplashId: "1653280662710-1cac52cde6d7",
        creatorName: "Shraga Kopstein",
        tags: ["construction", "jobsite", "engineering"],
    },
    {
        id: "robotics-warehouse-automation",
        category: "Robotics & Automation",
        localPath: "/images/robotics/robotics-automation-warehouse-2026.jpg",
        alt: "Automated warehouse robots moving inventory alongside human workers",
        caption: "Robotics and automation are becoming practical for a wider range of industries in 2026.",
        unsplashId: "1647427060118-4911c9821b82",
        creatorName: "Simon Kadula",
        tags: ["warehouse", "automation", "robots"],
    },
    {
        id: "future-tech-decade-trends",
        category: "Future Technology",
        localPath: "/images/future-tech/technology-trends-next-decade-overview.jpg",
        alt: "Engineers collaborating on emerging technology systems in a modern lab",
        caption: "The technology trends shaping the next decade are already in early commercial deployment today.",
        unsplashId: "1581090464777-f3220bbe1b8b",
        creatorName: "ThisisEngineering",
        tags: ["future tech", "innovation", "trends"],
    },
    {
        id: "edu-teacher-ai-partnership",
        category: "Education Technology",
        localPath: "/images/education/ai-tutor-teacher-classroom-partnership.jpg",
        alt: "Teacher working alongside students using AI tutoring tools in a classroom",
        caption: "AI tutors and human teachers are most powerful when they work together rather than compete.",
        unsplashId: "1561089489-f13d5e730d72",
        creatorName: "Shubham Sharan",
        tags: ["teachers", "AI tutors", "classroom"],
    },
    {
        id: "edu-spaced-repetition-flashcards",
        category: "Education Technology",
        localPath: "/images/education/spaced-repetition-flashcard-study-schedule.jpg",
        alt: "Student reviewing flashcards with a spaced repetition study schedule visible on screen",
        caption: "Spaced repetition works by surfacing review material at the moment memory begins to fade.",
        unsplashId: "1584697964328-b1e7f63dca95",
        creatorName: "Annie Spratt",
        tags: ["flashcards", "spaced repetition", "study"],
    },
    {
        id: "edu-student-smarter-ai-tools",
        category: "Education Technology",
        localPath: "/images/education/student-studying-smarter-ai-tools.jpg",
        alt: "College student using AI study tools on a laptop surrounded by notes and flashcards",
        caption: "AI study tools help students organize material, practice recall, and identify weak spots before exams.",
        unsplashId: "1515378791036-0648a3ef77b2",
        creatorName: "Christin Hume",
        tags: ["study tools", "students", "AI"],
    },
    {
        id: "edu-online-adaptive-platform",
        category: "Education Technology",
        localPath: "/images/education/online-education-platform-adaptive-learning.jpg",
        alt: "Student using an adaptive online learning platform on a tablet",
        caption: "The next generation of online learning platforms will combine AI tutoring, analytics, and adaptive review.",
        unsplashId: "1513258496099-48168024aec0",
        creatorName: "Wes Hicks",
        tags: ["online learning", "adaptive", "education platform"],
    },
    {
        id: "edu-studynest-workspace",
        category: "Education Technology",
        localPath: "/images/education/studynest-connected-learning-workspace.jpg",
        alt: "Connected study workspace with notes, flashcards, and a planner on a laptop",
        caption: "StudyNest connects notes, flashcards, AI tutoring, and planning into a single learning workflow.",
        unsplashId: "1541178735493-479c1a27ed24",
        creatorName: "Desola Lanre-Ologun",
        tags: ["StudyNest", "workspace", "study"],
    },
    {
        id: "ai-complete-guide-2026",
        category: "Artificial Intelligence",
        localPath: "/images/ai/ai-complete-guide-2026.jpg",
        alt: "Abstract digital visualization representing artificial intelligence systems and neural networks",
        caption: "Artificial intelligence in 2026 is embedded in education, real estate, safety, business, and daily life.",
        unsplashId: "1677442135703-1787eea5ce01",
        creatorName: "Steve Johnson",
        tags: ["AI guide", "artificial intelligence", "2026"],
    },
    {
        id: "edu-ai-education-guide-2026",
        category: "Education Technology",
        localPath: "/images/education/ai-education-guide-2026.jpg",
        alt: "Students collaborating on laptops in a modern classroom — AI-powered learning in 2026",
        caption: "AI is reshaping how students learn, how teachers teach, and how learning platforms are built.",
        unsplashId: "1580582932707-520aed937b7b",
        creatorName: "Marvin Meyer",
        tags: ["AI education", "classroom", "guide"],
    },

    // ── Assigned: published articles 16–30 ───────────────────────────────────
    {
        id: "healthcare-home-safety-storage",
        category: "Healthcare Technology",
        localPath: "/images/blog/healthcare/household-chemical-safety-storage.jpg",
        alt: "Happy dog in a safe home environment representing family household safety",
        caption: "Organized storage, hazard awareness, and clear labeling are the first line of defense in household safety.",
        unsplashId: "1587300003388-59208cc962cb",
        creatorName: "Jamie Street",
        tags: ["home safety", "families", "pets"],
    },
    {
        id: "edu-parent-child-learning",
        category: "Education Technology",
        localPath: "/images/blog/education/parent-child-learning-support.jpg",
        alt: "Parent helping a child with early learning activities at a table",
        caption: "Parent-focused technology works best when it supports learning routines without replacing attention.",
        unsplashId: "1503454537195-1dcabb73ffb9",
        creatorName: "Jordan Whitt",
        tags: ["parents", "children", "learning"],
    },
    {
        id: "ai-small-business-team",
        category: "Artificial Intelligence",
        localPath: "/images/blog/ai/small-business-ai-assistants-meeting.jpg",
        alt: "Small business team collaborating around laptops in a modern office",
        caption: "AI assistants are most useful for small teams when they handle repeatable documentation and support tasks.",
        unsplashId: "1600880292203-757bb62b4baf",
        creatorName: "Kraken Images",
        tags: ["small business", "AI assistants", "teamwork"],
    },
    {
        id: "re-modern-home-search",
        category: "Real Estate Technology",
        localPath: "/images/blog/real-estate/modern-home-property-search.jpg",
        alt: "Modern suburban home with a manicured lawn — property search and analysis",
        caption: "AI property search adds context beyond bedrooms and price — helping investors compare fit and risk.",
        unsplashId: "1560518883-ce09059eeffa",
        creatorName: "R ARCHITECTURE",
        tags: ["modern home", "property search", "real estate"],
    },
    {
        id: "edu-student-dashboard-desk",
        category: "Education Technology",
        localPath: "/images/blog/education/student-dashboard-notes-desk.jpg",
        alt: "Student organizing notes and study materials on a desk with a laptop",
        caption: "A helpful student dashboard turns assignments and review history into clear next actions.",
        unsplashId: "1498050108023-c5249f4df085",
        creatorName: "Christopher Gower",
        tags: ["student dashboard", "notes", "study"],
    },
    {
        id: "healthcare-emergency-preparedness",
        category: "Healthcare Technology",
        localPath: "/images/blog/healthcare/family-emergency-preparedness.jpg",
        alt: "Friends sitting together in a supportive group representing family and community preparedness",
        caption: "Digital triage works best when families prepare contact details and context before an urgent moment.",
        unsplashId: "1529156069898-49953e39b3ac",
        creatorName: "Duy Pham",
        tags: ["emergency", "family safety", "triage"],
    },
    {
        id: "construction-contractor-tablet",
        category: "Construction Technology",
        localPath: "/images/blog/construction/small-contractor-jobsite-tablet.jpg",
        alt: "Tower crane over an active high-rise construction site",
        caption: "Small contractors gain the most from digital tools that speed up estimating, scheduling, and documentation.",
        unsplashId: "1541888946425-d81bb19240f5",
        creatorName: "Jesse Bowser",
        tags: ["contractor", "jobsite", "construction tech"],
    },
    {
        id: "dc-server-cooling-aisle",
        category: "Data Centers & Databases",
        localPath: "/images/blog/datacenters/server-cooling-aisle.jpg",
        alt: "Close-up of server equipment inside a cooled data center facility",
        caption: "Everyday apps depend on data centers that store, serve, and protect information around the clock.",
        unsplashId: "1680992044138-ce4864c2b962",
        creatorName: "Tyler",
        tags: ["data center", "cooling", "servers"],
    },
    {
        id: "robotics-collaborative-assembly",
        category: "Robotics & Automation",
        localPath: "/images/blog/robotics/collaborative-robot-assembly.jpg",
        alt: "Industrial drone inspecting equipment in a warehouse facility",
        caption: "Automation is reaching everyday businesses through repeatable digital and physical workflows.",
        unsplashId: "1473968512647-3e447244af8f",
        creatorName: "Dose Media",
        tags: ["robotics", "assembly", "automation"],
    },
    {
        id: "future-emerging-tech-lab",
        category: "Future Technology",
        localPath: "/images/blog/future-tech/emerging-technology-research.jpg",
        alt: "Researcher working with advanced technology equipment in a modern lab",
        caption: "The most durable future technology trends solve specific problems with measurable improvements today.",
        unsplashId: "1451187580459-43490279c0fa",
        creatorName: "NASA",
        tags: ["future tech", "research", "innovation"],
    },
    {
        id: "business-founders-whiteboard",
        category: "Business & Entrepreneurship",
        localPath: "/images/blog/business/startup-founders-whiteboard.jpg",
        alt: "Startup founders brainstorming product ideas at a whiteboard",
        caption: "Founders with multiple app ideas need a validation system that compares demand, feasibility, and fit.",
        unsplashId: "1552664730-d307ca884978",
        creatorName: "Jason Goodman",
        tags: ["founders", "startup", "validation"],
    },
    {
        id: "cinnova-team-roadmap",
        category: "CinNova Updates",
        localPath: "/images/home/homepage-hero-innovation.jpg",
        alt: "Software developers collaborating around laptops — building the Cin Nova product ecosystem",
        caption: "Cin Nova is building across education, safety, tech support, early learning, and real estate.",
        unsplashId: "1522071820081-009f0129c71c",
        creatorName: "Annie Spratt",
        tags: ["CinNova", "roadmap", "product team"],
    },
    {
        id: "dc-database-server-operations",
        category: "Data Centers & Databases",
        localPath: "/images/blog/datacenters/database-admin-workstation.jpg",
        alt: "Server racks in a data center operations room",
        caption: "Founders should understand records, relationships, backups, and data quality before products scale.",
        unsplashId: "1695668548342-c0c1ad479aee",
        creatorName: "Kevin Ache",
        tags: ["database", "servers", "operations"],
    },
    {
        id: "construction-blueprint-estimating",
        category: "Construction Technology",
        localPath: "/images/blog/construction/blueprint-cost-estimating.jpg",
        alt: "Skilled worker with tools representing trades-based construction estimating",
        caption: "AI can organize scope and assumptions for construction estimates — human review still matters.",
        unsplashId: "1558618666-fcd25c85cd64",
        creatorName: "Battlecreek Coffee Roasters",
        tags: ["estimating", "blueprints", "construction"],
    },
    {
        id: "robotics-industrial-arm-factory",
        category: "Robotics & Automation",
        localPath: "/images/blog/robotics/industrial-robot-arm-factory.jpg",
        alt: "Complex industrial robot with exposed mechanics on a competition field",
        caption: "The next wave of automation combines physical robots, AI reasoning, and human oversight.",
        unsplashId: "1775826476148-1e35e8a74f09",
        creatorName: "Shivansh Upadhyay",
        tags: ["industrial robot", "factory", "automation"],
    },

    // ── Reserve pool (unassigned — for future articles) ───────────────────────
    {
        id: "pool-ai-neural-network-art",
        category: "Artificial Intelligence",
        localPath: "/images/blog/ai/neural-network-abstract-visualization.jpg",
        alt: "Modern open office workspace representing AI product teams",
        caption: "Reserve: AI systems and machine learning editorial photography.",
        unsplashId: "1497366216548-37526070297c",
        creatorName: "Lance Anderson",
        tags: ["AI", "neural networks", "pool"],
    },
    {
        id: "pool-ai-laptop-coding",
        category: "Artificial Intelligence",
        localPath: "/images/blog/ai/developer-laptop-ai-code.jpg",
        alt: "Computer screen displaying lines of code in a dark development environment",
        caption: "Reserve: AI development and software engineering topics.",
        unsplashId: "1770734360042-676ef707d022",
        creatorName: "Unsplash Contributor",
        tags: ["AI development", "coding", "pool"],
    },
    {
        id: "pool-edu-classroom-collaboration",
        category: "Education Technology",
        localPath: "/images/blog/education/classroom-student-collaboration.jpg",
        alt: "Students collaborating on a group project in a bright classroom",
        caption: "Reserve: classroom collaboration and group learning.",
        unsplashId: "1522202176988-66273c2fd55f",
        creatorName: "Brooke Cagle",
        tags: ["classroom", "collaboration", "pool"],
    },
    {
        id: "pool-edu-library-studying",
        category: "Education Technology",
        localPath: "/images/blog/education/university-library-studying.jpg",
        alt: "Student writing organized notes at a desk with a laptop",
        caption: "Reserve: study techniques and academic research.",
        unsplashId: "1484480974693-6ca0a78fb36b",
        creatorName: "Trent Erwin",
        tags: ["library", "studying", "pool"],
    },
    {
        id: "pool-re-skyline-investment",
        category: "Real Estate Technology",
        localPath: "/images/blog/real-estate/city-skyline-property-investment.jpg",
        alt: "Classic residential property with green lawn representing real estate investing",
        caption: "Reserve: market trends and commercial real estate topics.",
        unsplashId: "1570129477492-45c003edd2be",
        creatorName: "Zac Gudakov",
        tags: ["skyline", "investment", "pool"],
    },
    {
        id: "pool-re-interior-staging",
        category: "Real Estate Technology",
        localPath: "/images/blog/real-estate/staged-home-interior.jpg",
        alt: "Analytics dashboard on screen representing property performance review",
        caption: "Reserve: residential property and staging topics.",
        unsplashId: "1560472354-b33ff0c44a43",
        creatorName: "Unsplash Contributor",
        tags: ["interior", "staging", "pool"],
    },
    {
        id: "pool-health-pet-safety",
        category: "Healthcare Technology",
        localPath: "/images/blog/healthcare/pet-safety-home-environment.jpg",
        alt: "Happy dog in a safe home environment representing pet safety awareness",
        caption: "Reserve: pet safety and household hazard topics.",
        unsplashId: "1587300003388-59208cc962cb",
        creatorName: "Jamie Street",
        tags: ["pets", "safety", "pool"],
    },
    {
        id: "pool-health-veterinary-care",
        category: "Healthcare Technology",
        localPath: "/images/blog/healthcare/veterinarian-pet-examination.jpg",
        alt: "Family with pets in a safe home environment",
        caption: "Reserve: veterinary care and animal health topics.",
        unsplashId: "1587300003388-59208cc962cb",
        creatorName: "Jamie Street",
        tags: ["veterinary", "pets", "pool"],
    },
    {
        id: "pool-construction-crane-skyline",
        category: "Construction Technology",
        localPath: "/images/blog/construction/crane-active-building-site.jpg",
        alt: "Tower crane over an active high-rise construction site",
        caption: "Reserve: large-scale construction and engineering topics.",
        unsplashId: "1541888946425-d81bb19240f5",
        creatorName: "Jesse Bowser",
        tags: ["crane", "construction", "pool"],
    },
    {
        id: "pool-dc-fiber-network",
        category: "Data Centers & Databases",
        localPath: "/images/blog/datacenters/fiber-optic-network-cables.jpg",
        alt: "Professional working on a laptop in a server operations environment",
        caption: "Reserve: networking and database infrastructure topics.",
        unsplashId: "1713946598218-321ddd48ebd7",
        creatorName: "Unsplash Contributor",
        tags: ["fiber", "networking", "pool"],
    },
    {
        id: "pool-robotics-drone-inspection",
        category: "Robotics & Automation",
        localPath: "/images/blog/robotics/automated-drone-inspection.jpg",
        alt: "Industrial drone inspecting equipment in a warehouse facility",
        caption: "Reserve: drone automation and inspection robotics.",
        unsplashId: "1473968512647-3e447244af8f",
        creatorName: "Dose Media",
        tags: ["drone", "inspection", "pool"],
    },
    {
        id: "pool-future-clean-energy",
        category: "Future Technology",
        localPath: "/images/blog/future-tech/clean-energy-solar-panels.jpg",
        alt: "Analytics dashboard representing emerging clean technology metrics",
        caption: "Reserve: clean energy and sustainability technology.",
        unsplashId: "1560472354-b33ff0c44a43",
        creatorName: "Unsplash Contributor",
        tags: ["clean energy", "solar", "pool"],
    },
    {
        id: "pool-business-pitch-deck",
        category: "Business & Entrepreneurship",
        localPath: "/images/blog/business/startup-pitch-presentation.jpg",
        alt: "Entrepreneur presenting a startup pitch to a small team",
        caption: "Reserve: fundraising, pitching, and entrepreneurship topics.",
        unsplashId: "1556761175-b413da4baf72",
        creatorName: "Austin Distel",
        tags: ["pitch", "startup", "pool"],
    },
];

/** Published article ID → pool asset id */
export const articleHeroAssignments = {
    1: "edu-ai-classroom-transforming",
    2: "ai-chatgpt-infrastructure",
    3: "dc-gold-rush-facility",
    4: "ai-economy-tech-stack",
    5: "dc-power-grid-demand",
    6: "edu-ai-tutor-dashboard",
    7: "re-deal-analysis-investor",
    8: "construction-engineering-jobsite",
    9: "robotics-warehouse-automation",
    10: "future-tech-decade-trends",
    11: "edu-teacher-ai-partnership",
    12: "edu-spaced-repetition-flashcards",
    13: "edu-student-smarter-ai-tools",
    14: "edu-online-adaptive-platform",
    15: "edu-studynest-workspace",
    16: "healthcare-home-safety-storage",
    17: "edu-parent-child-learning",
    18: "ai-small-business-team",
    19: "re-modern-home-search",
    20: "edu-student-dashboard-desk",
    21: "healthcare-emergency-preparedness",
    22: "construction-contractor-tablet",
    23: "dc-server-cooling-aisle",
    24: "robotics-collaborative-assembly",
    25: "future-emerging-tech-lab",
    26: "business-founders-whiteboard",
    27: "cinnova-team-roadmap",
    28: "dc-database-server-operations",
    29: "construction-blueprint-estimating",
    30: "robotics-industrial-arm-factory",
    31: "ai-complete-guide-2026",
    32: "edu-ai-education-guide-2026",
};

/**
 * Cornerstone inline editorial placements — sectionIndex (0-based) + pool asset id.
 * Images must differ from each article's hero path.
 */
export const cornerstoneInlinePlacements = {
    1: [
        { sectionIndex: 2, assetId: "edu-ai-tutor-dashboard" },
        { sectionIndex: 5, assetId: "edu-spaced-repetition-flashcards" },
    ],
    2: [
        { sectionIndex: 3, assetId: "dc-gold-rush-facility" },
        { sectionIndex: 6, assetId: "dc-power-grid-demand" },
    ],
    3: [
        { sectionIndex: 2, assetId: "ai-chatgpt-infrastructure" },
        { sectionIndex: 5, assetId: "dc-server-cooling-aisle" },
    ],
    4: [
        { sectionIndex: 3, assetId: "ai-complete-guide-2026" },
        { sectionIndex: 6, assetId: "pool-ai-neural-network-art" },
    ],
    5: [
        { sectionIndex: 3, assetId: "dc-gold-rush-facility" },
        { sectionIndex: 6, assetId: "ai-chatgpt-infrastructure" },
    ],
    6: [
        { sectionIndex: 3, assetId: "edu-spaced-repetition-flashcards" },
        { sectionIndex: 6, assetId: "edu-student-smarter-ai-tools" },
    ],
    7: [
        { sectionIndex: 3, assetId: "pool-re-skyline-investment" },
        { sectionIndex: 6, assetId: "re-modern-home-search" },
    ],
    8: [
        { sectionIndex: 3, assetId: "pool-construction-crane-skyline" },
        { sectionIndex: 6, assetId: "construction-blueprint-estimating" },
    ],
    9: [
        { sectionIndex: 3, assetId: "pool-robotics-drone-inspection" },
        { sectionIndex: 6, assetId: "robotics-industrial-arm-factory" },
    ],
    10: [
        { sectionIndex: 3, assetId: "future-emerging-tech-lab" },
        { sectionIndex: 6, assetId: "pool-future-clean-energy" },
    ],
    11: [
        { sectionIndex: 3, assetId: "pool-edu-classroom-collaboration" },
        { sectionIndex: 6, assetId: "edu-online-adaptive-platform" },
    ],
    12: [
        { sectionIndex: 3, assetId: "edu-student-smarter-ai-tools" },
        { sectionIndex: 6, assetId: "edu-studynest-workspace" },
    ],
    13: [
        { sectionIndex: 3, assetId: "edu-spaced-repetition-flashcards" },
        { sectionIndex: 6, assetId: "edu-ai-tutor-dashboard" },
    ],
    14: [
        { sectionIndex: 3, assetId: "edu-parent-child-learning" },
        { sectionIndex: 6, assetId: "edu-student-dashboard-desk" },
    ],
    15: [
        { sectionIndex: 3, assetId: "edu-spaced-repetition-flashcards" },
        { sectionIndex: 6, assetId: "edu-ai-tutor-dashboard" },
    ],
    31: [
        { sectionIndex: 3, assetId: "ai-chatgpt-infrastructure" },
        { sectionIndex: 7, assetId: "ai-economy-tech-stack" },
        { sectionIndex: 11, assetId: "dc-gold-rush-facility" },
    ],
    32: [
        { sectionIndex: 3, assetId: "edu-ai-classroom-transforming" },
        { sectionIndex: 7, assetId: "edu-spaced-repetition-flashcards" },
        { sectionIndex: 11, assetId: "edu-studynest-workspace" },
    ],
};

export function applyCornerstoneInlineImages(content, postId, heroPath = "") {
    const placements = cornerstoneInlinePlacements[postId];
    if (!placements?.length || !Array.isArray(content)) {
        return content;
    }

    return content.map((section, index) => {
        const placement = placements.find((item) => item.sectionIndex === index);
        if (!placement) return section;

        const asset = poolById[placement.assetId];
        if (!asset?.localPath || asset.localPath === heroPath) return section;

        return {
            ...section,
            image: asset.localPath,
            imageAlt: placement.alt || asset.alt,
            imageCaption: placement.caption || asset.caption || "",
        };
    });
}

export function auditCornerstoneInlineImages(publishedPosts) {
    const cornerstoneIds = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 31, 32]);
    const cornerstones = publishedPosts.filter((post) => cornerstoneIds.has(post.id));
    const withoutInline = cornerstones.filter(
        (post) => !post.content?.some((section) => section.image),
    );
    const inlineCount = cornerstones.reduce(
        (total, post) => total + (post.content?.filter((section) => section.image).length || 0),
        0,
    );

    return {
        cornerstoneTotal: cornerstones.length,
        withInlineImages: cornerstones.length - withoutInline.length,
        withoutInlinePostIds: withoutInline.map((post) => post.id),
        totalInlineImages: inlineCount,
    };
}

const poolById = Object.fromEntries(blogImagePool.map((asset) => [asset.id, asset]));

export function getBlogImageAsset(assetId) {
    return poolById[assetId] || null;
}

export function resolveArticleHero(postId) {
    const assetId = articleHeroAssignments[postId];
    const asset = assetId ? poolById[assetId] : null;
    if (!asset) return null;
    return {
        heroImage: asset.localPath,
        heroImageAlt: asset.alt,
        heroImageCaption: asset.caption || "",
    };
}

export function getPoolImagesForCategory(category) {
    const assignedIds = new Set(Object.values(articleHeroAssignments));
    return blogImagePool.filter(
        (asset) =>
            asset.category === category &&
            !assignedIds.has(asset.id) &&
            asset.id.startsWith("pool-"),
    );
}

export function getUnassignedPoolImages() {
    const assignedIds = new Set(Object.values(articleHeroAssignments));
    return blogImagePool.filter((asset) => asset.id.startsWith("pool-"));
}

export function auditBlogHeroAssignments(publishedPosts) {
    const byPath = {};
    const missing = [];
    const cornerstoneIds = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 31, 32]);

    for (const post of publishedPosts) {
        const hero = resolveArticleHero(post.id);
        if (!hero?.heroImage) {
            missing.push(post.id);
            continue;
        }
        if (!byPath[hero.heroImage]) byPath[hero.heroImage] = [];
        byPath[hero.heroImage].push(post.id);
    }

    const duplicates = Object.entries(byPath).filter(([, ids]) => ids.length > 1);
    const cornerstoneDuplicates = duplicates.filter(([, ids]) =>
        ids.some((id) => cornerstoneIds.has(id)),
    );

    return {
        totalPublished: publishedPosts.length,
        withHero: publishedPosts.length - missing.length,
        uniqueHeroImages: Object.keys(byPath).length,
        missingPostIds: missing,
        duplicates,
        cornerstoneDuplicates,
    };
}
