import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllFlashcards } from '../api/flashcardApi';
import { Modal, ProgressBar } from 'react-bootstrap';
import Confetti from 'react-confetti';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import 'bootstrap/dist/css/bootstrap.min.css';
import {materialOceanic} from "react-syntax-highlighter/dist/esm/styles/prism";

const GraspMode = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [flashcards, setFlashcards] = useState([]);
    const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isCorrect, setIsCorrect] = useState(null);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [attemptedFlashcards, setAttemptedFlashcards] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [multipleChoiceMode, setMultipleChoiceMode] = useState(false);
    const [choices, setChoices] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const [flashcardStats, setFlashcardStats] = useState([]);
    const [totalAnswered, setTotalAnswered] = useState(0);

    // Fetch and initialize flashcards
    useEffect(() => {
        const fetchFlashcards = async () => {
            const data = await getAllFlashcards(id);
            const shuffledFlashcards = data.sort(() => 0.5 - Math.random());
            setFlashcards(shuffledFlashcards);
            setAttemptedFlashcards(
                data.reduce((acc, card) => ({ ...acc, [card.id]: { correct: 0, attempts: 0 } }), {})
            );
        };
        fetchFlashcards();
    }, [id]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter' && isCorrect !== null) {
                handleNext();
            }

            if (multipleChoiceMode) {
                const keyToIndexMap = { 1: 0, 2: 1, 3: 2, 4: 3 };
                if (keyToIndexMap[event.key] !== undefined) {
                    handleMultipleChoice(choices[keyToIndexMap[event.key]]);
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isCorrect, multipleChoiceMode, choices]);

    const extractTextAndCode = (definition) => {
        const codeRegex = /```(\w+)?\s*([\s\S]*?)```/g; // Regex to find content inside ``` ```
        const parts = [];
        let lastIndex = 0;

        let match;
        while ((match = codeRegex.exec(definition)) !== null) {
            // Push text before the code block
            if (lastIndex < match.index) {
                parts.push({ type: 'text', content: definition.slice(lastIndex, match.index) });
            }
            // Push the code block with language
            parts.push({ type: 'code', language: match[1], content: match[2] });
            lastIndex = match.index + match[0].length; // Update the last index to the end of the current match
        }

        // Push any remaining text after the last code block
        if (lastIndex < definition.length) {
            parts.push({ type: 'text', content: definition.slice(lastIndex) });
        }

        return parts; // Return array of parts
    };

    const calculateProgress = () => {
        const masteredFlashcards = Object.values(attemptedFlashcards).filter(attempt => attempt.correct >= 3);
        const progress = (masteredFlashcards.length / flashcards.length) * 100;
        return progress;
    };

    const generateMultipleChoice = () => {
        const correctFlashcard = flashcards[currentFlashcardIndex];
        let otherChoices = flashcards
            .filter(f => f.id !== correctFlashcard.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3); // 3 incorrect choices
        setChoices([correctFlashcard, ...otherChoices].sort(() => 0.5 - Math.random()));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const currentFlashcard = flashcards[currentFlashcardIndex];
        const userTerm = userAnswer.trim().toLowerCase();
        const correctTerm = currentFlashcard.term.trim().toLowerCase();

        if (userTerm === correctTerm) {
            setIsCorrect(true);
            setFeedback('Correct!');
            setCorrectAnswers(correctAnswers + 1);
            updateAttemptedFlashcards(currentFlashcard.id, true);
        } else {
            setIsCorrect(false);
            setFeedback(`Incorrect! The correct term is: ${currentFlashcard.term}`);
            updateAttemptedFlashcards(currentFlashcard.id, false);
        }
    };

    const handleMultipleChoice = (choice) => {
        const currentFlashcard = flashcards[currentFlashcardIndex];
        if (choice.id === currentFlashcard.id) {
            setIsCorrect(true);
            setFeedback('Correct!');
            setCorrectAnswers(correctAnswers + 1);
            updateAttemptedFlashcards(currentFlashcard.id, true);
        } else {
            setIsCorrect(false);
            setFeedback(`Incorrect! The correct term is: ${currentFlashcard.term}`);
            updateAttemptedFlashcards(currentFlashcard.id, false);
        }
    };

    const updateAttemptedFlashcards = (flashcardId, isCorrect) => {
        const currentStats = attemptedFlashcards[flashcardId];
        const newStats = {
            correct: isCorrect ? currentStats.correct + 1 : currentStats.correct,
            attempts: currentStats.attempts + 1,
        };

        setAttemptedFlashcards({
            ...attemptedFlashcards,
            [flashcardId]: newStats,
        });
        setTotalAnswered(totalAnswered + 1);
        updateFlashcardStats(flashcardId, newStats, isCorrect);
    };

    const updateFlashcardStats = (flashcardId, stats, isCorrect) => {
        const flashcard = flashcards.find(f => f.id === flashcardId);
        const newStats = {
            ...flashcardStats.find(stat => stat.id === flashcardId),
            id: flashcardId,
            term: flashcard.term,
            definition: flashcard.definition,
            correct: stats.correct,
            attempts: stats.attempts,
            lastAnswerCorrect: isCorrect,
        };

        const updatedStats = flashcardStats.filter(stat => stat.id !== flashcardId).concat(newStats);
        setFlashcardStats(updatedStats);
    };

    const handleNext = () => {
        setIsCorrect(null);
        setFeedback('');
        setUserAnswer('');

        if (calculateProgress() >= 100) {
            setShowConfetti(true);
            setShowModal(true);
            return;
        }

        const eligibleFlashcards = flashcards.filter(card => attemptedFlashcards[card.id].correct < 3);
        const nextIndex = Math.floor(Math.random() * eligibleFlashcards.length);
        setCurrentFlashcardIndex(flashcards.indexOf(eligibleFlashcards[nextIndex]));

        if (Math.random() > 0.5) {
            setMultipleChoiceMode(true);
            generateMultipleChoice();
        } else {
            setMultipleChoiceMode(false);
        }
    };

    const currentFlashcard = flashcards[currentFlashcardIndex];

    if (!flashcards.length) {
        return <div></div>; // Render nothing while loading flashcards
    }

    return (
        <div className="container mt-5">
            <h1>Grasp Mode</h1>

            {showConfetti && <Confetti />}

            <ProgressBar now={calculateProgress()} label={`${calculateProgress().toFixed(0)}%`} />

            <div className="card p-4 mt-4">
                <h3>What is the term for this definition:</h3>
                <h4 className="text-primary">
                    {extractTextAndCode(currentFlashcard.definition).map((part, index) => (
                        part.type === 'text' ? (
                            <span key={index}>{part.content}</span>
                        ) : (
                            <SyntaxHighlighter key={index} language={part.language} style={materialOceanic}>
                                {part.content}
                            </SyntaxHighlighter>
                        )
                    ))}
                </h4>

                {!multipleChoiceMode ? (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter the term"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                disabled={isCorrect !== null}
                            />
                        </div>

                        {isCorrect === null && (
                            <button type="submit" className="btn btn-primary mt-3">Submit</button>
                        )}

                        {isCorrect !== null && (
                            <div className={`mt-3 alert ${isCorrect ? 'alert-success' : 'alert-danger'}`}>
                                {feedback}
                            </div>
                        )}

                        {isCorrect !== null && (
                            <button
                                type="button"
                                className="btn btn-secondary mt-3"
                                onClick={handleNext}
                            >
                                Next
                            </button>
                        )}
                    </form>
                ) : (
                    <>
                        <h3>Select the correct term for this definition (use 1, 2, 3, or 4 keys):</h3>
                        <ul className="list-group mt-3">
                            {choices.map((choice, index) => (
                                <li className="list-group-item" key={choice.id}>
                                    {index + 1}. {choice.term}
                                </li>
                            ))}
                        </ul>

                        {isCorrect !== null && (
                            <div className={`mt-3 alert ${isCorrect ? 'alert-success' : 'alert-danger'}`}>
                                {feedback}
                            </div>
                        )}

                        {isCorrect !== null && (
                            <button
                                type="button"
                                className="btn btn-secondary mt-3"
                                onClick={handleNext}
                            >
                                Next
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* Modal for completion */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>🎉 Congratulations!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>You have completed the flashcard set!</p>
                    <p>Your correct answers: {correctAnswers}/{totalAnswered}</p>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => navigate('/')}>Go Home</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default GraspMode;
