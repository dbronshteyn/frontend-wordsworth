import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllFlashcards } from '../api/flashcardApi';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/GrokMode.css';
import TextUtils from "../utils/TextUtils";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {materialOceanic} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Modal } from 'react-bootstrap';
import Confetti from 'react-confetti';

/**
 * Grok mode component for studying flashcards.
 */

const GrokMode = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [flashcards, setFlashcards] = useState([]);
    const [remainingFlashcards, setRemainingFlashcards] = useState([]);
    const [currentCard, setCurrentCard] = useState(null);
    const [correctCount, setCorrectCount] = useState({});
    const [isCorrect, setIsCorrect] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [stats, setStats] = useState({ totalAnswered: 0, correctAnswers: 0 });
    const [showConfetti, setShowConfetti] = useState(false);

    // Ref for the input field to auto-focus on new questions
    const answerInputRef = useRef(null);

    useEffect(() => {
        const fetchFlashcards = async () => {
            const data = await getAllFlashcards(id);
            const initialFlashcards = data.map(card => ({ ...card, mastered: false }));
            setFlashcards(initialFlashcards);
            setRemainingFlashcards(initialFlashcards); // Initialize the pool of remaining flashcards
            setCurrentCard(randomlySelectFlashcard(initialFlashcards)); // Select the first flashcard
        };
        fetchFlashcards();
    }, [id]);

    useEffect(() => {
        // Focus the input field when a new question is shown
        if (answerInputRef.current) {
            answerInputRef.current.focus();
        }
    }, [currentCard, showAnswer]);

    const randomlySelectFlashcard = (flashcardSet) => {
        // Randomly select a flashcard from the non-mastered set
        const randomIndex = Math.floor(Math.random() * flashcardSet.length);
        return flashcardSet[randomIndex];
    };

    const handleAnswerSubmit = () => {
        const correct = userAnswer.trim().toLowerCase() === currentCard.term.trim().toLowerCase();

        setStats(prevStats => ({
            totalAnswered: prevStats.totalAnswered + 1,
            correctAnswers: prevStats.correctAnswers + (correct ? 1 : 0)
        }));

        if (correct) {
            setIsCorrect(true);
            setCorrectCount(prev => ({
                ...prev,
                [currentCard.id]: (prev[currentCard.id] || 0) + 1
            }));

            if ((correctCount[currentCard.id] || 0) + 1 >= 2) {
                const updatedFlashcards = flashcards.map(card =>
                    card.id === currentCard.id ? { ...card, mastered: true } : card
                );
                setFlashcards(updatedFlashcards);
            }
        } else {
            setIsCorrect(false);
            setCorrectCount(prev => ({
                ...prev,
                [currentCard.id]: Math.max(0, (prev[currentCard.id] || 0) - 1)
            }));
        }

        setShowAnswer(true);
        setUserAnswer('');
    };

    const handleNextCard = () => {
        setIsCorrect(null);
        setShowAnswer(false);

        // Filter out mastered flashcards and create a new remaining pool
        const nonMasteredFlashcards = flashcards.filter(card => !card.mastered);

        if (nonMasteredFlashcards.length === 0) {
            setShowModal(true);  // All flashcards mastered, show completion modal
        } else {
            // When there's only one card left, select it and reset the remaining pool for next round
            if (remainingFlashcards.length === 0) {
                // Refill the pool with all non-mastered flashcards if it's empty
                const newRemainingFlashcards = nonMasteredFlashcards;
                const nextCard = randomlySelectFlashcard(newRemainingFlashcards);
                setRemainingFlashcards(newRemainingFlashcards.filter(card => card.id !== nextCard.id));  // Exclude the next card
                setCurrentCard(nextCard);
            } else {
                const nextCard = randomlySelectFlashcard(remainingFlashcards);
                setRemainingFlashcards(remainingFlashcards.filter(card => card.id !== nextCard.id));  // Exclude selected card from pool
                setCurrentCard(nextCard);
            }
        }
    };


    const handleRestart = () => {
        setShowModal(false);
        navigate(`/set/${id}`);
    };

    const masteredCount = flashcards.filter(card => card.mastered).length;
    const progressPercentage = (masteredCount / flashcards.length) * 100;

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !showAnswer) {
            handleAnswerSubmit();
        }
    };

    useEffect(() => {
        if (showModal) {
            setShowConfetti(true); // Show confetti when modal is opened
        }
    }, [showModal]);


    return (
        <div className="container mt-5 grasp-mode-container">
            {showConfetti && <Confetti />}
            {flashcards.length > 0 && (
                <>
                    <div className="progress mb-4">
                        <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${progressPercentage}%` }}
                            aria-valuenow={progressPercentage}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        >
                            {masteredCount}/{flashcards.length} Mastered
                        </div>
                    </div>

                    {currentCard && (
                        <div className="flashcard">
                            <div className="definition">
                                <h4>
                                    {TextUtils.extractTextAndCode(currentCard.definition).map((part, index) => {
                                        return part.type === 'text' ? (
                                            <span key={index}>{part.content}</span>
                                        ) : (
                                            <SyntaxHighlighter key={index} language={part.language}
                                                               style={materialOceanic}>
                                                {part.content}
                                            </SyntaxHighlighter>
                                        );
                                    })}
                                </h4>
                            </div>
                            <div className="answer-section mt-3">
                                {showAnswer ? (
                                    <div className={`answer-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
                                        {isCorrect ? (
                                            <div>Correct! 🎉</div>
                                        ) : (
                                            <div>
                                                Incorrect. The correct answer is: <strong>{currentCard.term}</strong>
                                            </div>
                                        )}
                                        <button className="btn btn-primary mt-2" onClick={handleNextCard}>Next</button>
                                    </div>
                                ) : (
                                    <>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter your answer"
                                            value={userAnswer}
                                            onChange={(e) => setUserAnswer(e.target.value)}
                                            onKeyDown={handleKeyPress} // Listen for the Enter key press
                                            ref={answerInputRef} // Auto-focus on this input
                                        />
                                        <button className="btn btn-success mt-2" onClick={handleAnswerSubmit}>
                                            Submit Answer
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modal for final stats */}
            <Modal show={showModal} onHide={handleRestart}>
                <Modal.Header closeButton>
                    <Modal.Title>Quiz Completed</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Total Questions Answered: {stats.totalAnswered}</p>
                    <p>Correct Answers: {stats.correctAnswers}</p>
                    <p>Mastered Cards: {masteredCount}/{flashcards.length}</p>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={handleRestart}>Go Back to Flashcard Set</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default GrokMode;
