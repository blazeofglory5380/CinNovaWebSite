import { getLibraryResources, auditResourcesPageCovers } from "../src/data/resources.js";

const library = getLibraryResources();
const audit = auditResourcesPageCovers(library);

console.log("=== Resource Hero Image Audit ===\n");
console.log(`Library resources: ${library.length}`);
console.log(`Registry assignments: ${audit.registry.assigned}/${audit.registry.total}`);
console.log(`Unique registry images: ${audit.registry.uniqueHeroImages}`);

if (audit.registry.missingIds.length) {
    console.log(`Missing registry IDs: ${audit.registry.missingIds.join(", ")}`);
}

if (audit.registry.duplicates.length) {
    console.log("\nRegistry duplicate src paths:");
    for (const [src, ids] of audit.registry.duplicates) {
        console.log(`  ${src} → resources ${ids.join(", ")}`);
    }
} else {
    console.log("Registry duplicate src paths: none");
}

console.log("\n=== Resolved page covers ===\n");
for (const [section, sectionAudit] of Object.entries(audit.sections)) {
    console.log(
        `${section}: ${sectionAudit.uniqueImages}/${sectionAudit.total} unique` +
            (sectionAudit.duplicates.length ? " — DUPLICATES FOUND" : ""),
    );
    for (const [src, items] of sectionAudit.duplicates) {
        console.log(
            `  ${src} → ${items.map((item) => `#${item.id} ${item.product}`).join(", ")}`,
        );
    }
}

console.log(
    `\nCatalog grid: ${audit.sections.catalog.uniqueImages === 12 ? "12/12 unique ✓" : `${audit.sections.catalog.uniqueImages}/12 unique ✗`}`,
);

console.log("\n=== Registry assignments ===\n");
for (const { id, src } of audit.registry.assignments) {
    const resource = library.find((item) => item.id === id);
    console.log(`#${id} ${resource?.product || "?"} → ${src}`);
}

if (!audit.ok) {
    console.error("\nResource image audit FAILED.");
    process.exit(1);
}

console.log("\nResource image audit passed.");
