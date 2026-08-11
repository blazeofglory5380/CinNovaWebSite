/**
 * Phase 10B.2 / Phase 4 — resolve research + automation execution modes.
 *
 * Schedule (cron): live research feeds + SHADOW execution (fail closed)
 * Manual workflow_dispatch default: fixture + SHADOW
 * PUBLISH / AUTO_PUBLISH cannot be enabled here
 */

import { resolveEditorialMode, EDITORIAL_MODES } from "./editorialModes.mjs";

export { EDITORIAL_MODES, resolveEditorialMode };

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
 * Automation execution mode — shadow/dry-run vs controlled draft preparation.
 * Production auto-publishing is NEVER enabled by this helper.
 * Scheduled cron stays in SHADOW until an explicit future activation phase.
 */
export function resolveAutomationExecutionMode({
    eventName = "workflow_dispatch",
    dryRunInput = "",
    allowDraftPrInput = "",
    shadowInput = "",
    modeInput = "",
    allowPublishInput = "",
    allowAutoPublishInput = "",
} = {}) {
    const resolved = resolveEditorialMode({
        eventName,
        modeInput,
        shadowInput,
        dryRunInput,
        allowDraftPrInput,
        allowPublishInput,
        allowAutoPublishInput,
    });

    return {
        mode: resolved.mode,
        shadow: resolved.shadow,
        dryRun: resolved.dryRun,
        openDraftPr: resolved.openDraftPr,
        writeDraftFiles: resolved.writeDraftFiles,
        autoPublish: false,
        publish: false,
        failClosed: resolved.failClosed,
        rationale: resolved.rationale,
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
