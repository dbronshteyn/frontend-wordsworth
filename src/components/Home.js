import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllFlashcardSets, createFlashcardSet } from '../api/flashcardSetApi';
import Papa from 'papaparse';  // Import PapaParse
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Home.css';

/**
 * Home component to display all flashcard sets.
 */

function Home() {
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);  // For Import Modal
    const [newSetName, setNewSetName] = useState('');
    const [newSetDescription, setNewSetDescription] = useState('');
    const [csvFile, setCsvFile] = useState(null); // For CSV file upload
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

    const handleCsvFileChange = (event) => {
        setCsvFile(event.target.files[0]);
    };

    const handleCsvImport = () => {
        if (!csvFile) {
            alert('Please upload a CSV file');
            return;
        }

        Papa.parse(csvFile, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                const { data, errors } = results;

                if (errors.length > 0) {
                    console.error('CSV parsing errors:', errors);
                    alert('Error parsing CSV file. Please check the format.');
                    return;
                }

                // Validate CSV structure
                if (!data[0].term || !data[0].definition) {
                    alert('Invalid CSV structure. Ensure the CSV has "term" and "definition" columns.');
                    return;
                }

                console.log('Parsed Data:', data);

                // Call API to create a new set using CSV data
                const setName = csvFile.name.split('.csv')[0];  // Use filename as set name
                const description = `Imported from ${csvFile.name}`;
                createFlashcardSet({ name: setName, description, flashcards: data })
                    .then((newSet) => {
                        navigate(`/set/${newSet.id}`);
                    })
                    .catch((error) => {
                        console.error('Error creating flashcard set:', error);
                        alert('Failed to create flashcard set from CSV.');
                    });
            }
        });
    };

    return (
        <div className="container mt-5">
            <h1>Flashcard Sets</h1>
            <button className="btn btn-primary mb-4" onClick={() => setShowModal(true)}>
                Create New Set
            </button>
            <button className="btn btn-success mb-4 ms-2" onClick={() => setShowImportModal(true)}>
                Import Set from CSV
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

            {/* Create Set Modal */}
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
                                    <label htmlFor="setDescription" className="form-label">Set Description (optional)</label>
                                    <textarea
                                        className="form-control"
                                        id="setDescription"
                                        value={newSetDescription}
                                        onChange={(e) => setNewSetDescription(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={handleCreateSet}>Create!</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Import Set Modal */}
            {showImportModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Import Flashcard Set</h5>
                                <button type="button" className="btn-close"
                                        onClick={() => setShowImportModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Upload a CSV file with "term" and "definition" columns.</p>
                                <input type="file" accept=".csv" onChange={handleCsvFileChange} />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowImportModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-success" onClick={handleCsvImport}>Import</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
