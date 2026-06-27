import { useMemo, useState } from "react";

const TABS = [
    { id: "cashflow", label: "Cash Flow" },
    { id: "affordability", label: "Affordability" },
    { id: "mortgage", label: "Mortgage" },
];

function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(value || 0);
}

function ArticleRealEstateCalculators() {
    const [tab, setTab] = useState("cashflow");
    const [cashFlow, setCashFlow] = useState({
        rent: 2400,
        mortgage: 1600,
        taxes: 250,
        insurance: 120,
        maintenance: 200,
        vacancy: 5,
    });
    const [affordability, setAffordability] = useState({
        income: 9000,
        debts: 600,
        down: 60000,
        rate: 6.5,
    });
    const [mortgage, setMortgage] = useState({
        price: 350000,
        down: 70000,
        rate: 6.5,
        years: 30,
    });

    const cashFlowResult = useMemo(() => {
        const vacancyLoss = cashFlow.rent * (cashFlow.vacancy / 100);
        const expenses =
            cashFlow.mortgage + cashFlow.taxes + cashFlow.insurance + cashFlow.maintenance + vacancyLoss;
        return cashFlow.rent - expenses;
    }, [cashFlow]);

    const affordabilityResult = useMemo(() => {
        const monthlyIncome = affordability.income;
        const maxPayment = monthlyIncome * 0.28 - affordability.debts;
        const monthlyRate = affordability.rate / 100 / 12;
        const months = 360;
        if (maxPayment <= 0 || monthlyRate <= 0) {
            return Math.max(0, affordability.down);
        }
        const loan = (maxPayment * (1 - Math.pow(1 + monthlyRate, -months))) / monthlyRate;
        return Math.max(0, loan + affordability.down);
    }, [affordability]);

    const mortgageResult = useMemo(() => {
        const loan = Math.max(0, mortgage.price - mortgage.down);
        const monthlyRate = mortgage.rate / 100 / 12;
        const months = Math.max(mortgage.years * 12, 1);
        if (!loan) return 0;
        if (!monthlyRate) return loan / months;
        return (loan * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    }, [mortgage]);

    return (
        <div className="article-widget article-calculators">
            <p className="article-widget-eyebrow">REAL ESTATE TOOLS</p>
            <h3>Try the numbers while you read</h3>
            <div className="article-calc-tabs" role="tablist" aria-label="Calculator type">
                {TABS.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={tab === item.id}
                        className={`article-calc-tab${tab === item.id ? " article-calc-tab-active" : ""}`}
                        onClick={() => setTab(item.id)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {tab === "cashflow" && (
                <div className="article-calc-panel">
                    <div className="article-calc-grid">
                        {[
                            ["Monthly rent", "rent"],
                            ["Mortgage", "mortgage"],
                            ["Taxes", "taxes"],
                            ["Insurance", "insurance"],
                            ["Maintenance", "maintenance"],
                            ["Vacancy %", "vacancy"],
                        ].map(([label, key]) => (
                            <label key={key} className="article-calc-field">
                                <span>{label}</span>
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    value={cashFlow[key]}
                                    onChange={(e) =>
                                        setCashFlow({ ...cashFlow, [key]: Number(e.target.value) || 0 })
                                    }
                                />
                            </label>
                        ))}
                    </div>
                    <p className="article-calc-result">
                        Estimated monthly cash flow: <strong>{formatCurrency(cashFlowResult)}</strong>
                    </p>
                </div>
            )}

            {tab === "affordability" && (
                <div className="article-calc-panel">
                    <div className="article-calc-grid">
                        {[
                            ["Monthly income", "income"],
                            ["Monthly debts", "debts"],
                            ["Down payment", "down"],
                            ["Interest rate %", "rate"],
                        ].map(([label, key]) => (
                            <label key={key} className="article-calc-field">
                                <span>{label}</span>
                                <input
                                    type="number"
                                    value={affordability[key]}
                                    onChange={(e) =>
                                        setAffordability({
                                            ...affordability,
                                            [key]: Number(e.target.value) || 0,
                                        })
                                    }
                                />
                            </label>
                        ))}
                    </div>
                    <p className="article-calc-result">
                        Estimated max purchase price: <strong>{formatCurrency(affordabilityResult)}</strong>
                    </p>
                </div>
            )}

            {tab === "mortgage" && (
                <div className="article-calc-panel">
                    <div className="article-calc-grid">
                        {[
                            ["Purchase price", "price"],
                            ["Down payment", "down"],
                            ["Interest rate %", "rate"],
                            ["Loan term (years)", "years"],
                        ].map(([label, key]) => (
                            <label key={key} className="article-calc-field">
                                <span>{label}</span>
                                <input
                                    type="number"
                                    value={mortgage[key]}
                                    onChange={(e) =>
                                        setMortgage({ ...mortgage, [key]: Number(e.target.value) || 0 })
                                    }
                                />
                            </label>
                        ))}
                    </div>
                    <p className="article-calc-result">
                        Estimated monthly payment: <strong>{formatCurrency(mortgageResult)}</strong>
                    </p>
                </div>
            )}
        </div>
    );
}

export default ArticleRealEstateCalculators;
