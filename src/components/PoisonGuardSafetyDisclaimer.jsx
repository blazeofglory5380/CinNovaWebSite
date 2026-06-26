const DISCLAIMER_TEXT =
    "PoisonGuard is not a substitute for professional medical, veterinary, emergency, or poison-control advice. In an emergency, call 911 or Poison Control at 1-800-222-1222 in the U.S.";

function PoisonGuardSafetyDisclaimer({ variant = "prominent" }) {
    return (
        <aside
            className={`poisonguard-safety-disclaimer poisonguard-safety-disclaimer--${variant}`}
            role="note"
            aria-label="PoisonGuard safety disclaimer"
        >
            <p>{DISCLAIMER_TEXT}</p>
        </aside>
    );
}

export default PoisonGuardSafetyDisclaimer;
