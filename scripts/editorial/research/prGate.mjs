/**
 * Phase 10B.2 — Draft PR eligibility helpers.
 * Research selection / HOLD / REVIEW counts alone must not open a PR.
 * Shadow/dry-run mode never opens a Draft PR.
 */

export function countDraftFiles(paths = []) {
    return (paths || []).filter((file) => /\.(js|mjs|jsx|ts|tsx)$/i.test(String(file || ""))).length;
}

/**
 * Open a Draft PR only when validated editorial draft files exist
 * AND automation is not in shadow/dry-run mode.
 * Report-only / HOLD-only / zero-draft / shadow runs must not open junk PRs.
 */
export function shouldOpenEditorialDraftPr({
    newsDraftPaths = [],
    blogDraftPaths = [],
    newsDraftCount = null,
    blogDraftCount = null,
    shadow = false,
    dryRun = false,
    autoPublish = false,
} = {}) {
    // Hard stop — production auto-publish is never a PR gate input.
    if (autoPublish) return false;
    if (shadow || dryRun) return false;

    const news = newsDraftCount == null ? countDraftFiles(newsDraftPaths) : Number(newsDraftCount) || 0;
    const blog = blogDraftCount == null ? countDraftFiles(blogDraftPaths) : Number(blogDraftCount) || 0;
    return news + blog > 0;
}

/**
 * Duplicate daily-run decision for deterministic run ids / branches.
 * Open PR → skip. Closed/merged → may proceed (no auto-delete of prior branches).
 * Branch without PR → proceed.
 */
export function duplicateDailyRunDecision({
    openPr = null,
    closedOrMergedPr = null,
    branchExists = false,
} = {}) {
    if (openPr?.number) {
        return {
            action: "skip",
            rationale: `Open Draft PR #${openPr.number} already exists for this daily run.`,
            existingPr: openPr,
        };
    }
    if (closedOrMergedPr?.number) {
        return {
            action: "proceed",
            rationale: `Prior PR #${closedOrMergedPr.number} is ${closedOrMergedPr.state || "closed"}; a new preparation may proceed without deleting the old branch.`,
            existingPr: closedOrMergedPr,
            branchExists,
        };
    }
    return {
        action: "proceed",
        rationale: branchExists
            ? "Branch exists without an open PR (likely a failed earlier run); continue preparation."
            : "No existing daily PR; eligible to proceed.",
        existingPr: null,
        branchExists,
    };
}
