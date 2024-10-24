import React, { useState, useEffect } from 'react';
import { getAllFlashcardSets, deleteAllFlashcardSets } from '../api/flashcardSetApi'; // Import the API functions
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';


/**
 * Settings component to manage user settings.
 */

function Settings() {
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [flashcardSets, setFlashcardSets] = useState([]);

    const fetchFlashcardSets = async () => {
        const sets = await getAllFlashcardSets();
        setFlashcardSets(sets);
    };

    const handleDeleteAllClick = async () => {
        await fetchFlashcardSets();
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        setIsLoading(true);
        setNotification('');
        setShowModal(false);
        try {
            await deleteAllFlashcardSets(); // Call the API to delete all flashcard sets
            setNotification('All flashcard sets have been deleted.');
        } catch (error) {
            setNotification('Failed to delete flashcard sets.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelDelete = () => {
        setShowModal(false);
    };

    return (
        <div className="container mt-5">
            <h1>Settings</h1>
            <button className="btn btn-danger mt-3" onClick={handleDeleteAllClick} disabled={isLoading}>
                {isLoading ? 'Deleting...' : 'Delete All Flashcard Sets'}
            </button>
            {notification && <div className="alert alert-success mt-3">{notification}</div>}

            <Modal show={showModal} onHide={handleCancelDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete all your flashcard sets?</p>
                    <ul>
                        {flashcardSets.map(set => (
                            <li key={set.id}>{set.name}</li>
                        ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelDelete}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Settings;