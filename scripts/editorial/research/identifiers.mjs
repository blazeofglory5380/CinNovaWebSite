/**
 * Phase 10B.3 — stable event identifiers for exact corroboration / dedupe.
 * Prefer exact IDs over loose semantic similarity.
 */

const PATTERNS = [
    { kind: "CVE", re: /\bCVE-\d{4}-\d{4,7}\b/gi },
    { kind: "CISA_BOD", re: /\bBOD[\s-]?\d{2}-\d{2}\b/gi },
    { kind: "CISA_ICS", re: /\bICSA-\d{2}-\d{3}-\d{2}\b/gi },
    { kind: "CISA_AA", re: /\bAA\d{2}-\d{3}[A-Z]?\b/gi },
    { kind: "KEV", re: /\b(?:KEV|Known Exploited Vulnerabilit(?:y|ies))\b/gi },
    { kind: "SEC_RELEASE", re: /\b(?:Release\s+No\.?\s*|Press\s+Release\s+)(\d{4}-\d+)\b/gi },
    { kind: "NIST_PUB", re: /\bNIST\s+(?:SP|IR|TN)\s+[\d-]+(?:\s+[A-Za-z0-9.-]+)?\b/gi },
    { kind: "SBOM", re: /\bSBOM(?:\s+Minimum\s+Elements)?\b/gi },
];

function normalizeId(kind, raw) {
    const value = String(raw || "").trim().replace(/\s+/g, " ");
    if (!value) return null;
    if (kind === "CVE") return value.toUpperCase();
    if (kind === "CISA_BOD") return value.toUpperCase().replace(/\s+/g, "-").replace(/BOD-?/, "BOD-");
    if (kind === "CISA_ICS" || kind === "CISA_AA") return value.toUpperCase();
    if (kind === "SEC_RELEASE") {
        const match = value.match(/(\d{4}-\d+)/);
        return match ? `SEC-${match[1]}` : value.toUpperCase();
    }
    if (kind === "NIST_PUB") return value.toUpperCase().replace(/\s+/g, " ");
    if (kind === "SBOM") return "SBOM";
    if (kind === "KEV") return "KEV";
    return value;
}

/** Extract structured identifiers from free text. */
export function extractIdentifiers(text = "") {
    const found = [];
    const seen = new Set();
    for (const { kind, re } of PATTERNS) {
        re.lastIndex = 0;
        let match;
        while ((match = re.exec(String(text))) !== null) {
            const raw = match[1] ? `${match[0]}` : match[0];
            const id = normalizeId(kind, kind === "SEC_RELEASE" && match[1] ? match[1] : raw);
            if (!id) continue;
            const key = `${kind}:${id}`;
            if (seen.has(key)) continue;
            seen.add(key);
            found.push({ kind, id, raw: match[0] });
        }
    }
    return found;
}

export function extractIdentifiersFromCandidate(candidate = {}) {
    return extractIdentifiers(
        `${candidate.headline || ""} ${candidate.summary || ""} ${candidate.guid || ""} ${candidate.articleUrl || ""}`,
    );
}

export function extractIdentifiersFromCluster(cluster = {}) {
    const blob = [
        cluster.canonicalTopic,
        ...(cluster.headlineCandidates || []),
        ...(cluster.sources || []).map((source) => `${source.headline || ""} ${source.summary || ""} ${source.articleUrl || ""}`),
    ].join(" ");
    return extractIdentifiers(blob);
}

/** True when two identifier sets share an exact event identity (excluding weak SBOM/KEV-only alone unless both have it as only signal with strong text). */
export function shareExactIdentifier(aIds = [], bIds = []) {
    const left = new Set(aIds.map((item) => `${item.kind}:${item.id}`));
    return bIds.some((item) => left.has(`${item.kind}:${item.id}`));
}

export function shareStrongIdentifier(aIds = [], bIds = []) {
    const strong = new Set(["CVE", "CISA_BOD", "CISA_ICS", "CISA_AA", "SEC_RELEASE", "NIST_PUB"]);
    const left = new Set(
        aIds.filter((item) => strong.has(item.kind)).map((item) => `${item.kind}:${item.id}`),
    );
    return bIds.some((item) => strong.has(item.kind) && left.has(`${item.kind}:${item.id}`));
}
