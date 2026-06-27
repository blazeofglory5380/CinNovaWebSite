/**
 * Audit validation batches for duplicate resolved images or AI species labels.
 */
export function auditValidationRecords(records) {
    const byImage = new Map();
    const bySpecies = new Map();

    for (const record of records) {
        const imageKey = record.imagePath;
        const imageGroup = byImage.get(imageKey) || [];
        imageGroup.push(record.id);
        byImage.set(imageKey, imageGroup);

        const speciesKey = record.aiSpecies;
        const speciesGroup = bySpecies.get(speciesKey) || [];
        speciesGroup.push(record.imageFileName);
        bySpecies.set(speciesKey, speciesGroup);
    }

    const duplicateImageSrcs = [...byImage.entries()]
        .filter(([, ids]) => ids.length > 1)
        .map(([src, ids]) => ({ src, ids }));

    const duplicateAiSpecies = [...bySpecies.entries()]
        .filter(([, files]) => files.length > 1)
        .map(([species, files]) => ({ species, files }));

    return {
        duplicateImageSrcs,
        duplicateAiSpecies,
        ok: duplicateImageSrcs.length === 0,
    };
}

export function auditValidationLedger(records) {
    const byImagePath = new Map();

    for (const record of records) {
        const key = record.imagePath;
        const group = byImagePath.get(key) || [];
        group.push(record);
        byImagePath.set(key, group);
    }

    const duplicateCoverSrc = [...byImagePath.entries()]
        .filter(([, group]) => {
            const uniqueAi = new Set(group.map((item) => item.aiSpecies));
            return uniqueAi.size > 1;
        })
        .map(([imagePath, group]) => ({
            imagePath,
            aiSpecies: group.map((item) => item.aiSpecies),
        }));

    return {
        duplicateCoverSrc,
        ok: duplicateCoverSrc.length === 0,
    };
}
