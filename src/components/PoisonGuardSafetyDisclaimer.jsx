const DISCLAIMER_TEXT =
    "Poison Guard is not a substitute for emergency services, poison control, veterinary care, or professional medical advice. If someone may have been exposed to a poisonous animal, toxic plant, or hazardous chemical, contact emergency services or poison control immediately.";

function PoisonGuardSafetyDisclaimer({ variant = "prominent" }) {
    return (
        <aside
            className={`poisonguard-safety-disclaimer poisonguard-safety-disclaimer--${variant}`}
            role="note"
            aria-label="Poison Guard safety disclaimer"
        >
            <p>{DISCLAIMER_TEXT}</p>
        </aside>
    );
}

export default PoisonGuardSafetyDisclaimer;
