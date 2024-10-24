import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useParams} from "react-router-dom";
import {getAllFlashcards} from "../api/flashcardApi";
import {getFlashcardSetById} from "../api/flashcardSetApi";
import TextUtils from "../utils/TextUtils";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {materialOceanic} from "react-syntax-highlighter/dist/esm/styles/prism";

/**
 * Component to display flashcards and allow the user to flip
 * between the term and definition.
 */

const CardsShow = () => {
    const { id } = useParams();
    const [flashcardSet, setFlashcardSet] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        const fetchFlashcardSet = async () => {
            const data = await getFlashcardSetById(id);
            setFlashcardSet(data);
        };
        const fetchFlashcards = async () => {
            const data = await getAllFlashcards(id);
            setFlashcards(data);
        };
        fetchFlashcardSet();
        fetchFlashcards();
    }, [id]);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleNextCard = () => {
        setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    };

    const handlePrevCard = () => {
        setIsFlipped(false);
        setCurrentCardIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
    };

    if (flashcards.length === 0) {
        return <div></div>;
    }

    const { term, definition } = flashcards[currentCardIndex];

    return (

        <Container className="d-flex flex-column align-items-center mt-4">
            <Row>
                <Col className="text-center">
                    <h1>{flashcardSet?.name}</h1>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>

                </Col>
            </Row>
            <Row className="mb-3">
                <Col xs={1} className="d-flex align-items-center justify-content-center">
                    <Button variant="outline-secondary" onClick={handlePrevCard}>
                        &larr;
                    </Button>
                </Col>

                <Col xs={10} className="d-flex justify-content-center">
                    <div
                        className="flashcard"
                        onClick={handleFlip}
                        style={{
                            width: '36rem',
                            height: '24rem',
                            perspective: '1000px',
                        }}
                    >
                        <div
                            className="flashcard-inner"
                            style={{
                                width: '100%',
                                height: '100%',
                                position: 'relative',
                                transformStyle: 'preserve-3d',
                                transition: 'transform 0.6s',
                                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                            }}
                        >
                            <Card
                                className="flashcard-front"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    backfaceVisibility: 'hidden',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <Card.Body className="text-center">
                                    <Card.Title>{term}</Card.Title>
                                </Card.Body>
                            </Card>
                            <Card
                                className="flashcard-back"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    backfaceVisibility: 'hidden',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    transform: 'rotateY(180deg)',
                                }}
                            >
                                <Card.Body className="text-center">
                                    <Card.Title>{TextUtils.extractTextAndCode(definition).map((part, index) => (
                                        part.type === 'text' ? (
                                            <span key={index}>{part.content}</span>
                                        ) : (
                                            <SyntaxHighlighter key={index} language={part.language} style={materialOceanic}>
                                                {part.content}
                                            </SyntaxHighlighter>
                                        )
                                    ))}</Card.Title>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </Col>

                <Col xs={1} className="d-flex align-items-center justify-content-center">
                    <Button variant="outline-secondary" onClick={handleNextCard}>
                        &rarr;
                    </Button>
                </Col>
            </Row>

            <Row className="mt-3">
                <Col className="text-center">
                    <p>{currentCardIndex + 1} / {flashcards.length}</p>
                </Col>
            </Row>
        </Container>
    );
};

export default CardsShow;
