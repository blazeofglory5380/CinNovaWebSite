/*
 * PricingProductNav — compact jump navigation for the Pricing page.
 *
 * Desktop: a horizontal row of chips; each is an anchor to a product's pricing
 * section (all sections stay visible — nothing is filtered/hidden).
 * Mobile: a native <select> dropdown that jumps to the chosen section.
 *
 * `items` = [{ label, href }] where href is the target section id (e.g. "#plan-studynest").
 */
function PricingProductNav({ items }) {
    function jumpTo(href) {
        const target = href && document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function handleChipClick(event, href) {
        // Smooth-scroll instead of the native instant jump, but keep the URL hash
        // updated and preserve the accessible anchor fallback (works without JS).
        event.preventDefault();
        jumpTo(href);
        if (window.history?.replaceState) {
            window.history.replaceState(null, "", href);
        }
    }

    function handleSelect(event) {
        const href = event.target.value;
        if (href) jumpTo(href);
        // Reset so re-selecting the same product still fires onChange.
        event.target.value = "";
    }

    return (
        <nav className="pricing-nav" aria-label="Jump to a product's pricing">
            <div className="pricing-nav-inner">
                <div className="pricing-nav-chips" role="list">
                    {items.map((item) => (
                        <a
                            key={item.href}
                            role="listitem"
                            className="pricing-nav-chip"
                            href={item.href}
                            onClick={(event) => handleChipClick(event, item.href)}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>

                <div className="pricing-nav-select-wrap">
                    <label className="pricing-nav-select-label" htmlFor="pricing-nav-select">
                        Jump to a product
                    </label>
                    <select
                        id="pricing-nav-select"
                        className="pricing-nav-select"
                        defaultValue=""
                        onChange={handleSelect}
                    >
                        <option value="" disabled>
                            Jump to a product…
                        </option>
                        {items.map((item) => (
                            <option key={item.href} value={item.href}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </nav>
    );
}

export default PricingProductNav;
