import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getFlashcardSetById, deleteFlashcardSet, updateFlashcardSet } from '../api/flashcardSetApi';
import { getAllFlashcards, createFlashcard, updateFlashcard, deleteFlashcard } from '../api/flashcardApi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Dark mode style
import 'bootstrap/dist/css/bootstrap.min.css';
import './FlashcardSetDetail.css';

const FlashcardSetDetail = () => {
    const { id } = useParams();
    const [flashcardSet, setFlashcardSet] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [editingFlashcard, setEditingFlashcard] = useState(null);
    const [editTerm, setEditTerm] = useState('');
    const [editDefinition, setEditDefinition] = useState('');
    const [newFlashcard, setNewFlashcard] = useState(null);
    const [newTerm, setNewTerm] = useState('');
    const [newDefinition, setNewDefinition] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFlashcardSet = async () => {
            const data = await getFlashcardSetById(id);
            setFlashcardSet(data);
            setEditName(data.name);
            setEditDescription(data.description);
        };
        const fetchFlashcards = async () => {
            const data = await getAllFlashcards(id);
            setFlashcards(data);
        };
        fetchFlashcardSet();
        fetchFlashcards();
    }, [id]);

    const handleDelete = async () => {
        await deleteFlashcardSet(id);
        navigate('/'); // Navigate back to the homepage after deletion
    };

    const handleEdit = async () => {
        if (editName.trim() === '') {
            setErrorMessage('Set name cannot be empty. Please enter a valid name.');
            return;
        }
        const updatedFlashcardSet = { ...flashcardSet, name: editName, description: editDescription };
        const updatedSet = await updateFlashcardSet(id, updatedFlashcardSet);
        setFlashcardSet(updatedSet);
        setIsEditing(false);
        setErrorMessage('');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditName(flashcardSet.name);
        setEditDescription(flashcardSet.description);
        setErrorMessage('');
    };

    const handleFlashcardDoubleClick = (flashcard, event) => {
        if (event.target.classList.contains('delete-icon')) {
            return;
        }
        setEditingFlashcard(flashcard);
        setEditTerm(flashcard.term);
        setEditDefinition(flashcard.definition);
    };

    const handleFlashcardSave = async () => {
        const updatedFlashcard = { ...editingFlashcard, term: editTerm, definition: editDefinition };
        await updateFlashcard(id, editingFlashcard.id, updatedFlashcard);
        setFlashcards(flashcards.map(f => f.id === editingFlashcard.id ? updatedFlashcard : f));
        setEditingFlashcard(null);
    };

    const handleFlashcardCancel = () => {
        setEditingFlashcard(null);
    };

    const handleCreateNewFlashcard = () => {
        setNewFlashcard(true);
        setNewTerm('');
        setNewDefinition('');
    };

    const handleNewFlashcardSave = async () => {
        const newFlashcard = await createFlashcard(id, { term: newTerm, definition: newDefinition });
        setFlashcards([...flashcards, newFlashcard]);
        setNewFlashcard(null);
    };

    const handleNewFlashcardCancel = () => {
        setNewFlashcard(null);
    };

    const handleFlashcardDelete = async (flashcardId) => {
        await deleteFlashcard(id, flashcardId);
        setFlashcards(flashcards.filter(f => f.id !== flashcardId));
    };

    // Function to extract code and text from the definition
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

    return (
        <div className="container mt-5">
            {flashcards.length > 0 ? (
                <Link to={`/grasp/${id}`} className="btn btn-primary">Grasp</Link>
            ) : (
                <button className="btn btn-primary" disabled>Grasp</button>
            )}
            <div className="d-flex justify-content-between">
                <div>
                    {isEditing ? (
                        <>
                            <input
                                type="text"
                                className="form-control mb-2"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                            <textarea
                                className="form-control mb-2"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                            />
                            {errorMessage && <div className="alert alert-warning">{errorMessage}</div>}
                        </>
                    ) : (
                        flashcardSet && (
                            <>
                                <h1>{flashcardSet.name}</h1>
                                <p>{flashcardSet.description}</p>
                            </>
                        )
                    )}
                </div>
                <div>
                    {isEditing ? (
                        <>
                            <button className="btn btn-success me-2" onClick={handleEdit}>
                                Update
                            </button>
                            <button className="btn btn-secondary" onClick={handleCancel}>
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="btn btn-outline-secondary me-2" onClick={() => setIsEditing(true)}>
                                Edit
                            </button>
                            <button className="btn btn-danger" onClick={handleDelete}>
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>

            {flashcardSet && (
                <>
                    <h2 className="mt-4">Flashcards</h2>
                    <ul className="list-group">
                        {flashcards.map((flashcard) => (
                            <li key={flashcard.id} className="list-group-item d-flex justify-content-between align-items-center" onDoubleClick={(e) => handleFlashcardDoubleClick(flashcard, e)}>
                                {editingFlashcard && editingFlashcard.id === flashcard.id ? (
                                    <div className="row w-100">
                                        <div className="col-md-5">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editTerm}
                                                onChange={(e) => setEditTerm(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-5">
                                            <textarea
                                                className="form-control"
                                                value={editDefinition}
                                                onChange={(e) => setEditDefinition(e.target.value)}
                                                placeholder="Enter definition or code"
                                            />
                                        </div>
                                        <div className="col-md-2 d-flex align-items-center">
                                            <button className="btn btn-success me-2" onClick={handleFlashcardSave}>Save</button>
                                            <button className="btn btn-secondary" onClick={handleFlashcardCancel}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="row w-100">
                                        <div className="col-md-5 flashcard-term">
                                            {flashcard.term}
                                        </div>
                                        <div className="col-md-5 flashcard-definition">
                                            {extractTextAndCode(flashcard.definition).map((part, index) => (
                                                part.type === 'text' ? (
                                                    <span key={index}>{part.content}</span>
                                                ) : (
                                                    <SyntaxHighlighter key={index} language={part.language} style={atomDark}>
                                                        {part.content}
                                                    </SyntaxHighlighter>
                                                )
                                            ))}
                                        </div>
                                        <div className="col-md-2 d-flex justify-content-end">
                                            <button className="delete-icon" onClick={() => handleFlashcardDelete(flashcard.id)}>X</button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                        {newFlashcard && (
                            <li className="list-group-item">
                                <div className="row">
                                    <div className="col-md-5">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newTerm}
                                            onChange={(e) => setNewTerm(e.target.value)}
                                            placeholder="Enter term"
                                        />
                                    </div>
                                    <div className="col-md-5">
                                        <textarea
                                            className="form-control"
                                            value={newDefinition}
                                            onChange={(e) => setNewDefinition(e.target.value)}
                                            placeholder="Enter definition or code"
                                        />
                                    </div>
                                    <div className="col-md-2 d-flex align-items-center">
                                        <button className="btn btn-success me-2" onClick={handleNewFlashcardSave}>Save</button>
                                        <button className="btn btn-secondary" onClick={handleNewFlashcardCancel}>Cancel</button>
                                    </div>
                                </div>
                            </li>
                        )}
                    </ul>
                </>
            )}

            <div className="mt-5">
                <button className="btn btn-success" onClick={handleCreateNewFlashcard}>Create New Flashcard</button>
            </div>
        </div>
    );
};

export default FlashcardSetDetail;