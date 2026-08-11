/**
 * Phase 4 — editorial execution modes (fail closed).
 *
 * SHADOW     — reports only; no catalog files; no PR
 * DRAFT      — writes draft content only; never publicly visible; Draft PR only when authorized
 * PUBLISH    — disabled in this phase
 * AUTO_PUBLISH — disabled permanently from automation helpers
 *
 * Production scheduler remains SHADOW.
 */

export const EDITORIAL_MODES = Object.freeze({
    SHADOW: "SHADOW",
    DRAFT: "DRAFT",
    PUBLISH: "PUBLISH",
    AUTO_PUBLISH: "AUTO_PUBLISH",
});

/**
 * Resolve the operational mode. Fail closed to SHADOW.
 * PUBLISH / AUTO_PUBLISH cannot be selected by schedule or casual flags.
 */
export function resolveEditorialMode({
    eventName = "workflow_dispatch",
    modeInput = "",
    shadowInput = "",
    dryRunInput = "",
    allowDraftPrInput = "",
    allowPublishInput = "",
    allowAutoPublishInput = "",
} = {}) {
    const requested = String(modeInput || "").trim().toUpperCase();
    const shadowRequested = String(shadowInput || "").trim().toLowerCase() === "true";
    const dryRunRequested = String(dryRunInput || "").trim().toLowerCase() === "true";
    const allowDraftPr = String(allowDraftPrInput || "").trim().toLowerCase() === "true";
    const allowPublish = String(allowPublishInput || "").trim().toLowerCase() === "true";
    const allowAutoPublish = String(allowAutoPublishInput || "").trim().toLowerCase() === "true";

    // Hard invariants — never auto-publish from automation.
    if (allowAutoPublish || requested === EDITORIAL_MODES.AUTO_PUBLISH) {
        return {
            mode: EDITORIAL_MODES.SHADOW,
            shadow: true,
            dryRun: true,
            writeDraftFiles: false,
            openDraftPr: false,
            publish: false,
            autoPublish: false,
            failClosed: true,
            rationale:
                "AUTO_PUBLISH is disabled. Request ignored — fail closed to SHADOW.",
        };
    }

    if (allowPublish || requested === EDITORIAL_MODES.PUBLISH) {
        return {
            mode: EDITORIAL_MODES.SHADOW,
            shadow: true,
            dryRun: true,
            writeDraftFiles: false,
            openDraftPr: false,
            publish: false,
            autoPublish: false,
            failClosed: true,
            rationale:
                "PUBLISH mode is not activated in Phase 4. Request ignored — fail closed to SHADOW.",
        };
    }

    // Scheduled cron: always SHADOW until a future explicit activation phase.
    if (eventName === "schedule") {
        return {
            mode: EDITORIAL_MODES.SHADOW,
            shadow: true,
            dryRun: true,
            writeDraftFiles: false,
            openDraftPr: false,
            publish: false,
            autoPublish: false,
            failClosed: true,
            rationale: "Production scheduler remains SHADOW — no draft files, no PR, no publish.",
        };
    }

    // Explicit SHADOW / dry-run always wins.
    if (
        requested === EDITORIAL_MODES.SHADOW
        || shadowRequested
        || dryRunRequested
        || (!allowDraftPr && requested !== EDITORIAL_MODES.DRAFT)
    ) {
        return {
            mode: EDITORIAL_MODES.SHADOW,
            shadow: true,
            dryRun: true,
            writeDraftFiles: false,
            openDraftPr: false,
            publish: false,
            autoPublish: false,
            failClosed: true,
            rationale: "SHADOW/dry-run — reports only; catalogs and Draft PRs untouched.",
        };
    }

    // Controlled DRAFT — only when explicitly authorized (manual), never via schedule.
    if (requested === EDITORIAL_MODES.DRAFT || allowDraftPr) {
        return {
            mode: EDITORIAL_MODES.DRAFT,
            shadow: false,
            dryRun: false,
            writeDraftFiles: true,
            openDraftPr: allowDraftPr,
            publish: false,
            autoPublish: false,
            failClosed: false,
            rationale:
                "Controlled DRAFT mode — may write draft files / prepare Draft PR when authorized. Never publishes. Sitemap/RSS/search must exclude drafts.",
        };
    }

    return {
        mode: EDITORIAL_MODES.SHADOW,
        shadow: true,
        dryRun: true,
        writeDraftFiles: false,
        openDraftPr: false,
        publish: false,
        autoPublish: false,
        failClosed: true,
        rationale: "Unrecognized mode — fail closed to SHADOW.",
    };
}

/** Can this disposition become a draft file under DRAFT mode? */
export function mayWriteDraftFile(disposition = "", { policy = "ready-and-review" } = {}) {
    const status = String(disposition || "").toUpperCase();
    if (["HOLD", "REJECT", "REJECTED", "NO QUALIFIED STORY"].includes(status)) return false;
    if (policy === "ready-only") return status === "READY";
    if (policy === "ready-and-review") return status === "READY" || status === "REVIEW";
    return false;
}

export function draftVisibilityContract(draft = {}) {
    return {
        isDraft: draft.isDraft !== false,
        isPublished: false,
        status: draft.status || "draft",
        publiclyVisible: false,
        includeInSitemap: false,
        includeInRss: false,
        includeInSearch: false,
        includeInPrerender: false,
        includeInStructuredData: false,
        notes: [
            "Drafts must never enter published catalogs.",
            "Sitemap / RSS / search / prerender / structured data exclude drafts.",
        ],
    };
}
