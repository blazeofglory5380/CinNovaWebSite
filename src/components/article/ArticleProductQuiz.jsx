import { useState } from "react";
import { productQuizQuestions, scoreProductQuiz } from "../../data/articleEngagement.js";
import { trackProductCtaClick } from "../../utils/analytics.js";

function ArticleProductQuiz({ post, onNavigate }) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [result, setResult] = useState(null);

    const current = productQuizQuestions[step];

    function choose(option) {
        const nextAnswers = [...answers, option];
        if (step >= productQuizQuestions.length - 1) {
            const recommendation = scoreProductQuiz(nextAnswers);
            setAnswers(nextAnswers);
            setResult(recommendation);
            return;
        }
        setAnswers(nextAnswers);
        setStep(step + 1);
    }

    function reset() {
        setStep(0);
        setAnswers([]);
        setResult(null);
    }

    return (
        <div className="article-widget article-product-quiz">
            <p className="article-widget-eyebrow">PRODUCT MATCH</p>
            <h3>Which CinNova product fits your needs?</h3>
            {!result ? (
                <>
                    <p className="article-widget-copy">
                        Question {step + 1} of {productQuizQuestions.length}
                    </p>
                    <p className="article-quiz-prompt">{current.prompt}</p>
                    <div className="article-quiz-options">
                        {current.options.map((option) => (
                            <button
                                key={option.label}
                                type="button"
                                className="article-quiz-option"
                                onClick={() => choose(option)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <div className="article-quiz-result">
                    <p className="article-quiz-result-label">Best match</p>
                    <strong>{result.name}</strong>
                    <p>{result.summary}</p>
                    <div className="article-quiz-actions">
                        <button
                            type="button"
                            className="primary-btn"
                            onClick={() => {
                                trackProductCtaClick({
                                    product: result.name,
                                    category: post.category,
                                    location: "article_product_quiz",
                                });
                                onNavigate?.(result.page);
                            }}
                        >
                            Explore {result.name} →
                        </button>
                        <button type="button" className="secondary-btn" onClick={reset}>
                            Retake quiz
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ArticleProductQuiz;
