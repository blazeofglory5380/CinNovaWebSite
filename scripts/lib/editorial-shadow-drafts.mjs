/**
 * Shadow-only draft synthesis + originality / translation helpers.
 * Never writes catalogs. Never invents quotes, statistics, or events.
 */

const LONG_QUOTE_RE = /[“"][^”"]{80,}[”"]/;
const WORD_RE = /[a-z0-9']+/gi;

export const SUPPORTED_SHADOW_LOCALES = Object.freeze(["en", "es", "fr", "de"]);

export function stripHtml(value = "") {
    return String(value || "")
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, " ")
        .trim();
}

function words(text = "") {
    return stripHtml(text).toLowerCase().match(WORD_RE) || [];
}

function ngramSet(text = "", n = 5) {
    const toks = words(text);
    const set = new Set();
    for (let i = 0; i <= toks.length - n; i += 1) {
        set.add(toks.slice(i, i + n).join(" "));
    }
    return set;
}

function overlapRatio(a = "", b = "") {
    const A = ngramSet(a, 5);
    const B = ngramSet(b, 5);
    if (!A.size || !B.size) return 0;
    let hit = 0;
    for (const gram of A) if (B.has(gram)) hit += 1;
    return hit / Math.min(A.size, B.size);
}

function readingTimeMinutes(text = "") {
    const count = words(text).length;
    return Math.max(1, Math.round(count / 220));
}

/**
 * Build an original CinNova synthesis body from packet fields.
 * Uses claims + summary; does not invent quotes or numbers.
 */
export function synthesizeShadowNewsBody(story = {}) {
    const publishers = [...new Set((story.sources || []).map((s) => s.publisher).filter(Boolean))];
    const verified = Array.isArray(story.verifiedClaims) ? story.verifiedClaims.filter(Boolean) : [];
    const attributed = Array.isArray(story.attributedClaims) ? story.attributedClaims.filter(Boolean) : [];
    const uncertainties = Array.isArray(story.uncertainties) ? story.uncertainties.filter(Boolean) : [];
    const dek = stripHtml(story.dek || story.summary || "").slice(0, 220);

    const whatHappened = [];
    whatHappened.push(
        `CinNova News is tracking this ${String(story.category || "technology").toLowerCase()} development for readers, based on reporting from ${
            publishers.length ? publishers.join(", ") : "the listed sources"
        }.`,
    );
    if (verified.length) {
        whatHappened.push(
            `Verified from primary reporting: ${verified.slice(0, 3).map((c) => paraphraseClaim(c, publishers)).join(" ")}`,
        );
    } else if (dek) {
        whatHappened.push(
            `${publishers[0] || "Listed sources"} report that ${dek.charAt(0).toLowerCase()}${dek.slice(1)}${dek.endsWith(".") ? "" : "."}`,
        );
        whatHappened.push(
            "Shadow synthesis attributes the core facts to those publishers and does not add unsourced quotes, statistics, or causal claims.",
        );
    } else if (attributed.length) {
        whatHappened.push(
            `Attributed reporting (not independently re-verified here): ${attributed
                .slice(0, 2)
                .map((c) => paraphraseClaim(c, publishers))
                .join(" ")}`,
        );
    }

    const why = [];
    why.push(
        stripHtml(story.whyItMatters || "")
            || `This intersects CinNova coverage of ${(story.category || "technology").toLowerCase()} and related infrastructure.`,
    );
    if (uncertainties.length) {
        why.push(`Open questions remain: ${uncertainties.slice(0, 3).join("; ")}.`);
    } else {
        why.push("Independent secondary corroboration should be confirmed before READY / controlled draft writing.");
    }

    const sourceNotes = (story.sources || [])
        .filter((s) => s?.url)
        .map((s) => `${s.publisher || s.label || "Source"}: ${s.url}${s.note ? ` (${s.note})` : ""}`);

    return {
        sections: [
            {
                id: "what-happened",
                heading: "What happened",
                claimType: verified.length ? "verified" : "attributed",
                body: whatHappened,
            },
            {
                id: "why-it-matters-detail",
                heading: "Why it matters",
                claimType: "analysis",
                body: why,
            },
            {
                id: "sources-notes",
                heading: "Source notes",
                claimType: "attribution",
                body: sourceNotes.length
                    ? sourceNotes
                    : ["No source URLs were available for this candidate."],
            },
        ],
        summary: dek || stripHtml(story.summary || story.title || ""),
        dek: dek || stripHtml(story.dek || ""),
    };
}

export function synthesizeShadowBlogBody(story = {}) {
    const keyword = story.researchBrief?.primaryKeyword || story.category || "technology";
    const intent = story.researchBrief?.searchIntent || "Informational";
    const publishers = [...new Set((story.sources || []).map((s) => s.publisher).filter(Boolean))];
    const sections = [
        {
            heading: "What this guide covers",
            body: [
                `This CinNova explainer focuses on ${keyword} for readers with ${intent.toLowerCase()} intent.`,
                story.excerpt
                    ? `Context drawn from listed sources (${publishers.join(", ") || "packet sources"}): ${paraphraseClaim(story.excerpt, publishers)}`
                    : "Context is limited to the verified research packet; no additional events are invented.",
            ],
        },
        {
            heading: "Practical takeaways",
            body: [
                "Treat official and primary sources as authoritative for facts.",
                "Do not copy competitor tutorials; synthesize actionable steps for CinNova product and policy readers.",
                "Cross-link related News only when the editorial purpose differs (event coverage vs evergreen guide).",
            ],
        },
        {
            heading: "Source requirements",
            body: [
                "Keep English as the authoritative draft.",
                "Attribute statistics and named entities to their publishers.",
                "Do not invent quotes, benchmarks, or causal claims beyond the packet.",
            ],
        },
    ];
    return { sections, excerpt: story.excerpt || story.title || "" };
}

function paraphraseClaim(claim = "", publishers = []) {
    let text = stripHtml(claim);
    // Strip wrapping quotes to avoid reproducing long quotations.
    text = text.replace(/^[“"']+|[”"']+$/g, "");
    if (text.length > 280) text = `${text.slice(0, 277)}…`;
    const attrib = publishers[0] ? `${publishers[0]} reporting indicates that ` : "Reporting indicates that ";
    // Avoid starting with the same opener twice.
    if (/^(according to|reporting indicates|officials? (say|said)|the (agency|company))/i.test(text)) {
        return text.endsWith(".") ? text : `${text}.`;
    }
    if (!text) return "Reporting did not provide a concise attributed claim for synthesis.";
    const lowered = text.charAt(0).toLowerCase() + text.slice(1);
    return `${attrib}${lowered}${text.endsWith(".") ? "" : "."}`;
}

/**
 * Heuristic originality / copyright safety for shadow drafts.
 */
export function assessOriginality(draft = {}, sourceTexts = []) {
    const bodyText = [
        draft.title,
        draft.dek,
        draft.summary,
        draft.excerpt,
        ...(draft.sections || []).flatMap((s) => s.body || []),
    ]
        .filter(Boolean)
        .join("\n");

    const issues = [];
    if (LONG_QUOTE_RE.test(bodyText)) {
        issues.push("Contains a long quotation (>80 chars); rewrite as attribution without extended quotes.");
    }
    if (/\b(I|we) (was|were) told\b/i.test(bodyText) && !/according to|reporting|source/i.test(bodyText)) {
        issues.push("Possible invented eyewitness voice without attribution.");
    }

    let maxOverlap = 0;
    for (const source of sourceTexts) {
        maxOverlap = Math.max(maxOverlap, overlapRatio(bodyText, source));
    }
    if (maxOverlap >= 0.35) {
        issues.push(`High n-gram overlap with a source summary (${(maxOverlap * 100).toFixed(1)}%); rewrite more independently.`);
    }

    const inventedQuote = /"[^"]{20,}"/.test(bodyText)
        && !(draft.sources || []).some((s) => s?.note?.toLowerCase().includes("quote"));
    if (inventedQuote && !/according to|said|stated|announced/i.test(bodyText)) {
        issues.push("Quoted material present without clear source attribution pattern.");
    }

    return {
        status: issues.length ? "NEEDS_REWRITE" : "PASS",
        maxSourceOverlap: Number(maxOverlap.toFixed(3)),
        issues,
        notes: [
            "Shadow originality check is heuristic (n-gram + quote length).",
            "It does not replace human copyright review before publication.",
            "English source remains authoritative for any future translations.",
        ],
    };
}

export function buildTranslationQueue(slug, { locales = SUPPORTED_SHADOW_LOCALES } = {}) {
    return locales.map((locale) => ({
        locale,
        slug,
        status: locale === "en" ? "AI_DRAFT" : "MISSING",
        englishAuthoritative: true,
        mayAddFacts: false,
        preserveNamesQuotesLegal: true,
        humanReviewed: false,
        note:
            locale === "en"
                ? "English shadow draft — not human-reviewed for publication."
                : "Translation not generated in shadow validation; missing locale does not block English.",
    }));
}

export function estimateReadingTimeFromDraft(draft = {}) {
    const text = [
        draft.title,
        draft.dek,
        draft.summary,
        draft.excerpt,
        ...(draft.sections || []).flatMap((s) => s.body || []),
    ]
        .filter(Boolean)
        .join(" ");
    return readingTimeMinutes(text);
}

/**
 * Assemble a report-only shadow news draft (never written to disk catalogs).
 */
export function buildShadowNewsDraft(story = {}, extras = {}) {
    const cleaned = {
        ...story,
        title: stripHtml(story.title || ""),
        dek: stripHtml(story.dek || "").slice(0, 280),
        summary: stripHtml(story.summary || "").slice(0, 500),
        whyItMatters: stripHtml(story.whyItMatters || ""),
        verifiedClaims: (story.verifiedClaims || []).map((c) => stripHtml(c)).filter(Boolean),
        attributedClaims: (story.attributedClaims || []).map((c) => stripHtml(c).slice(0, 400)).filter(Boolean),
        uncertainties: (story.uncertainties || []).map((c) => stripHtml(c)).filter(Boolean),
    };
    const body = synthesizeShadowNewsBody(cleaned);
    const sourceTexts = (cleaned.sources || [])
        .flatMap((s) => [s.note, s.publisher])
        .filter(Boolean);

    const draft = {
        slug: cleaned.slug,
        title: cleaned.title,
        dek: body.dek,
        summary: body.summary,
        category: cleaned.category || "Technology",
        coverageLevel: extras.coverageLevel || "national",
        topic: cleaned.category || extras.topic || "technology",
        author: cleaned.author || "Cin Nova News Desk",
        publishDateCandidate: cleaned.publishedAt || extras.dateIso || null,
        sources: cleaned.sources || [],
        citations: (cleaned.sources || []).map((s) => ({
            publisher: s.publisher,
            url: s.url,
            note: s.note || "",
        })),
        tags: [cleaned.category, extras.coverageLevel, ...(extras.tags || [])].filter(Boolean),
        seoTitle: cleaned.seoTitle || (cleaned.title || "").slice(0, 60),
        seoDescription: cleaned.seoDescription || (body.dek || "").slice(0, 155),
        relatedStorySuggestions: extras.relatedStorySuggestions || [],
        sections: body.sections,
        verifiedClaims: cleaned.verifiedClaims || [],
        attributedClaims: cleaned.attributedClaims || [],
        uncertainties: cleaned.uncertainties || [],
        factCheckStatus: extras.factCheckStatus || cleaned.factCheckStatus || "",
        duplicateClassification: extras.duplicateClassification || "",
        readingTimeMinutes: 0,
        shadowOnly: true,
        isDraft: true,
        isPublished: false,
    };
    draft.readingTimeMinutes = estimateReadingTimeFromDraft(draft);
    draft.originality = assessOriginality(draft, sourceTexts);
    draft.translationQueue = buildTranslationQueue(draft.slug);
    return draft;
}

export function buildShadowBlogDraft(story = {}, extras = {}) {
    const body = synthesizeShadowBlogBody(story);
    const sourceTexts = [
        story.excerpt,
        ...(story.sources || []).map((s) => `${s.label || ""} ${s.note || ""}`),
    ].filter(Boolean);

    const draft = {
        slug: story.slug,
        title: story.title,
        topic: story.researchBrief?.primaryKeyword || story.category || "technology",
        classification: extras.classification || "evergreen",
        searchIntent: story.researchBrief?.searchIntent || "Informational",
        valueProposition:
            extras.valueProposition
            || `Practical ${story.researchBrief?.primaryKeyword || "technology"} guidance for CinNova readers.`,
        category: story.category || "Artificial Intelligence",
        author: story.author || "CinNova Editorial Team",
        excerpt: body.excerpt,
        sections: body.sections,
        sources: story.sources || [],
        sourceRequirements: [
            "At least one reputable primary or secondary source for factual anchors",
            "No invented tutorials steps that imply vendor endorsement",
            "English authoritative; translations may not add facts",
        ],
        seoTitle: story.seoTitle || (story.title || "").slice(0, 60),
        seoDescription: story.seoDescription || (body.excerpt || "").slice(0, 155),
        researchBrief: story.researchBrief || null,
        factCheckStatus: extras.factCheckStatus || "",
        duplicateContentCheck: extras.duplicateContentCheck || "NEW",
        eligibility: extras.eligibility || "PASS",
        readingTimeMinutes: 0,
        shadowOnly: true,
        status: "draft",
    };
    draft.readingTimeMinutes = estimateReadingTimeFromDraft(draft);
    draft.originality = assessOriginality(draft, sourceTexts);
    draft.translationQueue = buildTranslationQueue(draft.slug);
    return draft;
}
