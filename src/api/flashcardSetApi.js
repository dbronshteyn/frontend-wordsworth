// src/api/flashcardSetApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/flashcard-sets'; // Adjust this if needed

// Fetch all flashcard sets
export const getAllFlashcardSets = async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
};

// Fetch a specific flashcard set by ID
export const getFlashcardSetById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
};

// Create a new flashcard set
export const createFlashcardSet = async (flashcardSet) => {
    const response = await axios.post(API_BASE_URL, flashcardSet);
    return response.data;
};

// Update a flashcard set
export const updateFlashcardSet = async (id, flashcardSet) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, flashcardSet);
    return response.data;
};

// Delete a flashcard set
export const deleteFlashcardSet = async (id) => {
    await axios.delete(`${API_BASE_URL}/${id}`);
};

export const deleteAllFlashcardSets = async () => {
    const flashcardSets = await getAllFlashcardSets();
    const deletePromises = flashcardSets.map(set => deleteFlashcardSet(set.id));
    await Promise.all(deletePromises);
};
