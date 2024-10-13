import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllFlashcardSets, createFlashcardSet } from '../api/flashcardSetApi';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

function Home() {
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newSetName, setNewSetName] = useState('');
    const [newSetDescription, setNewSetDescription] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFlashcardSets = async () => {
            const data = await getAllFlashcardSets();
            setFlashcardSets(data);
        };
        fetchFlashcardSets();
    }, []);

    const handleCreateSet = async () => {
        if (newSetName.trim() === '') {
            alert('Set name cannot be empty.');
            return;
        }
        const newSet = await createFlashcardSet({ name: newSetName, description: newSetDescription });
        navigate(`/set/${newSet.id}`);
    };

    return (
        <div className="container mt-5">
            <h1>Flashcard Sets</h1>
            <button className="btn btn-primary mb-4" onClick={() => setShowModal(true)}>
                Create New Set
            </button>
            <div className="row">
                {flashcardSets.map((set) => (
                    <div key={set.id} className="col-md-4 mb-4">
                        <Link to={`/set/${set.id}`} className="card flashcard-set">
                            <div className="card-body">
                                <h5 className="card-title">{set.name}</h5>
                                <p className="card-text">{set.description}</p>
                                <p className="card-text"><small>Total Flashcards: {set.totalFlashcards}</small></p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Create New Set</h5>
                                <button type="button" className="btn-close"
                                        onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="setName" className="form-label">Set Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="setName"
                                        value={newSetName}
                                        onChange={(e) => setNewSetName(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="setDescription" className="form-label">Set Description
                                        (optional)</label>
                                    <textarea
                                        className="form-control"
                                        id="setDescription"
                                        value={newSetDescription}
                                        onChange={(e) => setNewSetDescription(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}>Cancel
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleCreateSet}>Create!
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;