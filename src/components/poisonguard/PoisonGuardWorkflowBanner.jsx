import { poisonGuardWorkflowSteps } from "../../data/poisonGuardFeatures.js";

function PoisonGuardWorkflowBanner() {
    return (
        <div className="pg-workflow-banner" aria-label="PoisonGuard scan workflow">
            <ol className="pg-workflow-list">
                {poisonGuardWorkflowSteps.map((step, index) => (
                    <li key={step} className="pg-workflow-step">
                        <span className="pg-workflow-node">{step}</span>
                        {index < poisonGuardWorkflowSteps.length - 1 && (
                            <span className="pg-workflow-connector" aria-hidden="true">
                                <span className="pg-workflow-connector-line" />
                                <span className="pg-workflow-connector-arrow">↓</span>
                                <span className="pg-workflow-connector-pulse" />
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default PoisonGuardWorkflowBanner;
