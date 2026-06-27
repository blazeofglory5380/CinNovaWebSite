import { useState } from "react";
import { buildStudyToolsFromPost } from "../../data/articleEngagement.js";
import { trackEvent } from "../../utils/analytics.js";

function ArticleStudyTools({ post }) {
    const { flashcards, quiz, summaries } = buildStudyToolsFromPost(post);
    const [cardIndex, setCardIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [quizIndex, setQuizIndex] = useState(0);
    const [quizScore, setQuizScore] = useState(0);
    const [quizDone, setQuizDone] = useState(false);
    const [saved, setSaved] = useState(false);

    const currentCard = flashcards[cardIndex] || flashcards[0];
    const currentQuiz = quiz[quizIndex];

    function saveNotes() {
        const notes = summaries.map((item) => `${item.title}: ${item.body}`).join("\n\n");
        const blob = new Blob([`${post.title}\n\n${notes}`], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `cin-nova-notes-${post.slug}.txt`;
        link.click();
        URL.revokeObjectURL(url);
        setSaved(true);
        trackEvent("article_study_notes_save", { article_slug: post.slug });
    }

    function answerQuiz(choiceIndex) {
        if (choiceIndex === currentQuiz.correct) setQuizScore((s) => s + 1);
        if (quizIndex >= quiz.length - 1) {
            setQuizDone(true);
            return;
        }
        setQuizIndex(quizIndex + 1);
    }

    return (
        <div className="article-widget article-study-tools">
            <p className="article-widget-eyebrow">STUDY TOOLS</p>
            <h3>Review this article like a StudyNest session</h3>

            <div className="article-study-block">
                <p className="article-study-label">Flashcards</p>
                {currentCard && (
                    <button
                        type="button"
                        className={`sn-flashcard article-study-flashcard${flipped ? " article-study-flashcard-flipped" : ""}`}
                        onClick={() => setFlipped(!flipped)}
                    >
                        <p className="sn-flashcard-prompt">{flipped ? currentCard.answer : currentCard.prompt}</p>
                        <p className="sn-flashcard-answer">{flipped ? "Tap to see question" : "Tap to reveal answer"}</p>
                    </button>
                )}
                <div className="article-study-nav">
                    <button
                        type="button"
                        className="secondary-btn"
                        onClick={() => {
                            setFlipped(false);
                            setCardIndex((cardIndex - 1 + flashcards.length) % flashcards.length);
                        }}
                    >
                        Previous
                    </button>
                    <span>
                        {cardIndex + 1} / {flashcards.length}
                    </span>
                    <button
                        type="button"
                        className="secondary-btn"
                        onClick={() => {
                            setFlipped(false);
                            setCardIndex((cardIndex + 1) % flashcards.length);
                        }}
                    >
                        Next
                    </button>
                </div>
            </div>

            <div className="article-study-block">
                <p className="article-study-label">Quick quiz</p>
                {!quizDone && currentQuiz ? (
                    <>
                        <p className="article-quiz-prompt">{currentQuiz.question}</p>
                        <div className="article-quiz-options">
                            {currentQuiz.options.map((option, i) => (
                                <button
                                    key={option}
                                    type="button"
                                    className="article-quiz-option"
                                    onClick={() => answerQuiz(i)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <p className="article-calc-result">
                        Score: <strong>{quizScore}</strong> / {quiz.length}
                    </p>
                )}
            </div>

            <div className="article-study-block">
                <p className="article-study-label">Summary cards</p>
                <div className="article-summary-grid">
                    {summaries.map((item) => (
                        <div key={item.title} className="article-summary-card">
                            <strong>{item.title}</strong>
                            <p>{item.body}</p>
                        </div>
                    ))}
                </div>
            </div>

            <button type="button" className="primary-btn" onClick={saveNotes}>
                {saved ? "Notes saved" : "Save to notes"}
            </button>
        </div>
    );
}

export default ArticleStudyTools;
