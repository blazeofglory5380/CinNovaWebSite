import { availabilityLabel, COMMERCE_AVAILABILITY } from "../../data/commerceModels.js";
import "./AvailabilityBadge.css";

function statusModifier(status) {
    if (status === COMMERCE_AVAILABILITY.AVAILABLE) return "available";
    if (status === COMMERCE_AVAILABILITY.COMING_SOON) return "coming-soon";
    if (status === COMMERCE_AVAILABILITY.BETA) return "beta";
    if (status === COMMERCE_AVAILABILITY.UNAVAILABLE) return "unavailable";
    return "in-development";
}

function AvailabilityBadge({ status, className = "", label }) {
    if (!status) return null;
    const text = label || availabilityLabel(status);
    return (
        <span
            className={`availability-badge availability-badge--${statusModifier(status)} ${className}`.trim()}
            data-availability={status}
        >
            {text}
        </span>
    );
}

export default AvailabilityBadge;
