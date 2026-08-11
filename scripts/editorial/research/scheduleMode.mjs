/**
 * Phase 10B.2 — resolve research mode for GitHub Actions / local helpers.
 *
 * Schedule (cron): live research feeds
 * Manual workflow_dispatch default: fixture
 * Manual live: only when explicitly selected
 * Local npm defaults: unchanged (fixture unless --live)
 */

export function resolveResearchMode({
    eventName = "workflow_dispatch",
    researchModeInput = "",
    useLiveResearchInput = "",
} = {}) {
    const normalized = String(researchModeInput || "").trim().toLowerCase();
    const legacyLive = String(useLiveResearchInput || "").trim().toLowerCase() === "true";

    if (eventName === "schedule") {
        return {
            mode: "live",
            rationale: "Scheduled editorial-daily runs use live verified feeds.",
        };
    }

    if (normalized === "live" || legacyLive) {
        return {
            mode: "live",
            rationale: "Manual run explicitly selected live research.",
        };
    }

    return {
        mode: "fixture",
        rationale: "Manual/default runs stay fixture-safe unless live is explicitly selected.",
    };
}

/**
 * Automation execution mode — shadow/dry-run vs draft-PR preparation.
 *
 * Production auto-publishing is NEVER enabled by this helper.
 * Scheduled cron stays in shadow mode until an explicit future activation phase.
 *
 * @returns {{
 *   shadow: boolean,
 *   dryRun: boolean,
 *   openDraftPr: boolean,
 *   autoPublish: false,
 *   writeDraftFiles: boolean,
 *   rationale: string,
 * }}
 */
export function resolveAutomationExecutionMode({
    eventName = "workflow_dispatch",
    dryRunInput = "",
    allowDraftPrInput = "",
    shadowInput = "",
} = {}) {
    const dryRunRequested = String(dryRunInput || "").trim().toLowerCase() === "true";
    const allowDraftPr =
        String(allowDraftPrInput || "").trim().toLowerCase() === "true";
    const shadowRequested = String(shadowInput || "").trim().toLowerCase() === "true";

    // Hard invariant — never auto-publish catalogs / social / deploy from automation.
    const autoPublish = false;

    // Scheduled production cron: shadow only until an explicit activation phase.
    if (eventName === "schedule") {
        return {
            shadow: true,
            dryRun: true,
            openDraftPr: false,
            writeDraftFiles: false,
            autoPublish,
            rationale:
                "Scheduled runs stay in shadow/dry-run mode — no draft files, no Draft PR, no auto-publish until activation.",
        };
    }

    // Explicit shadow or dry-run wins.
    if (shadowRequested || dryRunRequested || !allowDraftPr) {
        return {
            shadow: true,
            dryRun: true,
            openDraftPr: false,
            writeDraftFiles: false,
            autoPublish,
            rationale: allowDraftPr
                ? "Dry-run/shadow requested — pipeline simulates output without writing drafts or opening a PR."
                : "Draft PR preparation is not activated — defaulting to shadow/dry-run mode.",
        };
    }

    // Manual activation of Draft PR preparation only (still never publishes).
    return {
        shadow: false,
        dryRun: false,
        openDraftPr: true,
        writeDraftFiles: true,
        autoPublish,
        rationale:
            "Manual run explicitly allowed Draft PR preparation. Auto-publish remains disabled.",
    };
}

export function dailyRunId(dateIso = "") {
    const date = String(dateIso || new Date().toISOString().slice(0, 10));
    return `editorial-daily-${date}`;
}

export function dailyBranchName(dateIso = "") {
    return `editorial/daily-${String(dateIso || new Date().toISOString().slice(0, 10))}`;
}

/** Pacific wall-clock note for the fixed 13:00 UTC cron. */
export function describeScheduleWindow(cronUtc = "0 13 * * *") {
    return {
        cronUtc,
        utc: "13:00 UTC daily",
        pacificStandard: "05:00 PST (UTC-8)",
        pacificDaylight: "06:00 PDT (UTC-7)",
        note: "GitHub cron is UTC-fixed; Pacific local time shifts one hour across DST.",
    };
}
