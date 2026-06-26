export function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function getSearchTerms(query) {
    return query
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter((term) => term.length > 1);
}

export function highlightSearchText(text, query) {
    const terms = getSearchTerms(query);
    if (!terms.length || !text) return [{ text, match: false }];

    const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
    const parts = text.split(pattern).filter(Boolean);

    return parts.map((part) => ({
        text: part,
        match: terms.includes(part.toLowerCase()),
    }));
}
